using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IStationRecordService : IIdServiceBase<StationRecordEntity>
    {
        /// <summary>获取“坐标”总数</summary>
        public Task<MyActionResult<int>> GetC‌oordCount(
            long station,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            FilterDto? filter = null);
        /// <summary>获取“路径”</summary>
        public Task<MyActionResult<List<StationRecordEntity>>> GetPath(
            long station,
            int? pageSize = GlobalSettings.MaxCoordCount,
            int? pageNumber = 1,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            FilterDto? filter = null);
        /// <summary>清理“过期记录”</summary>
        public Task<MyActionResult<int>> ClearExpiredRecord();
    }
}
