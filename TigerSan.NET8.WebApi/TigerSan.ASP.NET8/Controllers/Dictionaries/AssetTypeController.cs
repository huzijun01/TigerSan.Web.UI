using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AssetTypeController : IdNameControllerBase<AssetTypeEntity, IAssetTypeService>
    {
        #region 【Ctor】
        public AssetTypeController(IAssetTypeService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
