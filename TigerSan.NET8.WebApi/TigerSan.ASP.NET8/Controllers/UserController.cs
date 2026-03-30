using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
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
        [HttpGet]
        [Route("Login")]
        /// <summary>登录</summary>
        public async Task<MyActionResult<UserInfo>> Login([FromQuery] string search, [FromQuery] string password)
        {
            return await _service.Login(search, password);
        }

        [HttpPut]
        [Route("Password")]
        /// <summary>修改“密码”</summary>
        public async Task<MyActionResult<object>> EditPassword([FromBody] PasswordEdit edit)
        {
            return await _service.EditPassword(edit);
        }
        #endregion 【Functions】
    }
}
