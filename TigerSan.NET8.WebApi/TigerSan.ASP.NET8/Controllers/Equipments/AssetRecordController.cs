using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [FilterByCompany]
    public class StationRecordController : IdControllerBase<StationRecordEntity, IStationRecordService>
    {
        #region 【Ctor】
        public StationRecordController(IStationRecordService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpPost]
        [Route("Path")]
        /// <summary>获取“路径”</summary>
        public async Task<MyActionResult<List<StationRecordEntity>>> GetPath(
            long station,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            [FromBody] FilterDto? filter = null)
        {
            return await _service.GetPath(station, start, end, locationMode, filter);
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
