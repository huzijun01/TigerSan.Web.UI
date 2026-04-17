using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ITagService : IIdServiceBase<TagEntity>
    {
        public Task<TagEntity?> Get(string tagId);

        public Task<TagDto?> GetFull(string tagId);

        public Task<List<TagDto>> GetFullList(List<long> ids);

        public Task<List<TagDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);

        public Task<List<TagDto>> GetFullList1(
            int? pageSize = null,
            int? pageNumber = null,
            string? tagId = null,
            long? company = null);

        public Task<TagDto?> GetFull(string? tagId = null, long? company = null);
    }
}
