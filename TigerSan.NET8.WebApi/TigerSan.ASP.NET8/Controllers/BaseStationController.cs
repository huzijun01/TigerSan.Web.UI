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
        #region Override
        [HttpPost]
        [Route("Unused/Count")]
        /// <summary>获取“总数”</summary>
        public override async Task<MyActionResult<int>> GetCount([FromBody] FilterDto? filter = null)
        {
            return MyResults<int>.ApiUnavailable;
        }

        [HttpPost]
        [Route("Unused/List")]
        /// <summary>获取“数据”集合</summary>
        public override async Task<MyActionResult<List<BaseStationEntity>>> GetList(
            [FromQuery] int? pageSize,
            [FromQuery] int? pageNumber,
            [FromBody] FilterDto? filter = null)
        {
            return MyResults<List<BaseStationEntity>>.ApiUnavailable;
        }
        #endregion Override

        [HttpPost]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult<int>> GetCount([FromQuery] long? company = null, [FromQuery] long? site = null, [FromQuery] OnlineState? state = null, [FromQuery] long? type = null)
        {
            var res = MyResults<int>.OperationSuccess;
            res.Data = await _service.GetCount(company, site, state, type);
            return res;
        }

        [HttpPost]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult<List<BaseStationEntity>>> GetList([FromQuery] long? company = null, [FromQuery] long? site = null, [FromQuery] OnlineState? state = null, [FromQuery] long? type = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<BaseStationEntity>>.OperationSuccess;
            res.Data = await _service.GetList(company, site, state, type, pageSize, pageNumber);
            return res;
        }

        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<BaseStationDto>>> GetFullList([FromQuery] long? company = null, [FromQuery] long? site = null, [FromQuery] OnlineState? state = null, [FromQuery] long? type = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<BaseStationDto>>.OperationSuccess;
            res.Data = await _service.GetFullList(company, site, state, type, pageSize, pageNumber);
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
        public async Task<MyActionResult<List<IdName>>> BelongStationTypeList(long? company = null, [FromQuery] long? site = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongStationTypeList(company, site);
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
