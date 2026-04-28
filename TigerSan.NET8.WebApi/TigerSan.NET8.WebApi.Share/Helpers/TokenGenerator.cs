using System.Text;
using System.Text.Json;
using System.Security.Cryptography;

public static class TokenGenerator
{
    public static string GenerateJwtToken(string userId, TimeSpan expiration, string secretKey)
    {
        // 1. 创建Header（算法+类型）
        var header = new { alg = "HS256", typ = "JWT" };

        // 2. 创建Payload（包含标准声明和自定义声明）
        var payload = new
        {
            sub = userId,                                  // 主题（用户ID）
            iat = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), // 签发时间
            exp = DateTimeOffset.UtcNow.Add(expiration).ToUnixTimeSeconds() // 过期时间
        };

        // 3. Base64Url编码（替换特殊字符并移除填充）
        string Encode(object data) => Convert.ToBase64String(JsonSerializer.SerializeToUtf8Bytes(data))
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');

        string encodedHeader = Encode(header);
        string encodedPayload = Encode(payload);

        // 4. 生成签名
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
        byte[] signatureBytes = hmac.ComputeHash(
            Encoding.UTF8.GetBytes($"{encodedHeader}.{encodedPayload}"));

        string encodedSignature = Encode(signatureBytes);

        // 5. 组合JWT
        return $"{encodedHeader}.{encodedPayload}.{encodedSignature}";
    }
}
