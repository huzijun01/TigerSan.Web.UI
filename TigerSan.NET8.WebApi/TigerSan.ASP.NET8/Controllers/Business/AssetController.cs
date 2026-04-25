using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AssetController : IdControllerBase<AssetEntity, IAssetService>
    {
        #region 【Ctor】
        public AssetController(IAssetService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<AssetDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            [FromBody] FilterDto? filter = null)
        {
            var res = MyResults<List<AssetDto>>.OperationSuccess;
            res.Data = await _service.GetFullList(pageSize, pageNumber, filter);
            return res;
        }

        [HttpPost]
        [Route("IdAssetIdList")]
        /// <summary>获取“ID资产ID对”集合</summary>
        public async Task<MyActionResult<List<IdValue<string>>>> GetIdAssetIdList(bool? isDistinct = null, [FromBody] FilterDto? filter = null)
        {
            var res = MyResults<List<IdValue<string>>>.OperationSuccess;
            res.Data = await _service.SelectIdValue(i => i.AssetId, isDistinct, filter);
            return res;
        }
        #endregion [查]

        #region [增]
        #region override
        [HttpPost]
        [Route("Unused")]
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add([FromBody] AssetEntity entity)
        {
            return MyResults<object>.ApiUnavailable;
        }

        [HttpPost]
        [Route("Unused/Range")]
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange([FromBody] List<AssetEntity> entities)
        {
            return MyResults<object>.ApiUnavailable;
        }
        #endregion override

        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult<object>> Add([FromBody] AssetDto dto)
        {
            return await _service.Add(dto);
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult<object>> AddRange([FromBody] List<AssetDto> dtos)
        {
            return await _service.AddRange(dtos);
        }
        #endregion [增]

        #region [改]
        #region override
        [HttpPut]
        [Route("Unused")]
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit([FromBody] AssetEntity entity)
        {
            return MyResults<object>.ApiUnavailable;
        }

        [HttpPut]
        [Route("Unused/Range")]
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange([FromBody] List<AssetEntity> entities)
        {
            return MyResults<object>.ApiUnavailable;
        }
        #endregion override

        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult<object>> Edit([FromBody] AssetDto dto)
        {
            return await _service.Edit(dto);
        }

        [HttpPut]
        [Route("Range")]
        /// <summary>修改“多条数据”</summary>
        public async Task<MyActionResult<object>> EditRange([FromBody] List<AssetDto> dtos)
        {
            return await _service.EditRange(dtos);
        }
        #endregion [改]

        #region [Other]
        [HttpPut]
        [Route("Inbound")]
        /// <summary>入库</summary>
        public async Task<MyActionResult<object>> Inbound([FromBody] List<long> ids)
        {
            return await _service.Inbound(ids);
        }

        [HttpPut]
        [Route("Outbound/{site}")]
        /// <summary>出库</summary>
        public async Task<MyActionResult<object>> Outbound(long site, [FromBody] List<long> ids)
        {
            return await _service.Outbound(site, ids);
        }
        #endregion [Other]
        #endregion 【Functions】
    }
}
