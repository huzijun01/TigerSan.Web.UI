using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ClassifyByCompany]
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
            return await _service.GetBelongCompanyList();
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

        #region [增]
        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add([FromBody] BaseStationEntity entity)
        {
            var res = await _service.Add(entity);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange([FromBody] List<BaseStationEntity> entities)
        {
            var res = await _service.AddRange(entities);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }
        #endregion [增]

        #region [改]
        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit([FromBody] BaseStationEntity entity)
        {
            var res = await _service.Edit(entity);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }

        [HttpPut]
        [Route("Range")]
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange([FromBody] List<BaseStationEntity> entities)
        {
            var res = await _service.EditRange(entities);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }
        #endregion [改]

        #region [删]
        [HttpDelete]
        [Route("{id}")]
        /// <summary>删除“单条数据”</summary>
        public override async Task<MyActionResult<object>> Remove(long id)
        {
            var res = await _service.Remove(id);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }

        [HttpDelete]
        [Route("Range")]
        /// <summary>删除“多条数据”</summary>
        public override async Task<MyActionResult<object>> RemoveRange([FromBody] List<long> ids)
        {
            var res = await _service.RemoveRange(ids);
            await SseInstance.UpdateBaseStationCachesAsync();
            return res;
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
