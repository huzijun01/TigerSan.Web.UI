using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class StationTypeService : IdNameServiceBase<StationTypeEntity>, IStationTypeService
    {
        #region 【Ctor】
        public StationTypeService(AppDbContext db) : base(db, db.StationTypes)
        {
        }
        #endregion 【Ctor】
    }
}
