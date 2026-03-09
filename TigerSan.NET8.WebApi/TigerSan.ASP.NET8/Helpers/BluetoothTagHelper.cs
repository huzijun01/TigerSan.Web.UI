using TigerSan.NET8.WebApi.Models;
using TigerSan.NET8.WebApi.Share.Packages;

namespace TigerSan.NET8.WebApi.Helpers
{
    public static class BluetoothTagHelper
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
            _sseHelper.StartListeningAsync(data =>
            {
                Console.WriteLine($"Received SSE data:");
                var obj = BluetoothTagPackage.Deserialize(data);
                if (obj == null)
                {
                    Console.WriteLine($"The {nameof(obj)} is null");
                    return;
                }
                Console.WriteLine(obj.Serialize());
            }).ContinueWith(task =>
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
        #endregion 【Functions】
    }
}
