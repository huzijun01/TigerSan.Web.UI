using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class SiteController : IdNameControllerBase<SiteEntity, ISiteService>
    {
        #region 【Ctor】
        public SiteController(ISiteService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
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
        [Route("BelongSiteTypeList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongSiteTypeList(long? company = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongSiteTypeList(company);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
