using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AssetRecordService : IdServiceBase<AssetRecordEntity>, IAssetRecordService
    {
        #region 【Fields】
        private IDepartmentService _departmentService;
        #endregion 【Fields】

        #region 【Ctor】
        static AssetRecordService()
        {
            SetDbSetConfig(nameof(AssetRecordEntity.Asset))
                .SetParent(typeof(AssetEntity), nameof(_db.Assets));
        }

        public AssetRecordService(AppDbContext db, IDepartmentService departmentService) : base(db, db.AssetRecords)
        {
            _departmentService = departmentService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“最新数据”
        /// <summary>获取“最新数据”</summary>
        public async Task<AssetRecordEntity?> GetLast(long asset)
        {
            try
            {
                return await _dbSet
                    .AsNoTracking()
                    .Where(ar => ar.Asset == asset)
                    .OrderByDescending(ar => ar.ReportTime)
                    .FirstOrDefaultAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return null;
            }
        }
        #endregion

        #region 获取“最新入库数据”
        /// <summary>获取“最新入库数据”</summary>
        public async Task<AssetRecordEntity?> GetLastInbound(long asset)
        {
            try
            {
                return await _dbSet
                    .AsNoTracking()
                    .Where(ar => ar.Asset == asset && ar.State == AssetStates.Inbound)
                    .OrderByDescending(ar => ar.ReportTime)
                    .FirstOrDefaultAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return null;
            }
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
