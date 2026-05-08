using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [FilterByCompany]
    public class BaseStationController : IdNameControllerBase<BaseStationEntity, IBaseStationService>
    {
        #region 【Ctor】
        public BaseStationController(IBaseStationService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpGet]
        [Route("ByMacAddr/{macAddr}")]
        /// <summary>根据“MAC地址”获取“单条数据”</summary>
        public async Task<MyActionResult<BaseStationEntity>> GetByMacAddr(string macAddr)
        {
            return await _service.GetByMacAddr(macAddr);
        }

        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<BaseStationDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            [FromBody] FilterDto? filter = null)
        {
            return await _service.GetFullList(pageSize, pageNumber, sort, ascending, filter);
        }

        [HttpGet]
        [Route("BelongCompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList()
        {
            return await _service.GetBelongCompanyList(AccessibleCompanies);
        }

        [HttpGet]
        [Route("BelongSiteList")]
        /// <summary>获取“所属场地”集合</summary>
        public async Task<MyActionResult<List<IdName>>> BelongSiteList(long? company = null)
        {
            return await _service.GetBelongSiteList(company);
        }

        [HttpGet]
        [Route("BelongStationTypeList")]
        /// <summary>获取“所属场地”集合</summary>
        public async Task<MyActionResult<List<IdName>>> BelongStationTypeList(long? company = null, long? site = null)
        {
            return await _service.GetBelongStationTypeList(company, site);
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
