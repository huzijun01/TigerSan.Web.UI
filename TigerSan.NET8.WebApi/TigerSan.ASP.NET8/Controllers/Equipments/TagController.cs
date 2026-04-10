using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class TagController : IdControllerBase<TagEntity, ITagService>
    {
        #region 【Ctor】
        public TagController(ITagService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
