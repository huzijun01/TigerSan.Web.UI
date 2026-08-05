using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetRecordService : IIdServiceBase<AssetRecordEntity>
    {
        /// <summary>获取“最新数据”</summary>
        public Task<MyActionResult<AssetRecordEntity>> GetLast(long asset);
        /// <summary>获取“最新完整数据”</summary>
        public Task<MyActionResult<AssetRecordDto>> GetFullLast(long asset);
        /// <summary>获取“完整数据”集合</summary>
        public Task<MyActionResult<List<AssetRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        /// <summary>获取“路径”</summary>
        public Task<MyActionResult<List<AssetLngLat>>> GetPath(
            long asset,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            FilterDto? filter = null);
        /// <summary>获取“最新入库数据”</summary>
        public Task<MyActionResult<AssetRecordEntity>> GetLastInbound(long asset);
        /// <summary>计算</summary>
        public Task<MyActionResult<object>> Calculate(long id, bool isBeginTransaction = true);
        /// <summary>修改“资产记录”</summary>
        public Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag, bool isBeginTransaction = true);
    }
}
