using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class RoleMgtService : ServiceBase<RoleMgtEntity>, IRoleMgtService
    {
        #region 【Ctor】
        public RoleMgtService(AppDbContext db) : base(db, db.RoleMgts)
        {
        }
        #endregion 【Ctor】
    }
}
