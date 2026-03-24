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
        #region [查]
        [HttpGet]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult> GetFullList([FromQuery] int? pageSize, [FromQuery] int? pageNumber)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetFullList(pageSize, pageNumber);
            return res;
        }
        #endregion [查]

        #region [增]
        #region override
        [HttpPost]
        [Route("Unused")]
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult> Add([FromBody] RoleEntity entity)
        {
            return MyResults.ApiUnavailable;
        }

        [HttpPost]
        [Route("Unused/Range")]
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult> AddRange([FromBody] IList<RoleEntity> entities)
        {
            return MyResults.ApiUnavailable;
        }
        #endregion override

        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add([FromBody] RoleAuthorityEntity entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> AddRange([FromBody] IList<RoleAuthorityEntity> entities)
        {
            return await _service.AddRange(entities);
        }
        #endregion [增]

        #region [改]
        #region override
        [HttpPut]
        [Route("Unused")]
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult> Edit([FromBody] RoleEntity entity)
        {
            return MyResults.ApiUnavailable;
        }
        #endregion override

        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit([FromBody] RoleAuthorityEntity entity)
        {
            return await _service.Edit(entity);
        }
        #endregion [改]
        #endregion 【Functions】
    }
}
