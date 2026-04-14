using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AssetStateService : IdNameServiceBase<AssetStateEntity>, IAssetStateService
    {
        #region 【Ctor】
        public AssetStateService(AppDbContext db) : base(db, db.AssetStates)
        {
        }
        #endregion 【Ctor】
    }
}
