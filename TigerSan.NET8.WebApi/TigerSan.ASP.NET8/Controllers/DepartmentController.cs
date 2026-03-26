using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class DepartmentController : IdNameControllerBase<DepartmentEntity, IDepartmentService>
    {
        #region 【Ctor】
        public DepartmentController(IDepartmentService service) : base(service)
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

        [HttpGet]
        [Route("Unused/List")]
        /// <summary>获取“数据”集合</summary>
        public override async Task<MyActionResult> GetList([FromQuery] int? pageSize, [FromQuery] int? pageNumber)
        {
            return MyResults.ApiUnavailable;
        }
        #endregion Override

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult> GetCount([FromQuery] long? company = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCount(company);
            return res;
        }

        [HttpGet]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult> GetList([FromQuery] long? company = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetList(company, pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("Company/{department}")]
        /// <summary>获取“所属公司”</summary>
        public async Task<MyActionResult> GetCompany(long department)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCompany(department);
            return res;
        }

        [HttpGet]
        [Route("CompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult> GetCompanyList()
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCompanyList();
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
