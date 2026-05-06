using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [NotIdController]
    [Route("[controller]")]
    public class UserController
    {
        #region 【Fields】
        private readonly IUserService _service;
        #endregion 【Fields】

        #region 【Ctor】
        public UserController(IUserService service)
        {
            _service = service;
        }
        #endregion 【Ctor】

        #region 【Functions】
        [HttpPut]
        [Route("Password")]
        /// <summary>修改“密码”</summary>
        public async Task<MyActionResult<object>> EditPassword([FromBody] PasswordEdit edit)
        {
            return await _service.EditPassword(edit);
        }

        [HttpGet]
        [Route("Login")]
        [NoNeedAuthorize]
        /// <summary>登录</summary>
        public async Task<MyActionResult<UserInfo>> Login(string search, string password)
        {
            return await _service.Login(search, password);
        }

        [HttpGet]
        [Route("LoginByToken")]
        [NoNeedAuthorize]
        /// <summary>Token登录</summary>
        public async Task<MyActionResult<UserInfo>> LoginByToken(string token)
        {
            return await _service.LoginByToken(token);
        }

        [HttpGet]
        [Route("Logout")]
        /// <summary>登出</summary>
        public async Task<MyActionResult<object>> Logout(string username)
        {
            return await _service.Logout(username);
        }
        #endregion 【Functions】
    }
}
