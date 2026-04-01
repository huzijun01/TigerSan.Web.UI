using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class SiteTypeController : IdNameControllerBase<SiteTypeEntity, ISiteTypeService>
    {
        #region 【Ctor】
        public SiteTypeController(ISiteTypeService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
