using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AuthorityController : IdControllerBase<AuthorityEntity, IAuthorityService>
    {
        #region 【Ctor】
        public AuthorityController(IAuthorityService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
