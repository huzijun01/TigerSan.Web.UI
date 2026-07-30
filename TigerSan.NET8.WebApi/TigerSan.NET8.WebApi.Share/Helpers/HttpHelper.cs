using System.Text;
using System.Text.Json;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    public static class HttpHelper
    {
        #region 【Fields】
        // 1. 配置 SocketsHttpHandler 以管理连接池和 DNS 刷新
        private static readonly SocketsHttpHandler _socketHandler = new()
        {
            PooledConnectionLifetime = TimeSpan.FromMinutes(2)
        };

        // 2. 创建静态、长生命周期的 HttpClient
        private static readonly HttpClient _sharedClient = new(_socketHandler)
        {
            Timeout = TimeSpan.FromSeconds(30) // 可根据需要调整全局超时
        };

        private static readonly JsonSerializerOptions DefaultJsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        #endregion 【Fields】

        #region 发送 POST 请求
        /// <summary>发送 POST 请求</summary>
        public static async Task<MyActionResult<TResponse>> PostAsync<TData, TResponse>(
            string url,
            TData bodyData,
            Dictionary<string, string>? headers = null,
            JsonSerializerOptions? jsonOptions = null,
            CancellationToken cancellationToken = default)
        {
            var options = jsonOptions ?? DefaultJsonOptions;

            try
            {
                // 1. 构建请求内容
                var jsonContent = bodyData is string str
                    ? str
                    : JsonSerializer.Serialize(bodyData, options);

                using var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // 2. 创建请求消息
                // 注意：HttpRequestMessage 必须在使用后 Dispose，但 HttpClient 不需要
                using var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = content
                };

                // 3. 设置 Headers
                if (headers != null)
                {
                    foreach (var header in headers)
                    {
                        // 避免重复设置 Content-Type，StringContent 已自动设置
                        if (!header.Key.Equals("Content-Type", StringComparison.OrdinalIgnoreCase))
                        {
                            // TryAddWithoutValidation 允许添加非标准 Header
                            request.Headers.TryAddWithoutValidation(header.Key, header.Value);
                        }
                    }
                }

                // 4. 发送请求
                // 使用共享的静态客户端
                using var response = await _sharedClient.SendAsync(request, cancellationToken).ConfigureAwait(false);

                // 5. 读取响应体
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

                // 6. 状态检查与结果处理
                if (!response.IsSuccessStatusCode)
                {
                    var errorMsg = $"HTTP {(int)response.StatusCode} ({response.StatusCode}): {responseBody}";
                    // 假设 LogHelper 和 MyResults 是您项目中的现有类
                    return MyResults<TResponse>.Error(LogHelper.Instance.Error(errorMsg));
                }

                // 7. 反序列化
                TResponse? resultData;

                // 特殊处理 string 类型，避免二次序列化/反序列化问题
                if (typeof(TResponse) == typeof(string))
                {
                    resultData = (TResponse)(object)responseBody;
                }
                else if (string.IsNullOrWhiteSpace(responseBody))
                {
                    resultData = default!;
                }
                else
                {
                    resultData = JsonSerializer.Deserialize<TResponse>(responseBody, options);
                }

                return MyResults<TResponse>.Success(null, resultData);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                return MyResults<TResponse>.Error(LogHelper.Instance.Error("Request timed out or cancelled."));
            }
            catch (HttpRequestException ex)
            {
                return MyResults<TResponse>.Error(LogHelper.Instance.Error($"Network Error: {ex.Message}"));
            }
            catch (JsonException ex)
            {
                return MyResults<TResponse>.Error(LogHelper.Instance.Error($"JSON Deserialization Error: {ex.Message}"));
            }
            catch (Exception ex)
            {
                return MyResults<TResponse>.Error(LogHelper.Instance.Error(ex.GetMessage()));
            }
        }
        #endregion
    }
}
