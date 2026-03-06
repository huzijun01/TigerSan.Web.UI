using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class BaseStationMgtService : ServiceBase<BaseStationMgtEntity>, IBaseStationMgtService
    {
        #region 【Ctor】
        public BaseStationMgtService(AppDbContext db) : base(db, db.BaseStationMgts)
        {
        }
        #endregion 【Ctor】
    }
}
