using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetService : IIdServiceBase<AssetEntity>
    {
        /// <summary>获取“完整数据”</summary>
        public Task<MyActionResult<AssetDto>> GetFull(
            List<long> companies,
            long? id = null,
            string? assetId = null,
            string? rfid = null);
        /// <summary>根据“RFID”获取“单条数据”</summary>
        public Task<MyActionResult<AssetEntity>> GetByRFID(string rfid);
        /// <summary>获取“完整数据”集合</summary>
        public Task<MyActionResult<List<AssetDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        /// <summary>获取“位置”</summary>
        public Task<MyActionResult<PositionDto>> GetPosition(long asset);
        /// <summary>获取“位置”集合</summary>
        public Task<MyActionResult<List<PositionDto>>> GetPositionList(
            string? rfid = null,
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        /// <summary>入库</summary>
        public Task<MyActionResult<object>> Inbound(List<long> ids, bool isBeginTransaction = true);
        /// <summary>出库</summary>
        public Task<MyActionResult<object>> Outbound(long site, List<long> ids, bool isBeginTransaction = true);
    }
}
