using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IUserService
    {
        public Task<MyActionResult<UserInfo>> GetUserInfo(string search);
        public Task<MyActionResult<object>> EditPassword(PasswordEdit edit);
        public Task<MyActionResult<UserInfo>> Login(
            string id,
            string captcha,
            string search,
            string password);
        public Task<MyActionResult<UserInfo>> LoginByToken(string token);
        public Task<MyActionResult<object>> Logout(string username);
        public MyActionResult<CaptchaData> GetCaptcha();
        public MyActionResult<object> VerifyCaptcha(string id, string code);
    }
}
