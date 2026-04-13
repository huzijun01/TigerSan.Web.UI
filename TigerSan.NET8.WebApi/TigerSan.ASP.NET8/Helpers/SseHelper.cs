using System.Net.Http.Headers;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class SseHelper
    {
        #region 【Fields】
        private Stream? _responseStream;
        private readonly HttpClient _httpClient;
        private readonly ConnectInfo _connectInfo;
        private volatile bool _isRunning = true;
        public bool IsRunning { get => _isRunning; }
        #endregion 【Fields】

        #region 【Ctor】
        public SseHelper(ConnectInfo connectInfo)
        {
            _connectInfo = connectInfo;
            _httpClient = new HttpClient();
            InitHttpClient(_httpClient);
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region 初始化“HTTP客户端”
        /// <summary>
        /// 初始化“HTTP客户端”
        /// </summary>
        private void InitHttpClient(HttpClient httpClient)
        {
            // 设置超时，避免无限等待:
            httpClient.Timeout = TimeSpan.FromSeconds(30);
            // SSE需要的请求头:
            httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
            httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/event-stream"));
            // 设置Basic Auth认证头:
            httpClient.DefaultRequestHeaders.Add("Authorization", _connectInfo.Authorization);
        }
        #endregion

        #region 开始监听（异步）
        /// <summary>
        /// 开始监听（异步）
        /// </summary>
        public async Task StartListeningAsync(Func<string, Task> onDataReceived)
        {
            Console.WriteLine("Connected to SSE stream. Listening for events...");
            _isRunning = true;

            while (_isRunning)
            {
                try
                {
                    using var response = await _httpClient.GetAsync(
                        _connectInfo.SseUrl,
                        HttpCompletionOption.ResponseHeadersRead,
                        default
                    ).ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();

                    // 验证Content-Type
                    if (response.Content.Headers.ContentType?.MediaType != "text/event-stream")
                    {
                        throw new Exception("Invalid content type. Expected 'text/event-stream'");
                    }

                    _responseStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);
                    using var reader = new StreamReader(_responseStream, leaveOpen: true); // 避免提前关闭流

                    string? line;
                    while ((line = await reader.ReadLineAsync().ConfigureAwait(false)) != null)
                    {
                        // 跳过注释行
                        if (string.IsNullOrEmpty(line) || line.StartsWith(":"))
                            continue;

                        // 解析事件字段
                        if (line.StartsWith("data:"))
                        {
                            var data = line.Substring(5).Trim();
                            await onDataReceived(data).ConfigureAwait(false);
                        }
                        // 处理其他事件类型（如event: error, retry: 3000等）
                        else if (line.StartsWith("event:"))
                        {
                            var eventName = line.Substring(6).Trim();
                            // 根据事件类型处理逻辑
                        }
                        else if (line.StartsWith("retry:"))
                        {
                            if (int.TryParse(line.Substring(6).Trim(), out var retryMs))
                            {
                                // 更新重连间隔
                            }
                        }
                        // 处理ID字段（用于断连后继续）
                        else if (line.StartsWith("id:"))
                        {
                            // 保存最后收到的ID用于断连续传
                            var id = line.Substring(3).Trim();
                        }
                    }

                    // 正常连接断开处理
                    if (_isRunning)
                    {
                        LogHelper.Instance.Warning("Connection closed by server.");
                    }
                }
                catch (TaskCanceledException) when (!_isRunning)
                {
                    LogHelper.Instance.Log("Listener stopped gracefully");
                    break; // 主动关闭连接时退出
                }
                catch (Exception ex)
                {
                    LogHelper.Instance.Error($"Connection error: {ex.GetMessage()}");
                }
                finally
                {
                    _responseStream?.Dispose();
                    _responseStream = null;
                }

                // 仅在需要重试且服务运行时等待
                if (_isRunning)
                {
                    var retrySeconds = 10;
                    Console.WriteLine($"Reconnecting in {retrySeconds} seconds...");
                    await Task.Delay(retrySeconds * 1000).ConfigureAwait(false); // 等待重连
                    Console.WriteLine($"Try to reconnect...");
                }
            }
        }
        #endregion

        #region 停止
        /// <summary>
        /// 停止
        /// </summary>
        public void Stop()
        {
            _isRunning = false;
            _responseStream?.Dispose();
            _responseStream = null;
            _httpClient.CancelPendingRequests();
            LogHelper.Instance.Log("SSE listener stopped");
        }
        #endregion
        #endregion 【Functions】
    }
}
