using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class CompanyMgtController : MyControllerBase<CompanyMgtEntity>
    {
        #region 【Ctor】
        public CompanyMgtController(ICompanyMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
