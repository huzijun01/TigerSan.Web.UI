using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class SiteTypeService : IdNameCompanyServiceBase<SiteTypeEntity>, ISiteTypeService
    {
        #region 【Ctor】
        static SiteTypeService()
        {
            SetDbSetConfig(nameof(SiteTypeEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public SiteTypeService(AppDbContext db) : base(db, db.SiteTypes)
        {
        }
        #endregion 【Ctor】
    }
}
