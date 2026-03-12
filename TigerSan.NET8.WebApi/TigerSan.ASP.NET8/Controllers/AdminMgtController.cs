using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AdminMgtController : MyControllerBase<AdminMgtEntity>
    {
        #region 【Ctor】
        public AdminMgtController(IAdminMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
