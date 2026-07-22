using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IUserService
    {
        /// <summary>获取“用户信息”</summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <returns>用户信息</returns>
        public Task<MyActionResult<UserInfo>> GetUserInfo(string search);
        /// <summary>修改“密码”</summary>
        public Task<MyActionResult<object>> EditPassword(PasswordEdit edit);
        /// <summary>登录</summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <param name="password">密码</param>
        /// <returns>用户信息</returns>
        public Task<MyActionResult<UserInfo>> Login(
            string id,
            string captcha,
            string search,
            string password);
        /// <returns>Token登录</returns>
        public Task<MyActionResult<UserInfo>> LoginByToken(string token);
        /// <summary>登出</summary>
        public Task<MyActionResult<object>> Logout(string username);
        /// <summary>获取“验证码”</summary>
        public MyActionResult<CaptchaData> GetCaptcha();
        /// <summary>验证“验证码”</summary>
        public MyActionResult<object> VerifyCaptcha(string id, string code);
    }
}
