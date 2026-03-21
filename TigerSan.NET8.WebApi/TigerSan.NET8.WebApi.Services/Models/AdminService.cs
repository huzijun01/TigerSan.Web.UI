using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AdminService : IdNameServiceBase<AdminEntity>, IAdminService
    {
        #region 【Ctor】
        public AdminService(AppDbContext db) : base(db, db.Admins)
        {
        }
        #endregion 【Ctor】
    }
}
