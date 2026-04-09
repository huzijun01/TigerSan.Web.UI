using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class BatchController : IdControllerBase<BatchEntity, IBatchService>
    {
        #region 【Ctor】
        public BatchController(IBatchService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
