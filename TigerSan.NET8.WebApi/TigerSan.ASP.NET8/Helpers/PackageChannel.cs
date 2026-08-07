using System.Globalization;
using System.Threading.Channels;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
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
        public ActionTimer _onlineStateUpdater = new ActionTimer(GlobalSettings.OnlineStateUpdater_IntervalSeconds * 1000, true);
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
                    var pkgBluetoothTag = BaseStationPackage.Deserialize(data);
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
                    //Console.WriteLine(pkgLocator4g.Serialize());
                }
                else
                {
                    LogHelper.Instance.Warning($"Unknown package type: {pkgBase.Type}");
                }
            }
        }
        #endregion

        #region 修改“基站”和“标签”（蓝牙）
        /// <summary>修改“基站”和“标签”（蓝牙）</summary>
        public async Task<MyActionResult<object>> EditBaseStationAndTagAsync(BaseStationPackage package)
        {
            var tagService = TagService;
            var baseStationService = BaseStationService;

            #region 获取“基站”
            var res = await baseStationService.GetByMacAddr(package.Data.CollectorId);
            var baseStation = res.Data;
            if (baseStation == null)
            {
                LogHelper.Instance.Warning($"BaseStation not found! ({package.Data.CollectorId})");
            }
            #endregion

            package.Data.TagDatas0.AddRange(package.Data.TagDatas1);

            foreach (var tagData in package.Data.TagDatas0)
            {
                var resGetFullByTagId = await tagService.GetFullByTagId(tagData.TagId);
                var tag = resGetFullByTagId.Data;
                if (tag == null) continue;
                if (tag.EqpType != EqpTypes.Tag)
                {
                    LogHelper.Instance.Warning(MyResults<object>.EqpTypeNotMatch(tagData.TagId).Message);
                    continue;
                }

                var newTag = new TagDto();
                newTag.ShallowCopy(tag);
                newTag.ReportTime = GetUtc(package.ReportTime);
                newTag.OnlineState = OnlineStates.Online;
                newTag.LocationMode = LocationModes.BaseStation;
                newTag.IsFall = tagData.IsFall;
                newTag.Station = baseStation?.Id;
                newTag.Battery = tagData.Battery;
                newTag.Temperature = tagData.Temperature;
                newTag.Signal = tagData.Signal;

                #region 计算“经纬度”
                if (baseStation == null)
                {
                    newTag.Longitude = null;
                    newTag.Latitude = null;
                }
                else
                {
                    if (baseStation.IsMobile)
                    {
                        switch (package.Data.LocationMode)
                        {
                            case StationLocationModes.WifiScan:
                                newTag.LocationMode = LocationModes.WiFi_Bluetooth;
                                break;
                            case StationLocationModes.AGPS:
                                newTag.LocationMode = LocationModes._4G_Bluetooth;
                                break;
                            default:
                                newTag.LocationMode = LocationModes.GPS_Bluetooth;
                                break;
                        }

                        if (package.Data.IsValidLngLat)
                        {
                            newTag.Longitude = package.Data.Longitude;
                            newTag.Latitude = package.Data.Latitude;
                        }
                        else
                        {
                            newTag.Longitude = null;
                            newTag.Latitude = null;
                        }
                    }
                    else
                    {
                        var resGetSite = await SiteService.Get(baseStation.Site);
                        var site = resGetSite.Data;
                        if (site == null)
                        {
                            newTag.Longitude = null;
                            newTag.Latitude = null;
                            LogHelper.Instance.Warning(MyResults<object>.SiteNotExist.Message);
                        }
                        else
                        {
                            newTag.Longitude = site.Longitude;
                            newTag.Latitude = site.Latitude;
                        }
                    }

                    // 更新“基站”状态：
                    baseStation.OnlineState = OnlineStates.Online;
                    baseStation.ReportTime = newTag.ReportTime;
                    baseStation.LocationMode = newTag.LocationMode;
                    baseStation.Longitude = newTag.Longitude;
                    baseStation.Latitude = newTag.Latitude;
                    await baseStationService.Edit(baseStation);
                }
                #endregion 计算“经纬度”

                var resEdit = await tagService.Edit(newTag);
                if (!resEdit.IsSuccess) continue;

                var resAsset = await AssetRecordService.EditAssetRecordAsync(tag, newTag);
                if (!resAsset.IsSuccess) continue;
            }

            return MyResults<object>.Success();
        }
        #endregion

        #region 修改“基站”和“标签”（4G）
        /// <summary>修改“基站”和“标签”（4G）</summary>
        public async Task<MyActionResult<object>> EditBaseStationAndTagAsync(Locator4gPackage package)
        {
            var tagService = TagService;

            var resGetFullByTagId = await tagService.GetFullByTagId(package.Data.CollectorId);
            var tag = resGetFullByTagId.Data;
            if (tag == null) return MyResults<object>.IsNull(nameof(tag));
            if (tag.EqpType != EqpTypes.Locator)
            {
                var error = MyResults<object>.EqpTypeNotMatch(package.Data.CollectorId);
                LogHelper.Instance.Warning(error.Message);
                return error;
            }

            var newTag = new TagDto();
            newTag.ShallowCopy(tag, [nameof(TagDto.LocationMode)]);
            newTag.Imei = package.Data.IMEI;
            newTag.Iccid = package.Data.ICCID;
            newTag.ReportTime = GetUtc(package.ReportTime);
            newTag.OnlineState = OnlineStates.Online;
            newTag.IsFall = package.Data.IsFall;
            newTag.Station = null;
            newTag.Battery = package.Data.Battery;
            newTag.Signal = package.Data.WifiScan.FirstOrDefault()?.Signal;

            #region 计算“经纬度”
            Location? location = null;
            var wifiList = package.Data.WifiScan.Select(i => new WifiInfo(i.MacAddr, i.Signal)).ToArray();
            if (wifiList.Length > 2)
            {
                var resGetLocationByWiFi = await MapHelper.GetLocationByWifiAsync(GlobalSettings.AMapKey, wifiList);
                location = resGetLocationByWiFi.Data;
                if (location == null)
                {
                    LogHelper.Instance.Warning(resGetLocationByWiFi.Message);
                }
                else
                {
                    newTag.LocationMode = LocationModes.WiFi;
                }
            }

            if (location == null)
            {
                var resGetLocationByCell = await MapHelper.GetLocationByCellTowersAsync(GlobalSettings.AMapKey, package.Data.SCell, package.Data.NCell);
                location = resGetLocationByCell.Data;
                if (location == null)
                {
                    LogHelper.Instance.Warning(resGetLocationByCell.Message);
                }
                else
                {
                    newTag.LocationMode = LocationModes._4G;
                }
            }

            if (location != null && location.IsValidLngLat)
            {
                newTag.Longitude = location?.Longitude;
                newTag.Latitude = location?.Latitude;
            }
            else
            {
                newTag.Longitude = null;
                newTag.Latitude = null;
            }
            #endregion 计算“经纬度”

            #region 获取“地址”
            if (newTag.Longitude != null && newTag.Latitude != null)
            {
                var resGetAddress = await MapHelper.GetAddressByLocation(newTag.Longitude.Value, newTag.Latitude.Value, GlobalSettings.AMapKey);
                var address = resGetAddress.Data;
                if (address == null)
                {
                    return resGetAddress.Convert<object>();
                }
                newTag.Address = address;
            }
            #endregion 获取“地址”

            var resEdit = await tagService.Edit(newTag);
            if (!resEdit.IsSuccess)
            {
                return resEdit.Convert<object>();
            }

            var resRecord = await AssetRecordService.EditAssetRecordAsync(tag, newTag);
            if (!resRecord.IsSuccess)
            {
                return resRecord.Convert<object>();
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
