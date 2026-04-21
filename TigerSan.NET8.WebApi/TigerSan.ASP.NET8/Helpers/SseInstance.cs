using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Share.Packages;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class SseInstance
    {
        #region 【Fields】
        public static SseInstance? _instance;
        private PackageChannel _packageChannel;
        private CancellationTokenSource? _cts;
        private SseHelper _sseHelper = new SseHelper(new ConnectInfo(SettingHelper.AppSettings.MqttConnection));
        #endregion 【Fields】

        #region 【Functions】
        #region 初始化
        /// <summary>初始化</summary>
        private SseInstance(IServiceProvider serviceProvider)
        {
            _instance = this;
            _packageChannel = new PackageChannel(serviceProvider);
            UpdateCachesAsync();
        }
        #endregion

        #region 更新“缓存”
        /// <summary>更新“缓存”</summary>
        public async void UpdateCachesAsync()
        {
            try
            {
                var baseTask = UpdateBaseStationCachesAsync();
                var tagTask = UpdateTagCachesAsync();

                await Task.WhenAll(baseTask, tagTask).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                Stop();
                LogHelper.Instance.Error(e.GetMessage());
            }
        }
        #endregion

        #region 初始化“实例”
        /// <summary>初始化“实例”</summary>
        public static SseInstance InitInstance(IServiceProvider serviceProvider)
        {
            if (_instance == null)
            {
                _instance = new SseInstance(serviceProvider);
            }
            return _instance;
        }
        #endregion

        #region 开始监听
        /// <summary>开始监听</summary>
        public void StartListening()
        {
            _sseHelper.StartListeningAsync(OnReceiveAsync).ContinueWith(task =>
            {
                if (!task.IsFaulted) return;
                LogHelper.Instance.Error($"Error in SSE listener:");
                Console.WriteLine(task.Exception?.GetBaseException().Message);
            });

            _cts?.Cancel();
            _cts = new CancellationTokenSource();
            _packageChannel.StartProcessingAsync(_cts.Token).ContinueWith(task =>
            {
                if (!task.IsFaulted) return;
                Stop();
                var ex = task.Exception?.GetBaseException();
                LogHelper.Instance.Error(ex?.GetMessage());
            });
            _packageChannel._onlineStateUpdater.Start();
        }
        #endregion

        #region 停止
        /// <summary>停止</summary>
        public void Stop()
        {
            _sseHelper.Stop();
            _cts?.Cancel();
            _cts = null;
            _packageChannel._onlineStateUpdater.Start();
        }
        #endregion

        #region 接收到数据时
        /// <summary>接收到数据时</summary>
        private async Task OnReceiveAsync(string data)
        {
            await _packageChannel.Publish(data);
        }
        #endregion

        #region [缓存]
        #region 更新“基站”缓存
        /// <summary>更新“基站”缓存</summary>
        public static async Task UpdateBaseStationCachesAsync()
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.UpdateBaseStationCachesAsync();
        }
        #endregion

        #region 更新“标签”缓存
        /// <summary>更新“标签”缓存</summary>
        public static async Task UpdateTagCachesAsync()
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.UpdateTagCachesAsync();
        }
        #endregion

        #region 更新“单个标签”缓存
        /// <summary>更新“单个标签”缓存</summary>
        public static async Task UpdateTagCacheAsync(string tagId)
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.UpdateTagCacheAsync(tagId);
        }
        #endregion

        #region 更新“多个标签”缓存
        /// <summary>更新“多个标签”缓存</summary>
        public static async Task UpdateTagCacheRangeAsync(List<long> ids)
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.UpdateTagCacheRangeAsync(ids);
        }
        #endregion

        #region 删除“单个标签”缓存
        /// <summary>删除“单个标签”缓存</summary>
        public static async Task DeleteTagCacheAsync(long id)
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.DeleteTagCacheAsync(id);
        }
        #endregion

        #region 删除“多个标签”缓存
        /// <summary>删除“多个标签”缓存</summary>
        public static async Task DeleteTagCacheRangeAsync(List<long> ids)
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return;
            }
            await _instance._packageChannel.DeleteTagCacheRangeAsync(ids);
        }
        #endregion
        #endregion [缓存]

        #region [DB]
        #region 修改“基站”和“标签”（蓝牙）
        /// <summary>修改“基站”和“标签”（蓝牙）</summary>
        public static async Task<MyActionResult<object>> EditBaseStationAndTagAsync(BluetoothTagPackage package)
        {
            if (_instance == null)
            {
                LogHelper.Instance.IsNull(nameof(_instance));
                return MyResults<object>.ResourceNotExist;
            }
            return await _instance._packageChannel.EditBaseStationAndTagAsync(package);
        }
        #endregion
        #endregion [DB]
        #endregion 【Functions】
    }
}
