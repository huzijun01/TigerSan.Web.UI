using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class BaseStationService : IdServiceBase<BaseStationEntity>, IBaseStationService
    {
        #region 【Ctor】
        public BaseStationService(AppDbContext db) : base(db, db.BaseStations)
        {
        }
        #endregion 【Ctor】
    }
}
