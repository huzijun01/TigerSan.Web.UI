using System.Net.Http.Headers;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Helpers
{
    public class SseHelper : IDisposable
    {
        #region 【Fields】
        private readonly HttpClient _httpClient;
        private readonly ConnectInfo _connectInfo;
        private Stream? _responseStream;
        private CancellationTokenSource? _cts;
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
        #region 销毁
        public void Dispose()
        {
            _cts?.Dispose();
            _httpClient?.Dispose();
        }
        #endregion

        #region 初始化“HTTP客户端”
        /// <summary>初始化“HTTP客户端”</summary>
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
        /// <summary>开始监听（异步） </summary>
        public async Task StartAsync(Func<string, Task> onDataReceived)
        {
            Stop();

            Console.WriteLine("Connected to SSE stream. Listening for events...");
            _cts = new CancellationTokenSource();

            while (!_cts.Token.IsCancellationRequested)
            {
                try
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                    // 链接全局取消令牌与局部超时令牌
                    using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(_cts.Token, cts.Token);

                    using var response = await _httpClient.GetAsync(
                        _connectInfo.SseUrl,
                        HttpCompletionOption.ResponseHeadersRead,
                        linkedCts.Token
                    );
                    response.EnsureSuccessStatusCode();

                    // 验证Content-Type
                    if (response.Content.Headers.ContentType?.MediaType != "text/event-stream")
                    {
                        throw new Exception("Invalid content type. Expected 'text/event-stream'");
                    }

                    _responseStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);
                    using var reader = new StreamReader(_responseStream, leaveOpen: true);

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
                        // 处理其他事件类型
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
                        // 处理ID字段
                        else if (line.StartsWith("id:"))
                        {
                            var id = line.Substring(3).Trim();
                        }
                    }

                    // 正常连接断开处理
                    if (!_cts.Token.IsCancellationRequested)
                    {
                        LogHelper.Instance.Warning("Connection closed by server.");
                    }
                }
                catch (TaskCanceledException) when (_cts != null && _cts.Token.IsCancellationRequested)
                {
                    break; // 主动关闭连接时退出
                }
                catch (Exception ex)
                {
                    try
                    {
                        LogHelper.Instance.Error($"Connection error: {ex.GetMessage()}");
                    }
                    catch (Exception ex1)
                    {
                        Console.Error.WriteLine(ex1.Message);
                    }
                }
                finally
                {
                    _responseStream?.Dispose();
                    _responseStream = null;
                }

                // 仅在需要重试且服务运行时等待
                if (!_cts.Token.IsCancellationRequested)
                {
                    Console.WriteLine($"Reconnecting in {_connectInfo.RetryIntervalMs / 1000}s...");
                    await Task.Delay(_connectInfo.RetryIntervalMs, _cts.Token);
                    Console.WriteLine($"Try to reconnect...");
                }
            }

            LogHelper.Instance.Log("SSE listener stopped!");
        }
        #endregion

        #region 停止
        /// <summary>停止</summary>
        public void Stop()
        {
            if (_cts == null) return;
            _cts.Cancel();
            _cts.Dispose();
            _cts = null;
            _httpClient.CancelPendingRequests();
            LogHelper.Instance.Log("Listener stopped successfully!");
        }
        #endregion

        #region 是否“正在监听”
        /// <summary>是否“正在监听”</summary>
        public bool IsListening()
        {
            return _cts != null && !_cts.Token.IsCancellationRequested;
        }
        #endregion
        #endregion 【Functions】
    }
}
