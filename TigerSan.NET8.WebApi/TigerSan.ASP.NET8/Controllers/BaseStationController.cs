using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class BaseStationController : IdNameControllerBase<BaseStationEntity, IBaseStationService>
    {
        #region 【Ctor】
        public BaseStationController(IBaseStationService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<BaseStationDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            [FromBody] FilterDto? filter = null)
        {
            var res = MyResults<List<BaseStationDto>>.OperationSuccess;
            res.Data = await _service.GetFullList(pageSize, pageNumber, filter);
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
        [Route("BelongSiteList")]
        /// <summary>获取“所属场地”集合</summary>
        public async Task<MyActionResult<List<IdName>>> BelongSiteList(long? company = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongSiteList(company);
            return res;
        }

        [HttpGet]
        [Route("BelongStationTypeList")]
        /// <summary>获取“所属场地”集合</summary>
        public async Task<MyActionResult<List<IdName>>> BelongStationTypeList(long? company = null, long? site = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongStationTypeList(company, site);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
