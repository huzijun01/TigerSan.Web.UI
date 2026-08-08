using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IInventoryRecordService : IIdServiceBase<InventoryRecordEntity>
    {
        // 查:
        /// <summary>获取“完整数据”</summary>
        public Task<MyActionResult<InventoryRecordDto>> GetFull(long id);
        /// <summary>获取“完整数据”集合</summary>
        public Task<MyActionResult<List<InventoryRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        // Other:
        /// <summary>盘点</summary>
        public Task<MyActionResult<object>> Inventory(long site);
        /// <summary>盘点全部</summary>
        public Task<MyActionResult<object>> InventoryAll(bool isBeginTransaction = true);
        /// <summary>增加“资产”</summary>
        public Task<MyActionResult<object>> AddAsset(long site);
        /// <summary>减少“资产”</summary>
        public Task<MyActionResult<object>> ReduceAsset(long site);
    }
}
