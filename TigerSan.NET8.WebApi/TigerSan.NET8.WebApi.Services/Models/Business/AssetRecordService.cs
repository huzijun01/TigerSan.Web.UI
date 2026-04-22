using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AssetRecordService : IdServiceBase<AssetRecordEntity>, IAssetRecordService
    {
        #region 【Fields】
        private IBaseStationService _baseStationService;
        /// <summary>正在修改的标签</summary>
        private Dictionary<long, TagDto> _editingTags = new Dictionary<long, TagDto>();
        #endregion 【Fields】

        #region 【Ctor】
        static AssetRecordService()
        {
            SetDbSetConfig(nameof(AssetRecordEntity.Asset))
                .SetParent(typeof(AssetEntity), nameof(_db.Assets));
        }

        public AssetRecordService(AppDbContext db, IBaseStationService baseStationService) : base(db, db.AssetRecords)
        {
            _baseStationService = baseStationService;
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

        #region [改]

        #region 修改“资产记录”
        /// <summary>修改“资产记录”</summary>
        public async Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag)
        {
            try
            {
                _editingTags.TryGetValue(newTag.Id, out var editingTag);
                if (editingTag != null || oldTag.Asset == null || newTag.Asset == null) return MyResults<object>.OperationSuccess;
                _editingTags.Add(newTag.Id, newTag);

                var lastRecord = await GetLast(newTag.Asset.Value);

                if (lastRecord == null) // 首条记录，新增“入库记录”
                {
                    lastRecord = new AssetRecordEntity()
                    {
                        Asset = newTag.Asset.Value,
                        Tag = newTag.Id,
                        State = AssetStates.Inbound,
                    };
                    lastRecord.ShallowCopy(newTag);
                    lastRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();

                    var res = await Add(lastRecord);
                    if (res.IsError)
                    {
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }

                    return MyResults<object>.OperationSuccess;
                }

                var id = lastRecord.Id;
                lastRecord.ShallowCopy(newTag);
                lastRecord.Id = id;
                lastRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();

                if (oldTag.Station != newTag.Station) // “场地”改变，新增“入库记录”
                {
                    // 添加“场地”:
                    if (newTag.Station != null)
                    {
                        var site = await _baseStationService.GetSite(newTag.Station.Value);
                        if (site == null)
                        {
                            return MyResults<object>.ResourceNotExist;
                        }
                        else
                        {
                            lastRecord.Site = site.Id;
                        }
                    }

                    if (lastRecord.State != AssetStates.Outbound) // 无“出库记录”
                    {
                        // 将“最新记录”改为“出库记录”：
                        lastRecord.State = AssetStates.Outbound;
                        var resEdit = await Edit(lastRecord);
                        if (resEdit.IsError)
                        {
                            LogHelper.Instance.Error(resEdit.Message);
                            return resEdit;
                        }
                    }

                    lastRecord.State = AssetStates.Inbound;
                    var res = await Add(lastRecord);
                    if (res.IsError)
                    {
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }
                }
                else // 同一场地
                {
                    if (lastRecord.State == AssetStates.InStore) // 在库
                    {
                        // 判断是否“滞留”:
                        var lastInboundRecord = await GetLastInbound(newTag.Asset.Value);
                        if (lastInboundRecord == null)
                        {
                            LogHelper.Instance.IsNull(nameof(lastInboundRecord));
                            return MyResults<object>.ResourceNotExist;
                        }

                        lastRecord.State = (DateTime.Now - lastInboundRecord.ReportTime).TotalHours
                            > Constants.Stolid_Threshold_Hours
                            ? AssetStates.Stolid : AssetStates.InStore;
                    }

                    if (oldTag.OnlineState != newTag.OnlineState) // “在线状态”改变，新增记录
                    {
                        var res = await Add(lastRecord);
                        if (res.IsError)
                        {
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                    else // 更新记录
                    {
                        var res = await Edit(lastRecord);
                        if (res.IsError)
                        {
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                }

                return MyResults<object>.OperationSuccess;
            }
            finally
            {
                _editingTags.Remove(newTag.Id);
            }
        }
        #endregion
        #endregion [改]

        #region [Other]
        #region 入库

        #endregion
        #endregion [Other]
        #endregion 【Functions】
    }
}
