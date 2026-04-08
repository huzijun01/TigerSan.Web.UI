using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AuthorityController : IdControllerBase<AuthorityEntity, IAuthorityService>
    {
        #region 【Ctor】
        public AuthorityController(IAuthorityService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("Unused/List")]
        /// <summary>获取“数据”集合</summary>
        public override async Task<MyActionResult<List<AuthorityEntity>>> GetList(
            int? pageSize,
            int? pageNumber,
            [FromBody] FilterDto? filter = null)
        {
            return MyResults<List<AuthorityEntity>>.ApiUnavailable;
        }

        [HttpPost]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult<List<AuthorityEntity>>> GetList(long? role = null, int? pageSize = null, int? pageNumber = null)
        {
            var res = MyResults<List<AuthorityEntity>>.OperationSuccess;
            res.Data = await _service.GetList(role, pageSize, pageNumber);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
