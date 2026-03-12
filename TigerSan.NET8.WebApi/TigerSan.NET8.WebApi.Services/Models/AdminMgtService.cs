using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AdminMgtService : ServiceBase<AdminMgtEntity>, IAdminMgtService
    {
        #region 【Ctor】
        public AdminMgtService(AppDbContext db) : base(db, db.AuthorityMgts)
        {
        }
        #endregion 【Ctor】
    }
}
