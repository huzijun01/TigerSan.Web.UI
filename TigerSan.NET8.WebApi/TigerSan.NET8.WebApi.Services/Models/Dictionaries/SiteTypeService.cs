using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class SiteTypeService : IdNameServiceBase<SiteTypeEntity>, ISiteTypeService
    {
        #region 【Ctor】
        public SiteTypeService(AppDbContext db) : base(db, db.SiteTypes)
        {
        }
        #endregion 【Ctor】
    }
}
