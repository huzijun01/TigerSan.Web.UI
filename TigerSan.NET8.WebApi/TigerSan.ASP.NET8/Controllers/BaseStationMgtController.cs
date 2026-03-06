using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class BaseStationMgtController : MyControllerBase<BaseStationMgtEntity>
    {
        #region 【Ctor】
        public BaseStationMgtController(IBaseStationMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
