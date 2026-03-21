using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class PersonService : IdServiceBase<PersonEntity>, IPersonService
    {
        #region 【Ctor】
        public PersonService(AppDbContext db) : base(db, db.Persons)
        {
        }
        #endregion 【Ctor】
    }
}
