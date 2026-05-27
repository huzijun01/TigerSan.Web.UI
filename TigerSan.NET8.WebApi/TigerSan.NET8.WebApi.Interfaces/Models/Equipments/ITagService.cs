using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ITagService : IIdServiceBase<TagEntity>
    {
        public Task<MyActionResult<TagEntity>> GetByRFID(string rfid);
        public Task<MyActionResult<TagEntity>> GetByTagId(string tagId);
        public Task<MyActionResult<TagDto>> GetFullByTagId(string tagId);
        public Task<MyActionResult<List<TagDto>>> GetFullList(List<long> ids);
        public Task<MyActionResult<TagDto>> GetFull(
            List<long> companies,
            string? tagId = null,
            string? rfid = null);
        public Task<MyActionResult<List<TagDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<List<TagDto>>> GetFullList1(
            List<long> companies,
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            string? tagId = null,
            string? rfid = null);
        public Task<MyActionResult<object>> UpdateOnlineState();
    }
}
