using System.Net.Http.Headers;
using TigerSan.NET8.WebApi.Models;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class SseHelper
    {
        #region 【Fields】
        private Stream? _responseStream;
        private readonly HttpClient _httpClient;
        private readonly ConnectInfo _connectInfo;
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
        public async Task StartListeningAsync(Action<string> onDataReceived)
        {
            Console.WriteLine("Connected to SSE stream. Listening for events...");

            while (true)
            {
                try
                {
                    using var response = await _httpClient.GetAsync(_connectInfo.SseUrl, HttpCompletionOption.ResponseHeadersRead);
                    response.EnsureSuccessStatusCode();

                    // 验证Content-Type
                    if (response.Content.Headers.ContentType?.MediaType != "text/event-stream")
                    {
                        throw new Exception("Invalid content type. Expected 'text/event-stream'");
                    }

                    _responseStream = await response.Content.ReadAsStreamAsync();
                    using var reader = new StreamReader(_responseStream);

                    string? line;
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        // 跳过注释行
                        if (string.IsNullOrEmpty(line) || line.StartsWith(":"))
                            continue;

                        // 解析事件字段
                        if (line.StartsWith("data:"))
                        {
                            var data = line.Substring(5).Trim();
                            onDataReceived(data);
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
                            var id = line.Substring(3).Trim();
                            // 保存最后收到的ID用于断连续传
                        }
                    }
                }
                catch (TaskCanceledException) when (_responseStream == null)
                {
                    break; // 主动关闭连接时退出
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Connection error: {ex.Message}. Reconnecting...");
                    await Task.Delay(3000); // 等待3秒后重连
                }
                finally
                {
                    _responseStream?.Dispose();
                    _responseStream = null;
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
            _responseStream?.Dispose();
            _httpClient.CancelPendingRequests();
        }
        #endregion
        #endregion 【Functions】
    }
}
