using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class AssetRecordController : IdControllerBase<AssetRecordEntity, IAssetRecordService>
    {
        #region 【Ctor】
        public AssetRecordController(IAssetRecordService service) : base(service)
        {
        }
        #endregion 【Ctor】
    }
}
