using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class RoleController : IdNameControllerBase<RoleEntity, IRoleService>
    {
        #region 【Ctor】
        public RoleController(IRoleService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        #region private
        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        private new async Task<MyActionResult> Add([FromBody] RoleEntity entity)
        {
            return MyResults.ApiUnavailable;
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        private new async Task<MyActionResult> AddRange([FromBody] IList<RoleEntity> entities)
        {
            return MyResults.ApiUnavailable;
        }
        #endregion private

        [HttpPost]
        [Route("Used")]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add([FromBody] RoleAuthorityEntity entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Used/Range")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> AddRange([FromBody] IList<RoleAuthorityEntity> entities)
        {
            return await _service.AddRange(entities);
        }
        #endregion [增]
        #endregion 【Functions】
    }
}
