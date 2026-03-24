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
        [HttpGet]
        [Route("Company/{department}")]
        /// <summary>获取“所属公司”</summary>
        public async Task<MyActionResult> GetCompany(long department)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCompany(department);
            return res;
        }

        [HttpPost]
        [Route("CompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult> GetCompany([FromBody] IList<long> departments)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCompanyList(departments);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
