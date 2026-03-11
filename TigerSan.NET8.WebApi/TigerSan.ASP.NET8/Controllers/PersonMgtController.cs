using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class PersonMgtController : MyControllerBase<PersonMgtEntity>
    {
        #region 【Ctor】
        public PersonMgtController(IPersonMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
