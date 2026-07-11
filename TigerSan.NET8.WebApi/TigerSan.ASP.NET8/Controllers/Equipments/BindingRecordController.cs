using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class BindingRecordController : IdControllerBase<BindingRecordEntity, IBindingRecordService>
    {
        #region 【Ctor】
        public BindingRecordController(IBindingRecordService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("Last")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<BindingRecordEntity>> GetLast(long? tag = null, long? asset = null)
        {
            return await _service.GetLast(tag, asset);
        }

        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<BindingRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            [FromBody] FilterDto? filter = null)
        {
            return await _service.GetFullList(pageSize, pageNumber, sort, ascending, filter);
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
