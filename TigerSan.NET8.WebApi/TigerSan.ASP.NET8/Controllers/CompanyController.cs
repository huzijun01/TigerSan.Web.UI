using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class CompanyController : IdNameControllerBase<CompanyEntity, ICompanyService>
    {
        #region 【Ctor】
        public CompanyController(ICompanyService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
