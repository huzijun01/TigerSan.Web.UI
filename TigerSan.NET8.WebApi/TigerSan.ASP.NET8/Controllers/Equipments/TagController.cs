using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [FilterByCompany]
    public class TagController : IdControllerBase<TagEntity, ITagService>
    {
        #region 【Ctor】
        public TagController(ITagService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpGet]
        [Route("Full")]
        /// <summary>根据“TagId”或“RFID”获取“单条数据”</summary>
        public async Task<MyActionResult<TagDto>> GetFull(string? tagId = null, string? rfid = null)
        {
            if (AccessibleCompanies == null) return MyResults<TagDto>.AccessibleCompaniesCannotBeNull;
            return await _service.GetFull(AccessibleCompanies.Select(i => i.Id).ToList(), tagId, rfid);
        }

        [HttpGet]
        [Route("ByTagId/{tagId}")]
        /// <summary>根据“TagId”获取“单条数据”</summary>
        public async Task<MyActionResult<TagEntity>> GetByTagId(string tagId)
        {
            return await _service.GetByTagId(tagId);
        }

        [HttpGet]
        [Route("FullByTagId/{tagId}")]
        /// <summary>根据“TagId”获取“单条完整数据”</summary>
        public async Task<MyActionResult<TagDto>> GetFullByTagId(string tagId)
        {
            return await _service.GetFullByTagId(tagId);
        }

        [HttpGet]
        [Route("ByRFID/{rfid}")]
        /// <summary>根据“RFID”获取“单条数据”</summary>
        public async Task<MyActionResult<TagEntity>> GetByRFID(string rfid)
        {
            return await _service.GetByRFID(rfid);
        }

        [HttpPost]
        [Route("FullList")]
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<TagDto>>> GetFullList(
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
