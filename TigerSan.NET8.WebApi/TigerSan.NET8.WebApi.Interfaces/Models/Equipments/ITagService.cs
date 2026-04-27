using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ITagService : IIdServiceBase<TagEntity>
    {
        public Task<MyActionResult<TagEntity>> Get(string tagId);

        public Task<MyActionResult<TagDto>> GetFull(string tagId);

        public Task<MyActionResult<List<TagDto>>> GetFullList(List<long> ids);

        public Task<MyActionResult<List<TagDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);

        public Task<MyActionResult<List<TagDto>>> GetFullList1(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            string? tagId = null,
            long? company = null);

        public Task<MyActionResult<TagDto>> GetFull(string? tagId = null, long? company = null);
    }
}
