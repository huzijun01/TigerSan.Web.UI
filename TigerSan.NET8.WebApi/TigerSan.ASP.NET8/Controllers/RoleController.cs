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
        #region Override
        [HttpGet]
        [Route("Unused/Count")]
        /// <summary>获取“总数”</summary>
        public override async Task<MyActionResult<int>> GetCount()
        {
            return MyResults<int>.ApiUnavailable;
        }

        [HttpGet]
        [Route("Unused/List")]
        /// <summary>获取“数据”集合</summary>
        public override async Task<MyActionResult<List<RoleEntity>>> GetList([FromQuery] int? pageSize, [FromQuery] int? pageNumber)
        {
            return MyResults<List<RoleEntity>>.ApiUnavailable;
        }
        #endregion Override

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult<int>> GetCount([FromQuery] long? company = null, [FromQuery] long? department = null)
        {
            var res = MyResults<int>.OperationSuccess;
            res.Data = await _service.GetCount(company, department);
            return res;
        }

        [HttpGet]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult<List<RoleEntity>>> GetList([FromQuery] long? company = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<RoleEntity>>.OperationSuccess;
            res.Data = await _service.GetList(company, pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<RoleAuthorityEntity>>> GetFullList([FromQuery] long? company = null, [FromQuery] long? department = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<RoleAuthorityEntity>>.OperationSuccess;
            res.Data = await _service.GetFullList(company, department, pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("SelectIdNameByDepartment")]
        /// <summary>获取“ID名称对”集合/summary>
        public async Task<MyActionResult<List<IdName>>> SelectIdNameByDepartment([FromQuery] long? department = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.SelectIdNameByDepartment(department);
            return res;
        }

        [HttpGet]
        [Route("BelongCompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList()
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongCompanyList();
            return res;
        }

        [HttpGet]
        [Route("BelongDepartmentList")]
        /// <summary>获取“所属部门”集合</summary>
        public async Task<MyActionResult<List<IdName>>> BelongDepartmentList(long? company = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.BelongDepartmentList(company);
            return res;
        }
        #endregion [查]

        #region [增]
        #region override
        [HttpPost]
        [Route("Unused")]
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add([FromBody] RoleEntity entity)
        {
            return MyResults<object>.ApiUnavailable;
        }

        [HttpPost]
        [Route("Unused/Range")]
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange([FromBody] List<RoleEntity> entities)
        {
            return MyResults<object>.ApiUnavailable;
        }
        #endregion override

        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult<object>> Add([FromBody] RoleAuthorityEntity entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult<object>> AddRange([FromBody] List<RoleAuthorityEntity> entities)
        {
            return await _service.AddRange(entities);
        }
        #endregion [增]

        #region [改]
        #region override
        [HttpPut]
        [Route("Unused")]
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit([FromBody] RoleEntity entity)
        {
            return MyResults<object>.ApiUnavailable;
        }
        #endregion override

        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult<object>> Edit([FromBody] RoleAuthorityEntity entity)
        {
            return await _service.Edit(entity);
        }
        #endregion [改]
        #endregion 【Functions】
    }
}
