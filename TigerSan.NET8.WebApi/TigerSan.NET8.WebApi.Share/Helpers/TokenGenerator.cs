using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

#region 令牌信息
/// <summary>令牌信息</summary>
public class TokenInfo
{
    public string Username { get; set; } = string.Empty;
    public TimeSpan Expiration { get; set; } = TimeSpan.FromDays(7);
}
#endregion

public static class TokenGenerator
{
    #region 生成JWT令牌
    /// <summary>生成JWT令牌</summary>
    public static string? GetToken(string userId, TimeSpan expiration, string secretKey)
    {
        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, userId)
            }),
                Expires = DateTime.UtcNow.Add(expiration),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        catch
        {
            return null;
        }
    }
    #endregion

    #region 验证并解析JWT令牌
    /// <summary>验证并解析JWT令牌</summary>
    public static TokenInfo? GetTokenInfo(string token, string secretKey)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var validationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParams, out var validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;

            var userId = jwtToken.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value;
            var expires = jwtToken.ValidTo - DateTime.UtcNow;

            return new TokenInfo
            {
                Username = userId,
                Expiration = expires
            };
        }
        catch
        {
            return null;
        }
    }
    #endregion

    #region 获取密钥
    /// <summary>获取密钥</summary>
    public static string GetSecretKey(int length = 32)
    {
        // 创建加密安全的随机数生成器:
        using var rng = RandomNumberGenerator.Create();

        // 生成随机密钥:
        var keyBytes = new byte[length];
        rng.GetBytes(keyBytes);

        // 转换为Base64字符串:
        return Convert.ToBase64String(keyBytes);
    }
    #endregion
}
