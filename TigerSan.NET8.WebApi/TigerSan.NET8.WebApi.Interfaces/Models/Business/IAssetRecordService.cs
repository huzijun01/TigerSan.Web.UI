using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetRecordService : IIdServiceBase<AssetRecordEntity>
    {
        public Task<AssetRecordEntity?> GetLast(long asset);
        public Task<AssetRecordEntity?> GetLastInbound(long asset);
        public Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag);
    }
}
