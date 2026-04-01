using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
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
        public override async Task<MyActionResult<List<SiteEntity>>> GetList([FromQuery] int? pageSize, [FromQuery] int? pageNumber)
        {
            return MyResults<List<SiteEntity>>.ApiUnavailable;
        }
        #endregion Override

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult<int>> GetCount([FromQuery] long? company = null, [FromQuery] long? type = null)
        {
            var res = MyResults<int>.OperationSuccess;
            res.Data = await _service.GetCount(company, type);
            return res;
        }

        [HttpGet]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult<List<SiteEntity>>> GetList([FromQuery] long? company = null, [FromQuery] long? type = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<SiteEntity>>.OperationSuccess;
            res.Data = await _service.GetList(company, type, pageSize, pageNumber);
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
        [Route("BelongSiteTypeList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongSiteTypeList([FromQuery] long? company = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongSiteTypeList(company);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
