using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class CompanyController : IdNameControllerBase<CompanyEntity, ICompanyService>
    {
        #region 【Ctor】
        public CompanyController(ICompanyService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        [HttpGet]
        [Route("SubCompanyIds/{id}")]
        /// <summary>获取“后代公司ID”集合</summary>
        public async Task<MyActionResult<List<long>>> GetSubCompanyIds(long id)
        {
            var res = MyResults<List<long>>.OperationSuccess;
            res.Data = await _service.GetSubCompanyIds(id);
            return res;
        }
        #endregion 【Functions】
    }
}
