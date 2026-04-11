using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Helpers
{
    public static class SseInstance
    {
        #region 【Fields】
        private static IServiceProvider? _serviceProvider;
        private static SseHelper _sseHelper = new SseHelper(new ConnectInfo(SettingHelper.AppSettings.MqttConnection));
        /// <summary>“标签”缓存</summary>
        private static Dictionary<string, TagEntity> _tagCaches = new Dictionary<string, TagEntity>();
        /// <summary>“基站”缓存</summary>
        private static Dictionary<string, BaseStationEntity> _baseStationCaches = new Dictionary<string, BaseStationEntity>();
        /// <summary>“标签”服务</summary>
        private static ITagService? TagService { get => _serviceProvider?.CreateScope().ServiceProvider.GetRequiredService<ITagService>(); }
        /// <summary>“基站”服务</summary>
        private static IBaseStationService? BaseStationService { get => _serviceProvider?.CreateScope().ServiceProvider.GetRequiredService<IBaseStationService>(); }
        #endregion 【Fields】

        #region 【Functions】
        #region 初始化
        /// <summary>初始化</summary>
        public static async Task InitAsync(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            await UpdateBaseStationCachesAsync();
            await UpdateTagCachesAsync();
        }
        #endregion

        #region 开始监听
        /// <summary>开始监听</summary>
        public static void StartListening()
        {
            _sseHelper.StartListeningAsync(OnReceiveAsync).ContinueWith(task =>
            {
                if (task.IsFaulted)
                {
                    Console.WriteLine($"Error in SSE listener:");
                    Console.WriteLine(task.Exception?.GetBaseException().Message);
                }
            });
        }
        #endregion

        #region 停止
        /// <summary>停止</summary>
        public static void Stop()
        {
            _sseHelper.Stop();
        }
        #endregion

        #region 接收到数据时
        /// <summary>接收到数据时</summary>
        private static async Task OnReceiveAsync(string data)
        {
            Console.WriteLine($"Received SSE data:");

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
                Console.WriteLine(pkgBluetoothTag.Serialize());
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
                Console.WriteLine(pkgBluetoothTag.Serialize());
            }
            else
            {
                LogHelper.Instance.Warning($"Unknown package type: {pkgBase.Type}");
            }
        }
        #endregion

        #region 更新“基站”缓存
        /// <summary>更新“基站”缓存</summary>
        public static async Task UpdateBaseStationCachesAsync()
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
        public static async Task UpdateTagCachesAsync()
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

        #region 修改“基站”
        /// <summary>修改“基站”</summary>
        public static async Task<BaseStationEntity?> EditBaseStationAsync(
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

            DateTime time;
            if (!DateTime.TryParse(ReportTime, out time))
            {
                time = DateTime.Now;
            }
            baseStation.LastReportTime = time;
            baseStation.OnlineState = OnlineState.Online;
            updateBaseStation?.Invoke(baseStation);

            await baseStationService.Edit(baseStation);

            return baseStation;
        }
        #endregion

        #region 修改“基站”和“标签”
        /// <summary>修改“基站”和“标签”</summary>
        public static async Task EditBaseStationAndTagAsync(BluetoothTagPackage package)
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

                DateTime time;
                if (!DateTime.TryParse(package.ReportTime, out time))
                {
                    time = DateTime.Now;
                }
                tag.LastReportTime = time;
                tag.OnlineState = OnlineState.Online;
                tag.Station = baseStation?.Id;
                tag.Battery = tagData.Voltage;
                tag.Temperature = tagData.Temperature;
                tag.Signal = tagData.Signal;

                await tagService.Edit(tag);
            }
        }

        /// <summary>修改“基站”和“标签”</summary>
        public static async Task EditBaseStationAndTagAsync(Locator4gPackage package)
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

                DateTime time;
                if (!DateTime.TryParse(package.ReportTime, out time))
                {
                    time = DateTime.Now;
                }
                tag.LastReportTime = time;
                tag.OnlineState = OnlineState.Online;
                tag.Station = baseStation?.Id;
                tag.Battery = package.Data.Battery;
                tag.Signal = tagData.SignalStrength;

                await tagService.Edit(tag);
            }
        }
        #endregion
        #endregion 【Functions】
    }
}
