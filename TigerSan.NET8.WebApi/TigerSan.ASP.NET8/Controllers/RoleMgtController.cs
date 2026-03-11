using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class RoleMgtController : MyControllerBase<RoleMgtEntity>
    {
        #region 【Ctor】
        public RoleMgtController(IRoleMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
