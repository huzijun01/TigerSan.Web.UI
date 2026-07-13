using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAssetService : IIdServiceBase<AssetEntity>
    {
        public Task<MyActionResult<AssetDto>> GetFull(
            List<long> companies,
            long? id = null,
            string? rfid = null);
        public Task<MyActionResult<AssetEntity>> GetByRFID(string rfid);
        public Task<MyActionResult<List<AssetDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<AssetPosition>> GetPosition(long asset);
        public Task<MyActionResult<List<AssetPosition>>> GetPositionList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<AssetEntity>> Add(AssetDto dto, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<AssetDto> dtos, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Edit(AssetDto dto, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> EditRange(List<AssetDto> dtos, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Inbound(List<long> ids, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Outbound(long site, List<long> ids, bool isBeginTransaction = true);
    }
}
