using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ITagService : IIdServiceBase<TagEntity>
    {
        /// <summary>根据“RFID”获取“单条数据”</summary>
        public Task<MyActionResult<TagEntity>> GetByRFID(string rfid);
        /// <summary>根据“TagId”获取“单条数据”</summary>
        public Task<MyActionResult<TagEntity>> GetByTagId(string tagId);
        /// <summary>根据“TagId”获取“单条完整数据”</summary>
        public Task<MyActionResult<TagDto>> GetFullByTagId(string tagId);
        /// <summary>获取“完整数据”集合（根据ID列表）</summary>
        public Task<MyActionResult<List<TagDto>>> GetFullList(List<long> ids);
        public Task<MyActionResult<TagDto>> GetFull(
            List<long> companies,
            string? tagId = null,
            string? rfid = null);
        /// <summary>获取“完整数据”集合</summary>
        public Task<MyActionResult<List<TagDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        /// <summary>获取“完整数据”集合（tagId、rfid）</summary>
        public Task<MyActionResult<List<TagDto>>> GetFullList1(
            List<long> companies,
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            string? tagId = null,
            string? rfid = null);
        /// <summary>更新“在线状态”</summary>
        public Task<MyActionResult<object>> UpdateOnlineState();
    }
}
