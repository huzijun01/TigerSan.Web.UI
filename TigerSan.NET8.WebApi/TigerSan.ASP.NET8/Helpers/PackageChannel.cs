using System.Globalization;
using System.Threading.Channels;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.TimerHelper;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class PackageChannel
    {
        #region 【Fields】
        /// <summary>管道</summary>
        private readonly Channel<string> _channel;
        /// <summary>批量阈值</summary>
        private const int BatchSize = 1000;
        /// <summary>服务提供者</summary>
        private IServiceProvider _serviceProvider;
        /// <summary>“在线状态”更新定时器</summary>
        public ActionTimer _onlineStateUpdater = new ActionTimer(5000, true);
        /// <summary>“标签”缓存</summary>
        private Dictionary<string, TagEntity> _tagCaches = new Dictionary<string, TagEntity>();
        /// <summary>“基站”缓存</summary>
        private Dictionary<string, BaseStationEntity> _baseStationCaches = new Dictionary<string, BaseStationEntity>();
        /// <summary>“标签”服务</summary>
        private ITagService TagService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<ITagService>(); }
        /// <summary>“基站”服务</summary>
        private IBaseStationService BaseStationService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IBaseStationService>(); }
        #endregion 【Fields】

        #region 【Ctor】
        public PackageChannel(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _onlineStateUpdater._action = UpdateOnlineState;

            // 配置单消费者模式，极致压榨无锁性能 
            _channel = Channel.CreateBounded<string>(new BoundedChannelOptions(50000)
            {
                SingleReader = true,
                FullMode = BoundedChannelFullMode.DropOldest
            });
        }
        #endregion 【Ctor】

        #region 生产
        /// <summary>生产</summary>
        public async ValueTask Publish(string data) => await _channel.Writer.WriteAsync(data);
        #endregion

        #region 消费
        /// <summary>消费</summary>
        public async Task StartProcessingAsync(CancellationToken ct)
        {
            var buffer = new List<string>(BatchSize);
            while (await _channel.Reader.WaitToReadAsync(ct))
            {
                while (buffer.Count < BatchSize && _channel.Reader.TryRead(out var item))
                {
                    buffer.Add(item);
                }

                if (buffer.Any())
                {
                    await SaveToDbAsync(buffer);
                    buffer.Clear();
                }
            }
        }
        #endregion

        #region 保存到DB
        /// <summary>保存到DB</summary>
        private async Task SaveToDbAsync(List<string> datas)
        {
            Console.WriteLine($"Received SSE data:");
            foreach (var data in datas)
            {
                var pkgBase = PackageBase.Deserialize(data);
                if (pkgBase == null)
                {
                    LogHelper.Instance.IsNull(nameof(pkgBase));
                    return;
                }

                if (Equals(pkgBase.Type, PackageType.BluetoothTag))
                {
                    var pkgBluetoothTag = BluetoothTagPackage.Deserialize(data);
                    if (pkgBluetoothTag == null)
                    {
                        LogHelper.Instance.IsNull(nameof(pkgBluetoothTag));
                        return;
                    }

                    await EditBaseStationAndTagAsync(pkgBluetoothTag);
                    //Console.WriteLine(pkgBluetoothTag.Serialize());
                }
                else if (Equals(pkgBase.Type, PackageType.Locator4g))
                {
                    var pkgBluetoothTag = Locator4gPackage.Deserialize(data);
                    if (pkgBluetoothTag == null)
                    {
                        LogHelper.Instance.IsNull(nameof(pkgBluetoothTag));
                        return;
                    }

                    await EditBaseStationAndTagAsync(pkgBluetoothTag);
                    //Console.WriteLine(pkgBluetoothTag.Serialize());
                }
                else
                {
                    LogHelper.Instance.Warning($"Unknown package type: {pkgBase.Type}");
                }
            }
        }
        #endregion

        #region 更新“基站”缓存
        /// <summary>更新“基站”缓存</summary>
        public async Task UpdateBaseStationCachesAsync()
        {
            var baseStationService = BaseStationService;
            if (baseStationService == null)
            {
                LogHelper.Instance.IsNull(nameof(baseStationService));
                return;
            }

            var baseStations = await baseStationService.GetList();

            _baseStationCaches.Clear();
            foreach (var baseStation in baseStations)
            {
                _baseStationCaches.Add(baseStation.MacAddr, baseStation);
            }
        }
        #endregion

        #region 更新“标签”缓存
        /// <summary>更新“标签”缓存</summary>
        public async Task UpdateTagCachesAsync()
        {
            var tagService = TagService;
            if (tagService == null)
            {
                LogHelper.Instance.IsNull(nameof(tagService));
                return;
            }

            var tags = await tagService.GetList();
            _tagCaches.Clear();
            foreach (var tag in tags)
            {
                _tagCaches.Add(tag.TagId, tag);
            }
        }
        #endregion

        #region 获取“当前UTC时间”
        /// <summary>当前UTC时间</summary>
        private DateTime GetUtcNow()
        {
            return DateTime.UtcNow.AddHours(8);
        }
        #endregion

        #region 获取“UTC时间”
        /// <summary>UTC时间</summary>
        private DateTime GetUtc(string strTime)
        {
            DateTime time;
            DateTimeStyles style = DateTimeStyles.RoundtripKind;

            if (DateTime.TryParse(strTime, CultureInfo.InvariantCulture, style, out time))
            {
                // 处理不同Kind的转换逻辑
                return time.Kind switch
                {
                    DateTimeKind.Utc => time, // 已是UTC时间
                    DateTimeKind.Local => time.ToUniversalTime(), // 本地时间转UTC
                    _ => time // Unspecified视为本地时间处理
                };
            }
            else
            {
                time = GetUtcNow();
                LogHelper.Instance.Warning($"Invalid time format: ${strTime}`");
            }

            return time;
        }
        #endregion

        #region 修改“基站”
        /// <summary>修改“基站”</summary>
        public async Task<BaseStationEntity?> EditBaseStationAsync(
            string CollectorId,
            string ReportTime,
            Action<BaseStationEntity>? updateBaseStation)
        {
            // 修改“基站”:
            _baseStationCaches.TryGetValue(CollectorId, out var baseStation);
            if (baseStation == null) return null;

            var baseStationService = BaseStationService;
            if (baseStationService == null)
            {
                LogHelper.Instance.IsNull(nameof(baseStationService));
                return null;
            }

            baseStation.LastReportTime = GetUtc(ReportTime);
            baseStation.OnlineState = OnlineState.Online;
            updateBaseStation?.Invoke(baseStation);

            await baseStationService.Edit(baseStation);

            return baseStation;
        }
        #endregion

        #region 修改“基站”和“标签”
        /// <summary>修改“基站”和“标签”</summary>
        public async Task EditBaseStationAndTagAsync(BluetoothTagPackage package)
        {
            var baseStation = await EditBaseStationAsync(package.Data.CollectorId, package.ReportTime, null);

            foreach (var tagData in package.Data.TagDatas)
            {
                _tagCaches.TryGetValue(tagData.TagId, out var tag);
                if (tag == null) return;

                var tagService = TagService;
                if (tagService == null)
                {
                    LogHelper.Instance.IsNull(nameof(tagService));
                    return;
                }

                tag.LastReportTime = GetUtc(package.ReportTime);
                tag.OnlineState = OnlineState.Online;
                tag.Station = baseStation?.Id;
                tag.Battery = tagData.Voltage;
                tag.Temperature = tagData.Temperature;
                tag.Signal = tagData.Signal;

                await tagService.Edit(tag);
            }
        }

        /// <summary>修改“基站”和“标签”</summary>
        public async Task EditBaseStationAndTagAsync(Locator4gPackage package)
        {
            var baseStation = await EditBaseStationAsync(package.Data.CollectorId, package.ReportTime, null);

            foreach (var tagData in package.Data.TagDatas)
            {
                _tagCaches.TryGetValue(tagData.MacAddr, out var tag);
                if (tag == null) return;

                var tagService = TagService;
                if (tagService == null)
                {
                    LogHelper.Instance.IsNull(nameof(tagService));
                    return;
                }

                tag.LastReportTime = GetUtc(package.ReportTime);
                tag.OnlineState = OnlineState.Online;
                tag.Station = baseStation?.Id;
                tag.Battery = package.Data.Battery;
                tag.Signal = tagData.SignalStrength;

                await tagService.Edit(tag);
            }
        }
        #endregion

        #region 更新“在线状态”
        /// <summary>更新“在线状态”</summary>
        private void UpdateOnlineState()
        {
            // 基站:
            var timeOutBaseStations = new List<BaseStationEntity>();

            foreach (var baseStationCache in _baseStationCaches)
            {
                var baseStation = baseStationCache.Value;
                if (baseStation.OnlineState == OnlineState.Offline) continue;

                if (baseStation.LastReportTime == null ||
                    (GetUtcNow() - baseStation.LastReportTime.Value).TotalSeconds > baseStation.HeartbeatInterval)
                {
                    baseStation.OnlineState = OnlineState.Offline;
                    timeOutBaseStations.Add(baseStation);
                }
            }

            BaseStationService.EditRange(timeOutBaseStations);

            // 标签:
            var timeOutTags = new List<TagEntity>();

            foreach (var tagCache in _tagCaches)
            {
                var tag = tagCache.Value;
                if (tag.OnlineState == OnlineState.Offline) continue;

                if (tag.LastReportTime == null ||
                    (GetUtcNow() - tag.LastReportTime.Value).TotalSeconds > 3600)
                {
                    tag.OnlineState = OnlineState.Offline;
                    timeOutTags.Add(tag);
                }
            }

            TagService.EditRange(timeOutTags);
        }
        #endregion
    }
}
