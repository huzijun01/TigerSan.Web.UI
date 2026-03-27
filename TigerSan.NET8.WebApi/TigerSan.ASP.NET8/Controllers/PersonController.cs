using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class PersonController : IdControllerBase<PersonEntity, IPersonService>
    {
        #region 【Ctor】
        public PersonController(IPersonService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region Override
        [HttpGet]
        [Route("Unused/Count")]
        /// <summary>获取“总数”</summary>
        public override async Task<MyActionResult> GetCount()
        {
            return MyResults.ApiUnavailable;
        }
        #endregion Override

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult> GetCount([FromQuery] long? company = null, [FromQuery] long? department = null, [FromQuery] long? role = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCount(company, department, role);
            return res;
        }

        [HttpGet]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult> GetFullList([FromQuery] long? company = null, [FromQuery] long? department = null, [FromQuery] long? role = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetFullList(company, department, role, pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("BelongCompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult> GetBelongCompanyList()
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetBelongCompanyList();
            return res;
        }

        [HttpGet]
        [Route("BelongDepartmentList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult> GetBelongDepartmentList(long? company = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetBelongDepartmentList(company);
            return res;
        }

        [HttpGet]
        [Route("BelongRoleList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult> GetBelongRoleList(long? department = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetBelongRoleList(department);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
