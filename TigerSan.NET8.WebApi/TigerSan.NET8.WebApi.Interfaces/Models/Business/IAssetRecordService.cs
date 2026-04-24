using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetRecordService : IIdServiceBase<AssetRecordEntity>
    {
        public Task<List<AssetRecordDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);
        public Task<AssetRecordEntity?> GetLast(long asset);
        public Task<AssetRecordEntity?> GetLastInbound(long asset);
        public Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag);
    }
}
