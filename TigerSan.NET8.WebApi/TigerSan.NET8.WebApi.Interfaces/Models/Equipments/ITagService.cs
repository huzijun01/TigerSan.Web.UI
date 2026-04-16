using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ITagService : IIdServiceBase<TagEntity>
    {
        public Task<List<TagDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);

        public Task<List<TagDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? tagId = null,
            long? company = null);

        public Task<TagDto?> GetFull(string? tagId = null, long? company = null);
    }
}
