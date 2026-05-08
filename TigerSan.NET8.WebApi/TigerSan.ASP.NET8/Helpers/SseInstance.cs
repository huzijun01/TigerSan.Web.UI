using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Packages;
using TigerSan.NET8.WebApi.Share.Extensions;

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
            _packageChannel.UpdateOnlineState();
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
            _packageChannel._onlineStateUpdater.Stop();
        }
        #endregion

        #region 接收到数据时
        /// <summary>接收到数据时</summary>
        private async Task OnReceiveAsync(string data)
        {
            await _packageChannel.Publish(data);
        }
        #endregion

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
