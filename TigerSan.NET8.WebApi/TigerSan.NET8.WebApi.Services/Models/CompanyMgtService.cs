using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class CompanyMgtService : ServiceBase<CompanyMgtEntity>, ICompanyMgtService
    {
        #region 【Ctor】
        public CompanyMgtService(AppDbContext db) : base(db, db.CompanyMgts)
        {
        }
        #endregion 【Ctor】
    }
}
