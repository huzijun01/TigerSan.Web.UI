using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class PersonMgtService : ServiceBase<PersonMgtEntity>, IPersonMgtService
    {
        #region 【Ctor】
        public PersonMgtService(AppDbContext db) : base(db, db.PersonMgts)
        {
        }
        #endregion 【Ctor】
    }
}
