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
                .SetParent(typeof(AssetEntity), nameof(_db.Assets), nameof(AssetEntity.Department))
                .SetParent(typeof(DepartmentEntity), nameof(_db.Departments), nameof(DepartmentEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public AssetRecordService(AppDbContext db, IBaseStationService baseStationService) : base(db, db.AssetRecords)
        {
            _baseStationService = baseStationService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [Private]
        #region 初始化“场地”
        /// <summary>初始化“场地”</summary>
        private async Task<MyActionResult<object>> InitSiteAsync(AssetRecordEntity entity)
        {
            try
            {
                if (entity.Station == null)
                {
                    entity.Site = null;
                }
                else
                {
                    var resGetSite = await _baseStationService.GetSite(entity.Station.Value);
                    var site = resGetSite.Data;
                    if (site == null)
                    {
                        return MyResults<object>.Error(resGetSite.Message);
                    }
                    else
                    {
                        entity.Site = site.Id;
                    }
                }
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<object>.OperationSuccess;
        }
        #endregion
        #endregion [Private]

        #region [查]
        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<AssetRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null)
        {
            try
            {
                var list = new List<AssetRecordDto>();

                var res = await GetList(pageSize, pageNumber, sort, ascending, filter);
                if (res.Data == null)
                {
                    return MyResults<List<AssetRecordDto>>.Error(res.Message);
                }
                var records = res.Data;

                // 添加“数据”:
                foreach (var record in records)
                {
                    var dto = new AssetRecordDto();
                    dto.ShallowCopy(record);

                    if (record.Site != null)
                    {
                        var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Site);
                        if (site == null)
                        {
                            LogHelper.Instance.IsNull(nameof(site));
                            continue;
                        }
                        dto.SiteName = site.Name;
                        dto.Addr = site.Addr;
                        dto.AddrDetail = site.AddrDetail;
                    }

                    if (record.TargetSite != null)
                    {
                        var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.TargetSite);
                        if (site == null)
                        {
                            LogHelper.Instance.IsNull(nameof(site));
                            continue;
                        }
                        dto.TargetSiteName = site.Name;
                        dto.TargetAddr = site.Addr;
                        dto.TargetAddrDetail = site.AddrDetail;
                    }

                    if (record.Station != null)
                    {
                        var station = await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Station);
                        if (station == null)
                        {
                            LogHelper.Instance.IsNull(nameof(station));
                            continue;
                        }
                        dto.StationName = station.Name;
                    }

                    list.Add(dto);
                }

                return MyResults<List<AssetRecordDto>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<AssetRecordDto>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“最新数据”
        /// <summary>获取“最新数据”</summary>
        public async Task<MyActionResult<AssetRecordEntity>> GetLast(long asset)
        {
            try
            {
                var entity = await _dbSet
                    .AsNoTracking()
                    .Where(ar => ar.Asset == asset)
                    .OrderByDescending(ar => ar.ReportTime)
                    .FirstOrDefaultAsync();

                return MyResults<AssetRecordEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<AssetRecordEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“最新入库数据”
        /// <summary>获取“最新入库数据”</summary>
        public async Task<MyActionResult<AssetRecordEntity>> GetLastInbound(long asset)
        {
            try
            {
                var entity = await _dbSet
                    .AsNoTracking()
                    .Where(ar => ar.Asset == asset && ar.State == AssetStates.Inbound)
                    .OrderByDescending(ar => ar.ReportTime)
                    .FirstOrDefaultAsync();

                if (entity == null)
                {
                    return MyResults<AssetRecordEntity>.Error(LogHelper.Instance.IsNull(nameof(entity)));
                }

                return MyResults<AssetRecordEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<AssetRecordEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(AssetRecordEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 更新“ID”:
                entity.UpdateId();

                // 初始化“场地”:
                var resInit = await InitSiteAsync(entity);
                if (resInit.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resInit;
                }

                // 添加数据:
                _dbSet.Add(entity);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<AssetRecordEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                foreach (var entity in entities)
                {
                    // 更新“ID”:
                    entity.UpdateId();

                    // 初始化“场地”:
                    var resInit = await InitSiteAsync(entity);
                    if (resInit.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return resInit;
                    }
                }

                // 添加数据:
                await _dbSet.AddRangeAsync(entities);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(AssetRecordEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 检验“资源”是否存在:
                var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                if (find == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                // 修改“数据”:
                find.ShallowCopy(entity);

                // 初始化“场地”:
                var resInit = await InitSiteAsync(entity);
                if (resInit.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resInit;
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 修改“多条数据”
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange(List<AssetRecordEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (entities.Count < 1) return res;

                var ids = entities.Select(i => i.Id).ToList();

                // 检验“资源”是否存在:
                var finds = await _dbSet.Where(i => ids.Contains(i.Id)).ToListAsync();
                if (finds.Count < 1)
                {
                    return MyResults<object>.ResourceNotExist;
                }
                else if (finds.Count < ids.Count)
                {
                    return MyResults<object>.SomeResourceNotExist;
                }

                // 修改“数据”:
                foreach (var find in finds)
                {
                    var entity = entities.FirstOrDefault(i => i.Id == find.Id);
                    if (entity == null)
                    {
                        return MyResults<object>.SomeResourceNotExist;
                    }
                    find.ShallowCopy(entity);

                    // 初始化“场地”:
                    var resInit = await InitSiteAsync(entity);
                    if (resInit.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return resInit;
                    }
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [Other]
        #region 修改“资产记录”
        /// <summary>修改“资产记录”</summary>
        public async Task<MyActionResult<object>> EditAssetRecordAsync(TagDto oldTag, TagDto newTag, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                _editingTags.TryGetValue(newTag.Id, out var editingTag);
                if (editingTag != null || oldTag.Asset == null || newTag.Asset == null) return MyResults<object>.OperationSuccess;
                _editingTags.Add(newTag.Id, newTag);

                var resLast = await GetLast(newTag.Asset.Value);
                if (resLast.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    LogHelper.Instance.Error(resLast.Message);
                    return MyResults<object>.Error(resLast.Message);
                }
                var lastRecord = resLast.Data;

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

                    var res = await Add(lastRecord, false);
                    if (res.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }

                    await _db.SaveChangesAsync();
                    if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                    return MyResults<object>.OperationSuccess;
                }

                var newRecord = new AssetRecordEntity();
                newRecord.ShallowCopy(lastRecord);
                newRecord.ShallowCopy(newTag);
                newRecord.Id = lastRecord.Id;

                if (oldTag.Station != newTag.Station) // “场地”改变，新增“入库记录”
                {
                    // 添加“场地”:
                    if (newTag.Station != null)
                    {
                        var station = await _db.BaseStations.FirstOrDefaultAsync(b => b.Id == newTag.Station.Value);
                        if (station == null)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.IsNull(nameof(transaction));
                            return MyResults<object>.ResourceNotExist;
                        }
                        else
                        {
                            newRecord.Site = station.Site;
                        }
                    }

                    if (lastRecord.State != AssetStates.Outbound
                        && lastRecord.State != AssetStates.InTransit) // 无“出库记录”
                    {
                        MyActionResult<object> resOutbound;
                        lastRecord.State = AssetStates.Outbound;
                        lastRecord.TargetSite = newRecord.Site;

                        if ((lastRecord.State == AssetStates.InStore || lastRecord.State == AssetStates.Stolid)
                            && lastRecord.OnlineState == OnlineStates.Offline) // “在库”且“离线”
                        {
                            // 将“最新记录”改为“出库记录”：
                            resOutbound = await Edit(lastRecord, false);
                        }
                        else
                        {
                            // 新增“出库记录”：
                            lastRecord.ReportTime = lastRecord.ReportTime.AddSeconds(1);
                            resOutbound = await Add(lastRecord, false);
                        }

                        if (resOutbound.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resOutbound.Message);
                            return resOutbound;
                        }
                    }

                    // 新增“入库记录”：
                    newRecord.TargetSite = null;
                    newRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();
                    newRecord.State = AssetStates.Inbound;
                    var res = await Add(newRecord, false);
                    if (res.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        LogHelper.Instance.Error(res.Message);
                        return res;
                    }
                }
                else // 同一场地
                {
                    if (lastRecord.State == AssetStates.InStore) // 在库
                    {
                        // 判断是否“滞留”:
                        var resLastInbound = await GetLastInbound(newTag.Asset.Value);
                        var lastInboundRecord = resLastInbound.Data;
                        if (lastInboundRecord == null)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resLastInbound.Message);
                            return MyResults<object>.Error(resLastInbound.Message);
                        }

                        newRecord.State = (DateTime.Now - lastInboundRecord.ReportTime).TotalHours
                            > Constants.Stolid_Threshold_Hours
                            ? AssetStates.Stolid : AssetStates.InStore;
                    }

                    newRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();

                    if (oldTag.OnlineState != newTag.OnlineState) // “在线状态”改变
                    {
                        if (lastRecord.State == AssetStates.Outbound
                            && newTag.OnlineState == OnlineStates.Offline)
                        {
                            newRecord = new AssetRecordEntity()
                            {
                                Asset = lastRecord.Asset,
                                Tag = lastRecord.Tag,
                                TargetSite = lastRecord.TargetSite,
                                State = AssetStates.InTransit,
                                ReportTime = DateTime.Now
                            };
                        }

                        // 新增记录:
                        var res = await Add(newRecord, false);
                        if (res.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                    else
                    {
                        // 更新记录:
                        var res = await Edit(newRecord, false);
                        if (res.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(res.Message);
                            return res;
                        }
                    }
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                return MyResults<object>.OperationSuccess;
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                LogHelper.Instance.Error(ex.GetMessage());
                return MyResults<object>.Error(ex.GetMessage());
            }
            finally
            {
                _editingTags.Remove(newTag.Id);
            }
        }
        #endregion
        #endregion [Other]
        #endregion 【Functions】
    }
}
