using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
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
        #region 根据“角色”筛选“单页数据”
        [HttpGet]
        [Route("FilterByRole/{role}")]
        /// <summary>根据“角色”筛选“单页数据”</summary>
        public async Task<MyActionResult> FilterByRole(long role, int? pageSize = null, int? pageNumber = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.FilterByRole(role, pageSize, pageNumber);
            return res;
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
