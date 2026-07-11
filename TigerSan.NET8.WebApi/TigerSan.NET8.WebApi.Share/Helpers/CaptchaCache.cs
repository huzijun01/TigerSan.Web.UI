
using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    #region 验证码数据
    /// <summary>验证码数据</summary>
    public class CaptchaData
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public byte[]? Captcha { get; set; }
    }
    #endregion

    public class CaptchaCache
    {
        #region 初始化“验证码”
        /// <summary>初始化“验证码”</summary>
        public static void InitCaptcha(string id, string code)
        {
            MemoryCacheHelper.SetRelative(id, code, Constants.CaptchaValidityPeriod);
        }
        #endregion

        #region 验证
        /// <summary>验证</summary>
        public static MyActionResult<object> Verify(string? id, string code)
        {
            if (string.IsNullOrEmpty(id)) return MyResults<object>.TraceIdentifierIsNullOrEmpty;

            // 获取“验证码记录”:
            var find = MemoryCacheHelper.Get<string>(id);

            // “验证码”是否可用:
            if (string.IsNullOrEmpty(find))
                return MyResults<object>.NoCaptchaRecord(id);
            else if (!string.Equals(code, find, StringComparison.OrdinalIgnoreCase))
                return MyResults<object>.CaptchaVerificationFailed;

            return MyResults<object>.Success();
        }
        #endregion
    }
}
