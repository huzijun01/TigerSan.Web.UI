using System.Globalization;
using System.Threading.Channels;
using TigerSan.CsvLog;
using TigerSan.TimerHelper;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

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
        public ActionTimer _onlineStateUpdater = new ActionTimer(Constants.OnlineStateUpdater_Interval_Seconds * 1000, true);
        #endregion 【Fields】

        #region 【Properties】
        /// <summary>“标签”服务</summary>
        private ITagService TagService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<ITagService>(); }
        /// <summary>“场地”服务</summary>
        private ISiteService SiteService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<ISiteService>(); }
        /// <summary>“基站”服务</summary>
        private IBaseStationService BaseStationService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IBaseStationService>(); }
        /// <summary>“资产记录”服务</summary>
        private IAssetRecordService AssetRecordService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IAssetRecordService>(); }
        #endregion 【Properties】

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
            }, droppedItem =>
            {
                LogHelper.Instance.Warning($"Channel is full. Dropping oldest item: {droppedItem}");
            });
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [Private]
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
                time = DateTimeHelper.GetUtcNow();
                LogHelper.Instance.Warning($"Invalid time format: ${strTime}`");
            }

            return time;
        }
        #endregion
        #endregion [Private]

        #region [管道]
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
        #endregion [管道]

        #region [DB]
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
                    var pkgLocator4g = Locator4gPackage.Deserialize(data);
                    if (pkgLocator4g == null)
                    {
                        LogHelper.Instance.IsNull(nameof(pkgLocator4g));
                        return;
                    }

                    await EditBaseStationAndTagAsync(pkgLocator4g);
                    //Console.WriteLine(pkgBluetoothTag.Serialize());
                }
                else
                {
                    LogHelper.Instance.Warning($"Unknown package type: {pkgBase.Type}");
                }
            }
        }
        #endregion

        #region 修改“基站”
        /// <summary>修改“基站”</summary>
        public async Task<BaseStationEntity?> EditBaseStationAsync(
            string CollectorId,
            string ReportTime,
            Action<BaseStationEntity>? updateBaseStation)
        {
            var baseStationService = BaseStationService;

            // 修改“基站”:
            var res = await baseStationService.GetByMacAddr(CollectorId);
            var baseStation = res.Data;
            if (baseStation == null) return null;

            baseStation.ReportTime = GetUtc(ReportTime);
            baseStation.OnlineState = OnlineStates.Online;
            updateBaseStation?.Invoke(baseStation);

            await baseStationService.Edit(baseStation);

            return baseStation;
        }
        #endregion

        #region 修改“基站”和“标签”（蓝牙）
        /// <summary>修改“基站”和“标签”（蓝牙）</summary>
        public async Task<MyActionResult<object>> EditBaseStationAndTagAsync(BluetoothTagPackage package)
        {
            var tagService = TagService;
            var baseStation = await EditBaseStationAsync(package.Data.CollectorId, package.ReportTime, null);

            foreach (var tagData in package.Data.TagDatas)
            {
                var resGetFullByTagId = await tagService.GetFullByTagId(tagData.TagId);
                var tag = resGetFullByTagId.Data;
                if (tag == null) return MyResults<object>.IsNull(nameof(tag));

                var newTag = new TagDto();
                newTag.ShallowCopy(tag);
                newTag.ReportTime = GetUtc(package.ReportTime);
                newTag.OnlineState = OnlineStates.Online;
                newTag.Station = baseStation?.Id;
                newTag.Battery = tagData.Voltage;
                newTag.Temperature = tagData.Temperature;
                newTag.Signal = tagData.Signal;

                #region 计算“经纬度”
                if (baseStation == null)
                {
                    newTag.Longitude = 0;
                    newTag.Latitude = 0;
                }
                else
                {
                    var resGetSite = await SiteService.Get(baseStation.Site);
                    var site = resGetSite.Data;
                    if (site == null)
                    {
                        return resGetSite.Convert<object>();
                    }
                    newTag.Longitude = site.Longitude;
                    newTag.Latitude = site.Latitude;
                }
                #endregion 计算“经纬度”

                var resEdit = await tagService.Edit(newTag);
                if (!resEdit.IsSuccess)
                {
                    return resEdit.Convert<object>();
                }

                var resAsset = await AssetRecordService.EditAssetRecordAsync(tag, newTag);
                if (!resAsset.IsSuccess)
                {
                    return resAsset.Convert<object>();
                }
            }

            return MyResults<object>.Success();
        }
        #endregion

        #region 修改“基站”和“标签”（4G）
        /// <summary>修改“基站”和“标签”（4G）</summary>
        public async Task<MyActionResult<object>> EditBaseStationAndTagAsync(Locator4gPackage package)
        {
            var tagService = TagService;
            var baseStation = await EditBaseStationAsync(package.Data.CollectorId, package.ReportTime, null);

            var resGetFullByTagId = await tagService.GetFullByTagId(package.Data.CollectorId);
            var tag = resGetFullByTagId.Data;
            if (tag == null) return MyResults<object>.IsNull(nameof(tag));

            var newTag = new TagDto();
            newTag.ShallowCopy(tag);
            newTag.ReportTime = GetUtc(package.ReportTime);
            newTag.OnlineState = OnlineStates.Online;
            newTag.Station = baseStation?.Id;
            newTag.Battery = package.Data.Battery;
            newTag.Signal = package.Data.WifiScan.FirstOrDefault()?.SignalStrength;

            #region 计算“经纬度”
            var resGetLocation = await MapHelper.GetLocationByCellTowersAsync(package.Data.SCell, package.Data.NCell, null, Constants.AMapKey);
            var location = resGetLocation.Data;
            if (location == null)
            {
                return resGetLocation.Convert<object>();
            }

            newTag.Longitude = location.Longitude;
            newTag.Latitude = location.Latitude;
            #endregion 计算“经纬度”

            var resEdit = await tagService.Edit(newTag);
            if (!resEdit.IsSuccess)
            {
                return resEdit.Convert<object>();
            }

            var resAsset = await AssetRecordService.EditAssetRecordAsync(tag, newTag);
            if (!resAsset.IsSuccess)
            {
                return resAsset.Convert<object>();
            }
            return MyResults<object>.Success();
        }
        #endregion

        #region 更新“在线状态”
        /// <summary>更新“在线状态”</summary>
        public void UpdateOnlineState()
        {
            BaseStationService.UpdateOnlineState();
            TagService.UpdateOnlineState();
        }
        #endregion
        #endregion [DB]
        #endregion 【Functions】
    }
}
