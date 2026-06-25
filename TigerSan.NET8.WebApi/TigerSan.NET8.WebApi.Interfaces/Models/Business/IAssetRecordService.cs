using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetRecordService : IIdServiceBase<AssetRecordEntity>
    {
        public Task<MyActionResult<AssetRecordEntity>> GetLast(long asset);
        public Task<MyActionResult<AssetRecordDto>> GetFullLast(long asset);
        public Task<MyActionResult<List<AssetRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<List<AssetLngLat>>> GetPath(
            long asset,
            DateTime? start = null,
            DateTime? end = null,
            FilterDto? filter = null);
        public Task<MyActionResult<AssetRecordEntity>> GetLastInbound(long asset);
        public Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag, bool isBeginTransaction = true);
    }
}
