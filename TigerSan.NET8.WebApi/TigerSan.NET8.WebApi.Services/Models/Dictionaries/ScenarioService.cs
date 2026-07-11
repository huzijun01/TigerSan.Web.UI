using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class ScenarioService : IdNameServiceBase<ScenarioEntity>, IScenarioService
    {
        #region 【Ctor】
        public ScenarioService(AppDbContext db) : base(db, db.Scenarios)
        {
        }
        #endregion 【Ctor】
    }
}
