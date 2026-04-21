using System.Globalization;
using System.Threading.Channels;
using TigerSan.CsvLog;
using TigerSan.TimerHelper;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class PackageChannel
    {
        #region 【Fields】
        /// <summary>正在修改的标签</summary>
        private Dictionary<long, TagDto> _editingTags = new Dictionary<long, TagDto>();
        /// <summary>管道</summary>
        private readonly Channel<string> _channel;
        /// <summary>批量阈值</summary>
        private const int BatchSize = 1000;
        /// <summary>服务提供者</summary>
        private IServiceProvider _serviceProvider;
        /// <summary>“在线状态”更新定时器</summary>
        public ActionTimer _onlineStateUpdater = new ActionTimer(5000, true);
        /// <summary>“标签”缓存</summary>
        private Dictionary<string, TagDto> _tagCaches = new Dictionary<string, TagDto>();
        /// <summary>“基站”缓存</summary>
        private Dictionary<string, BaseStationEntity> _baseStationCaches = new Dictionary<string, BaseStationEntity>();
        /// <summary>“标签”服务</summary>
        private ITagService TagService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<ITagService>(); }
        /// <summary>“基站”服务</summary>
        private IBaseStationService BaseStationService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IBaseStationService>(); }
        /// <summary>“资产”服务</summary>
        private IAssetService AssetService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IAssetService>(); }
        /// <summary>“资产记录”服务</summary>
        private IAssetRecordService AssetRecordService { get => _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<IAssetRecordService>(); }
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

        #region 【Functions】
        #region [Private]
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

        #region [缓存]
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

            var tags = await tagService.GetFullList();
            _tagCaches.Clear();
            foreach (var tag in tags)
            {
                _tagCaches.Add(tag.TagId, tag);
            }
        }
        #endregion

        #region 删除“多个标签”缓存
        /// <summary>删除“多个标签”缓存</summary>
        public async Task DeleteTagCacheRangeAsync(List<long> ids)
        {
            var tagService = TagService;
            if (tagService == null)
            {
                LogHelper.Instance.IsNull(nameof(tagService));
                return;
            }

            var tags = await tagService.GetList(ids);
            foreach (var tag in tags)
            {
                _tagCaches.Remove(tag.TagId);
            }
        }
        #endregion

        #region 删除“单个标签”缓存
        /// <summary>删除“单个标签”缓存</summary>
        public async Task DeleteTagCacheAsync(long id)
        {
            var tagService = TagService;
            if (tagService == null)
            {
                LogHelper.Instance.IsNull(nameof(tagService));
                return;
            }

            var tag = await tagService.Get(id);
            if (tag == null)
            {
                LogHelper.Instance.IsNull(nameof(tag));
                return;
            }

            _tagCaches.Remove(tag.TagId);
        }
        #endregion

        #region 更新“单个标签”缓存
        /// <summary>更新“单个标签”缓存</summary>
        public async Task UpdateTagCacheAsync(string tagId)
        {
            var tagService = TagService;
            if (tagService == null)
            {
                LogHelper.Instance.IsNull(nameof(tagService));
                return;
            }

            var tag = await tagService.GetFull(tagId);
            if (tag == null)
            {
                LogHelper.Instance.IsNull(nameof(tag));
                return;
            }

            _tagCaches[tagId] = tag;
        }
        #endregion

        #region 更新“多个标签”缓存
        /// <summary>更新“多个标签”缓存</summary>
        public async Task UpdateTagCacheRangeAsync(List<long> ids)
        {
            var tagService = TagService;
            if (tagService == null)
            {
                LogHelper.Instance.IsNull(nameof(tagService));
                return;
            }

            var tags = await tagService.GetFullList(ids);
            foreach (var tag in tags)
            {
                _tagCaches[tag.TagId] = tag;
            }
        }
        #endregion
        #endregion [缓存]

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
            // 修改“基站”:
            _baseStationCaches.TryGetValue(CollectorId, out var baseStation);
            if (baseStation == null) return null;

            var baseStationService = BaseStationService;
            if (baseStationService == null)
            {
                LogHelper.Instance.IsNull(nameof(baseStationService));
                return null;
            }

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
            var res = MyResults<object>.OperationSuccess;
            var baseStation = await EditBaseStationAsync(package.Data.CollectorId, package.ReportTime, null);

            foreach (var tagData in package.Data.TagDatas)
            {
                _tagCaches.TryGetValue(tagData.TagId, out var tag);
                if (tag == null) return MyResults<object>.ResourceNotExist;

                var tagService = TagService;
                if (tagService == null)
                {
                    LogHelper.Instance.IsNull(nameof(tagService));
                    return MyResults<object>.ResourceNotExist;
                }

                var newTag = new TagDto();
                newTag.ShallowCopy(tag);
                newTag.ReportTime = GetUtc(package.ReportTime);
                newTag.OnlineState = OnlineStates.Online;
                newTag.Station = baseStation?.Id;
                newTag.Longitude = package.Data.Longitude;
                newTag.Latitude = tagData.Latitude;
                newTag.Battery = tagData.Voltage;
                newTag.Temperature = tagData.Temperature;
                newTag.Signal = tagData.Signal;

                var resEdit = await tagService.Edit(newTag);
                if (!resEdit.IsSuccess)
                {
                    LogHelper.Instance.Error(resEdit.Message);
                    res = resEdit;
                }
                _tagCaches[tagData.TagId] = newTag;

                var resAsset = await EditAssetRecordAsync(tag, newTag);
                if (!resAsset.IsSuccess)
                {
                    LogHelper.Instance.Error(resAsset.Message);
                    res = resAsset;
                }
            }
            return res;
        }
        #endregion

        #region 修改“基站”和“标签”（4G）
        /// <summary>修改“基站”和“标签”（4G）</summary>
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

                var newTag = new TagDto();
                newTag.ShallowCopy(tag);
                newTag.ReportTime = GetUtc(package.ReportTime);
                newTag.OnlineState = OnlineStates.Online;
                newTag.Station = baseStation?.Id;
                newTag.Battery = package.Data.Battery;
                newTag.Signal = tagData.SignalStrength;

                await tagService.Edit(newTag);
                _tagCaches[tagData.MacAddr] = newTag;

                await EditAssetRecordAsync(tag, newTag);
            }
        }
        #endregion

        #region 修改“资产记录”
        /// <summary>修改“资产记录”</summary>
        public async Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag)
        {
            try
            {
                _editingTags.TryGetValue(newTag.Id, out var editingTag);
                if (editingTag != null || oldTag.Asset == null || newTag.Asset == null) return MyResults<object>.OperationSuccess;
                _editingTags.Add(newTag.Id, newTag);

                var lastRecord = await AssetRecordService.GetLast(newTag.Asset.Value);

                if (lastRecord == null) // 首条记录，新增“入库记录”
                {
                    lastRecord = new AssetRecordEntity()
                    {
                        Asset = newTag.Asset.Value,
                        Tag = newTag.Id,
                        State = AssetStates.Inbound,
                    };
                    lastRecord.ShallowCopy(newTag);
                    lastRecord.ReportTime = newTag.ReportTime ?? GetUtcNow();

                    var res = await AssetRecordService.Add(lastRecord);
                    if (res.IsError)
                    {
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }

                    return MyResults<object>.OperationSuccess;
                }

                var id = lastRecord.Id;
                lastRecord.ShallowCopy(newTag);
                lastRecord.Id = id;
                lastRecord.ReportTime = newTag.ReportTime ?? GetUtcNow();

                if (oldTag.Station != newTag.Station) // “场地”改变，新增“入库记录”
                {
                    // 添加“场地”:
                    if (newTag.Station != null)
                    {
                        var site = await BaseStationService.GetSite(newTag.Station.Value);
                        if (site == null)
                        {
                            return MyResults<object>.ResourceNotExist;
                        }
                        else
                        {
                            lastRecord.Site = site.Id;
                        }
                    }

                    if (lastRecord.State != AssetStates.Outbound) // 无“出库记录”
                    {
                        // 将“最新记录”改为“出库记录”：
                        lastRecord.State = AssetStates.Outbound;
                        var resEdit = await AssetRecordService.Edit(lastRecord);
                        if (resEdit.IsError)
                        {
                            LogHelper.Instance.Error(resEdit.Message);
                            return resEdit;
                        }
                    }

                    lastRecord.State = AssetStates.Inbound;
                    var res = await AssetRecordService.Add(lastRecord);
                    if (res.IsError)
                    {
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }
                }
                else // 同一场地
                {
                    if (lastRecord.State == AssetStates.InStore) // 在库
                    {
                        // 判断是否“滞留”:
                        var lastInboundRecord = await AssetRecordService.GetLastInbound(newTag.Asset.Value);
                        if (lastInboundRecord == null)
                        {
                            LogHelper.Instance.IsNull(nameof(lastInboundRecord));
                            return MyResults<object>.ResourceNotExist;
                        }

                        lastRecord.State = (DateTime.Now - lastInboundRecord.ReportTime).TotalHours
                            > Constants.Stolid_Threshold_Hours
                            ? AssetStates.Stolid : AssetStates.InStore;
                    }

                    if (oldTag.OnlineState != newTag.OnlineState) // “在线状态”改变，新增记录
                    {
                        var res = await AssetRecordService.Add(lastRecord);
                        if (res.IsError)
                        {
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                    else // 更新记录
                    {
                        var res = await AssetRecordService.Edit(lastRecord);
                        if (res.IsError)
                        {
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                }

                return MyResults<object>.OperationSuccess;
            }
            finally
            {
                _editingTags.Remove(newTag.Id);
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
                if (baseStation.OnlineState == OnlineStates.Offline) continue;

                if (baseStation.ReportTime == null ||
                    (GetUtcNow() - baseStation.ReportTime.Value).TotalSeconds > baseStation.HeartbeatInterval)
                {
                    baseStation.OnlineState = OnlineStates.Offline;
                    timeOutBaseStations.Add(baseStation);
                }
            }

            BaseStationService.EditRange(timeOutBaseStations);

            // 标签:
            var timeOutTags = new List<TagEntity>();

            foreach (var tagCache in _tagCaches)
            {
                var newTag = new TagDto();
                newTag.ShallowCopy(tagCache.Value);
                if (newTag.OnlineState == OnlineStates.Offline) continue;

                if (newTag.ReportTime == null ||
                    (GetUtcNow() - newTag.ReportTime.Value).TotalSeconds > Constants.Report_Interval_Seconds)
                {
                    newTag.ReportTime = GetUtcNow();
                    newTag.OnlineState = OnlineStates.Offline;
                    timeOutTags.Add(newTag);

                    // 修改“资产记录”:
                    EditAssetRecordAsync(tagCache.Value, newTag).ContinueWith(task =>
                    {
                        if (!task.IsFaulted) return;
                        var ex = task.Exception?.GetBaseException();
                        LogHelper.Instance.Error(ex?.GetMessage());
                    });
                }

                _tagCaches[newTag.TagId] = newTag;
            }

            TagService.EditRange(timeOutTags);
        }
        #endregion
        #endregion [DB]
        #endregion 【Functions】
    }
}
