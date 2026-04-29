using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ClassifyByCompany]
    public class PersonController : IdControllerBase<PersonEntity, IPersonService>
    {
        #region 【Ctor】
        public PersonController(IPersonService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<PersonFullEntity>>> GetFullList(
            string? name = null,
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            [FromBody] FilterDto? filter = null)
        {
            return await _service.GetFullList(name, pageSize, pageNumber, sort, ascending, filter);
        }

        [HttpGet]
        [Route("BelongCompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList()
        {
            return await _service.GetBelongCompanyList();
        }

        [HttpGet]
        [Route("BelongDepartmentList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongDepartmentList(long? company = null)
        {
            return await _service.GetBelongDepartmentList(company);
        }

        [HttpGet]
        [Route("BelongRoleList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongRoleList(long? department = null)
        {
            return await _service.GetBelongRoleList(department);
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
