using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AssetStateController : IdNameControllerBase<AssetStateEntity, IAssetStateService>
    {
        #region 【Ctor】
        public AssetStateController(IAssetStateService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
