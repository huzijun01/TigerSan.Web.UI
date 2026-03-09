using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Models;
using TigerSan.NET8.WebApi.Share.Packages;

namespace TigerSan.NET8.WebApi.Helpers
{
    public static class SseInstance
    {
        #region 【Fields】
        private static SseHelper _sseHelper = new SseHelper(new ConnectInfo("192.168.0.202:5012", "1", "dyroot", "dy88889999"));
        #endregion 【Fields】

        #region 【Functions】
        #region 开始监听
        /// <summary>
        /// 开始监听
        /// </summary>
        public static void StartListening()
        {
            _sseHelper.StartListeningAsync(OnReceive).ContinueWith(task =>
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
        /// <summary>
        /// 停止
        /// </summary>
        public static void Stop()
        {
            _sseHelper.Stop();
        }
        #endregion

        #region 接收到数据时
        private static void OnReceive(string data)
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
                Console.WriteLine(pkgBluetoothTag.Serialize());
            }
            else
            {
                LogHelper.Instance.Warning($"Unknown package type: {pkgBase.Type}");
            }
        }
        #endregion
        #endregion 【Functions】
    }
}
