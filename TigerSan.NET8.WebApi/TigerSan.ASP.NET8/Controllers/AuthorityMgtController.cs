using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AuthorityMgtController : MyControllerBase<AuthorityMgtEntity>
    {
        #region 【Ctor】
        public AuthorityMgtController(IAuthorityMgtService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
