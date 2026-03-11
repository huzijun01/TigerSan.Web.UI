using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AuthorityMgtService : ServiceBase<AuthorityMgtEntity>, IAuthorityMgtService
    {
        #region 【Ctor】
        public AuthorityMgtService(AppDbContext db) : base(db, db.AuthorityMgts)
        {
        }
        #endregion 【Ctor】
    }
}
