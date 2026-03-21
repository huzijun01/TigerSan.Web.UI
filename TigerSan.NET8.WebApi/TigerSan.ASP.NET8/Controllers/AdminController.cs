using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AdminController : IdNameControllerBase<AdminEntity, IAdminService>
    {
        #region 【Ctor】
        public AdminController(IAdminService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
