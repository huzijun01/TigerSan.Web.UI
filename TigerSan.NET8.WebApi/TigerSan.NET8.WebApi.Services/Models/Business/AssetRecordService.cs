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
        private readonly IInventoryRecordService _inventoryRecordService;

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

        public AssetRecordService(
            AppDbContext db,
            IBaseStationService baseStationService,
            IInventoryRecordService inventoryRecordService) : base(db, db.AssetRecords)
        {
            _baseStationService = baseStationService;
            _inventoryRecordService = inventoryRecordService;
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

        #region 是否“移动”
        /// <summary>是否“移动”</summary>
        private bool IsMoved(TagDto oldTag, TagDto newTag)
        {
            if (oldTag.Longitude == null
                || oldTag.Latitude == null
                || newTag.Longitude == null
                || newTag.Latitude == null) return false;
            var p1 = new Point2(oldTag.Longitude.Value, oldTag.Latitude.Value);
            var p2 = new Point2(newTag.Longitude.Value, newTag.Latitude.Value);
            return p1.Haversine(p2) > GlobalSettings.DistanceThresholdMeters;
        }
        #endregion

        #region 是否“移动”
        /// <summary>是否“移动”</summary>
        private bool IsMoved(AssetLngLat oldTag, AssetLngLat newTag)
        {
            if (oldTag.Longitude == null
                || oldTag.Latitude == null
                || newTag.Longitude == null
                || newTag.Latitude == null) return false;
            var p1 = new Point2(oldTag.Longitude.Value, oldTag.Latitude.Value);
            var p2 = new Point2(newTag.Longitude.Value, newTag.Latitude.Value);
            return p1.Haversine(p2) > GlobalSettings.DistanceThresholdMeters;
        }
        #endregion

        #region 获取“在库时长”
        /// <summary>获取“在库时长”</summary>
        private double GetStayDuration(List<AssetRecordEntity> records)
        {
            double duration = 0;

            // 过滤掉“重复记录”和“无关记录”:
            var sortedRecords = records.OrderBy(r => r.ReportTime).ToList();
            var filteredRecords = new List<AssetRecordEntity>();
            AssetRecordEntity? preRecord = null;
            foreach (var record in sortedRecords)
            {
                if (preRecord == null)
                {
                    if (record.State != AssetStates.Inbound)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
                else
                {
                    if (preRecord.State == record.State
                        || record.State != AssetStates.Inbound && record.State != AssetStates.Outbound)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
            }

            // 计算:
            AssetRecordEntity? inbound = null;

            foreach (var record in filteredRecords)
            {
                if (record.State == AssetStates.Inbound)
                {
                    if (inbound != null)
                    {
                        LogHelper.Instance.Warning("Repeated inbound records!");
                        return -1;
                    }
                    inbound = record;
                }
                else
                {
                    if (inbound == null)
                    {
                        LogHelper.Instance.Warning("Inbound record without corresponding outbound!");
                        return -1;
                    }
                    duration += (record.ReportTime - inbound.ReportTime).TotalHours;
                    inbound = null;
                }
            }

            if (inbound != null)
            {
                duration += (DateTimeHelper.GetUtcNow() - inbound.ReportTime).TotalHours;
            }

            return Math.Round(duration, 2, MidpointRounding.AwayFromZero);
        }
        #endregion

        #region 获取“在途时长”
        /// <summary>获取“在途时长”</summary>
        private double GetTravelDuration(List<AssetRecordEntity> records)
        {
            double duration = 0;

            // 过滤掉“重复记录”和“无关记录”:
            var sortedRecords = records.OrderBy(r => r.ReportTime).ToList();
            var filteredRecords = new List<AssetRecordEntity>();
            AssetRecordEntity? preRecord = null;
            foreach (var record in sortedRecords)
            {
                if (preRecord == null)
                {
                    if (record.State != AssetStates.Outbound)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
                else
                {
                    if (preRecord.State == record.State
                        || record.State != AssetStates.Inbound && record.State != AssetStates.Outbound)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
            }

            // 计算:
            AssetRecordEntity? outbound = null;

            foreach (var record in filteredRecords)
            {
                if (record.State == AssetStates.Outbound)
                {
                    if (outbound != null)
                    {
                        LogHelper.Instance.Warning("Repeated outbound records!");
                        return -1;
                    }
                    outbound = record;
                }
                else
                {
                    if (outbound == null)
                    {
                        LogHelper.Instance.Warning("Inbound record without corresponding outbound!");
                        return -1;
                    }
                    duration += (record.ReportTime - outbound.ReportTime).TotalHours;
                    outbound = null;
                }
            }

            if (outbound != null)
            {
                duration += (DateTimeHelper.GetUtcNow() - outbound.ReportTime).TotalHours;
            }

            return Math.Round(duration, 2, MidpointRounding.AwayFromZero);
        }
        #endregion

        #region 获取“离线时长”
        /// <summary>获取“离线时长”</summary>
        private double GetOfflineDuration(List<AssetRecordEntity> records)
        {
            double duration = 0;

            // 过滤掉“重复记录”:
            var sortedRecords = records.OrderBy(r => r.ReportTime).ToList();
            var filteredRecords = new List<AssetRecordEntity>();
            AssetRecordEntity? preRecord = null;
            foreach (var record in sortedRecords)
            {
                if (preRecord == null)
                {
                    if (record.OnlineState != OnlineStates.Offline)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
                else
                {
                    if (preRecord.OnlineState == record.OnlineState)
                    {
                        continue;
                    }
                    else
                    {
                        preRecord = record;
                        filteredRecords.Add(record);
                    }
                }
            }

            // 计算:
            AssetRecordEntity? offline = null;

            foreach (var record in filteredRecords)
            {
                if (record.OnlineState == OnlineStates.Offline)
                {
                    if (offline != null)
                    {
                        LogHelper.Instance.Warning("Repeated offline records!");
                        return -1;
                    }

                    offline = record;
                }
                else
                {
                    if (offline == null)
                    {
                        LogHelper.Instance.Warning("Online record without corresponding offline!");
                        return -1;
                    }

                    duration += (record.ReportTime - offline.ReportTime).TotalHours;
                    offline = null;
                }
            }

            if (offline != null)
            {
                duration += (DateTimeHelper.GetUtcNow() - offline.ReportTime).TotalHours;
            }

            return Math.Round(duration, 2, MidpointRounding.AwayFromZero);
        }
        #endregion

        #region 获取“周转次数”
        /// <summary>获取“周转次数”</summary>
        private int GetMoves(List<AssetRecordEntity> records, DateTime? start = null)
        {
            int moves = 0;

            if (start != null) records = records.Where(r => r.ReportTime > start).ToList();

            AssetRecordEntity? inbound = null;
            foreach (var record in records)
            {
                if (record.State == AssetStates.Inbound)
                {
                    if (inbound != null && inbound.Site == record.Site) continue;
                    inbound = record;
                    ++moves;
                }
                else if (record.State == AssetStates.Outbound)
                {
                    inbound = null;
                }
            }

            return moves;
        }
        #endregion
        #endregion [Private]

        #region [查]
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

        #region 获取“最新完整数据”
        /// <summary>获取“最新完整数据”</summary>
        public async Task<MyActionResult<AssetRecordDto>> GetFullLast(long asset)
        {
            try
            {
                var record = await _dbSet
                    .AsNoTracking()
                    .Where(i => i.Asset == asset)
                    .OrderByDescending(ar => ar.ReportTime)
                    .FirstOrDefaultAsync();
                if (record == null) return MyResults<AssetRecordDto>.Success();

                var dto = new AssetRecordDto();
                dto.ShallowCopy(record);

                if (record.Tag != null)
                {
                    var tag = await _db.Tags.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Tag);
                    if (tag != null)
                    {
                        LogHelper.Instance.IsNull(nameof(tag));
                        dto.TagId = tag.TagId;
                    }
                }

                if (record.Station != null)
                {
                    var station = await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Station);
                    if (station != null)
                    {
                        LogHelper.Instance.IsNull(nameof(station));
                        dto.StationId = station.MacAddr;
                    }
                }

                if (record.Site != null)
                {
                    var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Site);
                    if (site != null)
                    {
                        LogHelper.Instance.IsNull(nameof(site));
                        dto.SiteName = site.Name;
                        dto.Addr = site.Addr;
                        dto.AddrDetail = site.AddrDetail;
                    }
                }

                if (record.TargetSite != null)
                {
                    var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.TargetSite);
                    if (site != null)
                    {
                        LogHelper.Instance.IsNull(nameof(site));
                        dto.TargetSiteName = site.Name;
                        dto.TargetAddr = site.Addr;
                        dto.TargetAddrDetail = site.AddrDetail;
                    }
                }

                return MyResults<AssetRecordDto>.Success(null, dto);
            }
            catch (Exception e)
            {
                return MyResults<AssetRecordDto>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

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

                    if (record.Tag != null)
                    {
                        var tag = await _db.Tags.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Tag);
                        if (tag != null)
                        {
                            LogHelper.Instance.IsNull(nameof(tag));
                            dto.TagId = tag.TagId;
                        }
                    }

                    if (record.Station != null)
                    {
                        var station = await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == record.Station);
                        if (station == null)
                        {
                            LogHelper.Instance.IsNull(nameof(station));
                            continue;
                        }
                        dto.StationId = station.MacAddr;
                    }

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

        #region 获取“最新入库数据”
        /// <summary>获取“最新入库数据”</summary>
        public async Task<MyActionResult<AssetRecordEntity>> GetLastInbound(long asset)
        {
            try
            {
                var entity = await _dbSet
                    .AsNoTracking()
                    .Where(i => i.Asset == asset && i.State == AssetStates.Inbound)
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

        #region 获取“路径”
        /// <summary>获取“路径”</summary>
        public async Task<MyActionResult<List<AssetLngLat>>> GetPath(
            long asset,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = start != null && end != null
                    ? _dbSet.AsNoTracking().Where(i => i.Asset == asset
                    && i.Longitude != null && i.Longitude.Value > 0
                    && i.Latitude != null && i.Latitude.Value > 0
                    && i.ReportTime >= start && i.ReportTime <= end)
                    : _dbSet.AsNoTracking().Where(i => i.Asset == asset
                    && i.Longitude != null && i.Longitude.Value > 0
                    && i.Latitude != null && i.Latitude.Value > 0);

                if (locationMode != null)
                {
                    queryable = queryable.Where(i => i.LocationMode == locationMode);
                }

                var res = await GetFilter(queryable, filter);
                queryable = res.Data;
                if (queryable == null)
                {
                    return MyResults<List<AssetLngLat>>.Error(res.Message);
                }

                var resSort = queryable.Sort(nameof(AssetRecordEntity.ReportTime));
                queryable = resSort.Data;
                if (queryable == null)
                {
                    return MyResults<List<AssetLngLat>>.Error(resSort.Message);
                }

                var positions = await queryable
                    .Select(i => new AssetLngLat()
                    {
                        Site = i.Site,
                        Longitude = i.Longitude,
                        Latitude = i.Latitude,
                        Address = i.Address,
                        ReportTime = i.ReportTime,
                        LocationMode = i.LocationMode,
                    })
                    .ToListAsync();

                var useablePositions = new List<AssetLngLat>();

                AssetLngLat? pre = null;
                foreach (var position in positions)
                {
                    //if (pre != null && !IsMoved(pre, position)) continue;

                    SiteEntity? site = null;
                    if (string.IsNullOrEmpty(position.Address) && position.Site != null)
                    {
                        site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(s => s.Id == position.Site.Value);
                        if (site != null)
                        {
                            position.Address = site.FullAddr;
                        }
                    }

                    if ((position.Longitude == null || position.Latitude == null) && position.Site != null)
                    {
                        if (site == null) site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(s => s.Id == position.Site.Value);
                        if (site != null)
                        {
                            position.Longitude = site.Longitude;
                            position.Latitude = site.Latitude;
                        }
                    }

                    useablePositions.Add(position);
                    pre = position;
                }

                return MyResults<List<AssetLngLat>>.Success(null, useablePositions);
            }
            catch (Exception e)
            {
                return MyResults<List<AssetLngLat>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<AssetRecordEntity>> Add(AssetRecordEntity entity, bool isBeginTransaction = true)
        {
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
                    return resInit.Convert<AssetRecordEntity>();
                }

                // 添加数据:
                _dbSet.Add(entity);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务

                return MyResults<AssetRecordEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<AssetRecordEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<AssetRecordEntity> entities, bool isBeginTransaction = true)
        {
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
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<object>.OperationSuccess;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(AssetRecordEntity entity, bool isBeginTransaction = true)
        {
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

                return MyResults<object>.OperationSuccess;
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 修改“多条数据”
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange(List<AssetRecordEntity> entities, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (entities.Count < 1) return MyResults<object>.OperationSuccess;

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
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<object>.OperationSuccess;
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
                _editingTags.Add(newTag.Id, newTag); // 开始修改

                await PushTagDto.PushTagDtoAsync(newTag);

                #region 获取“基站”
                BaseStationEntity? oldStation = null;
                if (oldTag.Station != null)
                {
                    oldStation = await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(b => b.Id == oldTag.Station);
                    if (oldStation == null)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        LogHelper.Instance.IsNull(nameof(transaction));
                        return MyResults<object>.ResourceNotExist;
                    }
                }

                BaseStationEntity? newStation = null;
                if (newTag.Station != null)
                {
                    newStation = await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(b => b.Id == newTag.Station);
                    if (newStation == null)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        LogHelper.Instance.IsNull(nameof(transaction));
                        return MyResults<object>.ResourceNotExist;
                    }
                }
                #endregion

                #region 获取“资产”
                var asset = await _db.Assets.FirstOrDefaultAsync(i => i.Id == newTag.Asset);
                if (asset == null)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return MyResults<object>.Error(LogHelper.Instance.IsNull(nameof(asset)));
                }
                #endregion

                // 更新“资产状态”：
                asset.Copy(newTag);

                #region 获取“最新记录”
                var resLast = await GetLast(newTag.Asset.Value);
                if (resLast.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    LogHelper.Instance.Error(resLast.Message);
                    return MyResults<object>.Error(resLast.Message);
                }
                var lastRecord = resLast.Data;
                #endregion

                #region 若“无记录”，新增“入库记录”
                if (lastRecord == null)
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
                        return res.Convert<object>();
                    }

                    if (asset.IsAuto)
                    {
                        // 新增“在库记录”：
                        lastRecord.State = AssetStates.InStore;
                        lastRecord.ReportTime = lastRecord.ReportTime.AddSeconds(1);
                        var resInStore = await Add(lastRecord, false);
                        if (resInStore.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resInStore.Message);
                            return resInStore.Convert<object>();
                        }
                    }

                    await _db.SaveChangesAsync();
                    if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                    return MyResults<object>.OperationSuccess;
                }
                #endregion

                var newRecord = new AssetRecordEntity();
                newRecord.ShallowCopy(lastRecord);
                newRecord.ShallowCopy(newTag, [nameof(AssetRecordEntity.Id)]);

                if (oldStation?.Site != newStation?.Site) // 若“场地”改变，新增“入库记录”
                {
                    // 添加“场地”:
                    newRecord.Site = newStation?.Site;

                    #region 修改“盘点记录”
                    if (oldStation != null)
                    {
                        await _inventoryRecordService.ReduceAsset(oldStation.Site);
                    }

                    if (newStation != null)
                    {
                        await _inventoryRecordService.AddAsset(newStation.Site);
                    }
                    #endregion

                    #region 补“出库记录”
                    if (lastRecord.State != AssetStates.Outbound
                        && lastRecord.State != AssetStates.InTransit) // 无“出库记录”
                    {
                        MyActionResult<object> resOutbound;
                        lastRecord.State = AssetStates.Outbound;
                        lastRecord.TargetSite = newRecord.Site;

                        if ((lastRecord.State == AssetStates.InStore || lastRecord.State == AssetStates.Stolid)
                            && lastRecord.OnlineState == OnlineStates.Offline) // 若“在库”且“离线”
                        {
                            // 将“最新记录”改为“出库记录”：
                            resOutbound = await Edit(lastRecord, false);
                        }
                        else
                        {
                            // 新增“出库记录”：
                            lastRecord.ReportTime = lastRecord.ReportTime.AddSeconds(1);
                            resOutbound = (await Add(lastRecord, false)).Convert<object>();
                        }

                        if (resOutbound.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resOutbound.Message);
                            return resOutbound;
                        }
                    }
                    #endregion

                    #region 新增“在途记录”或“入库记录”
                    newRecord.TargetSite = null;
                    newRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();
                    newRecord.State = newTag.Station == null ? AssetStates.InTransit : AssetStates.Inbound;
                    var res = await Add(newRecord, false);
                    if (res.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        LogHelper.Instance.Error(res.Message);
                        return res.Convert<object>();
                    }
                    #endregion

                    #region 自动新增“在库记录”，并完成“调拨”
                    if (asset.IsAuto && newRecord.State == AssetStates.Inbound)
                    {
                        // 新增“在库记录”：
                        newRecord.State = AssetStates.InStore;
                        newRecord.ReportTime = newRecord.ReportTime.AddSeconds(1);
                        var resInStore = await Add(newRecord, false);
                        if (resInStore.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resInStore.Message);
                            return resInStore.Convert<object>();
                        }

                        // 完成“调拨”：
                        if (asset.Transfer != null)
                        {
                            var transfer = await _db.Transfers.FirstOrDefaultAsync(i => i.Id == asset.Transfer);
                            if (transfer == null)
                            {
                                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                                return MyResults<object>.Error(LogHelper.Instance.IsNull(nameof(transfer)));
                            }

                            if (transfer.Target == newRecord.Site)
                            {
                                asset.Transfer = null;
                                transfer.EndTime = DateTimeHelper.GetUtcNow();
                            }
                        }
                    }
                    #endregion
                }
                else // 同一场地
                {
                    #region 若“在库”，判断是否“滞留”
                    if (asset.Transfer != null && lastRecord.State == AssetStates.InStore)
                    {
                        var resLastInbound = await GetLastInbound(newTag.Asset.Value);
                        var lastInboundRecord = resLastInbound.Data;
                        if (lastInboundRecord == null)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(resLastInbound.Message);
                            return resLastInbound.Convert<object>();
                        }

                        newRecord.State = (DateTimeHelper.GetUtcNow() - lastInboundRecord.ReportTime).TotalHours
                            > GlobalSettings.StolidThresholdHours
                            ? AssetStates.Stolid : AssetStates.InStore;
                    }
                    #endregion

                    newRecord.ReportTime = newTag.ReportTime ?? DateTimeHelper.GetUtcNow();

                    if (oldTag.OnlineState != newTag.OnlineState) // “在线状态”改变
                    {
                        #region 若“出库”且“离线”，改为“在途记录”
                        if (lastRecord.State == AssetStates.Outbound
                            && newTag.OnlineState == OnlineStates.Offline)
                        {
                            newRecord.State = AssetStates.InTransit;
                        }
                        #endregion

                        // 新增记录:
                        var res = await Add(newRecord, false);
                        if (res.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(res.Message);
                            return res.Convert<object>();
                        }
                    }
                    else if (IsMoved(oldTag, newTag)) // 移动
                    {
                        // 新增记录:
                        var res = await Add(newRecord, false);
                        if (res.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            LogHelper.Instance.Error(res.Message);
                            return res.Convert<object>();
                        }
                    }
                }

                await Calculate(newTag.Id, false);
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                return MyResults<object>.OperationSuccess;
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(ex.GetMessage()));
            }
            finally
            {
                _editingTags.Remove(newTag.Id); // 结束修改
            }
        }
        #endregion

        #region 计算
        /// <summary>计算</summary>
        public async Task<MyActionResult<object>> Calculate(long id, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 检验“资源”是否存在:
                var find = await _db.Assets.FirstOrDefaultAsync(i => i.Id == id);
                if (find == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                var records = await _db.AssetRecords.Where(r => r.Asset == id).OrderByDescending(r => r.ReportTime).ToListAsync();
                var lastRecord = records.FirstOrDefault();
                find.LastRecord = lastRecord?.Id;

                // 更新“状态”:
                if (find.Tag != null)
                {
                    find.Copy(await _db.Tags.AsNoTracking().FirstOrDefaultAsync(i => i.Id == find.Tag));
                }
                else if (find.Station != null)
                {
                    find.Copy(await _db.BaseStations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == find.Station));
                }
                else
                {
                    find.IsFall = null;
                    find.OnlineState = OnlineStates.Offline;
                }

                // 是否滞留:
                if (find.Transfer != null && lastRecord != null && lastRecord.State == AssetStates.InStore)
                {
                    var lastInbound = records.LastOrDefault(r => r.State == AssetStates.Inbound);
                    if (lastInbound == null)
                    {
                        LogHelper.Instance.Warning("Inbound record not found for asset in store!");
                    }
                    else if ((DateTimeHelper.GetUtcNow() - lastInbound.ReportTime).TotalHours > GlobalSettings.StolidThresholdHours)
                    {
                        var stolid = new AssetRecordEntity();
                        stolid.ShallowCopy(lastRecord);
                        stolid.UpdateId();
                        stolid.ReportTime = DateTimeHelper.GetUtcNow();
                        find.State = stolid.State = AssetStates.Stolid;
                        await _db.AssetRecords.AddAsync(stolid);
                    }
                }

                // 是否超时:
                if (find.Transfer != null && lastRecord != null && lastRecord.State == AssetStates.InTransit)
                {
                    var lastOutbound = records.LastOrDefault(r => r.State == AssetStates.Outbound);
                    if (lastOutbound == null)
                    {
                        LogHelper.Instance.Warning("Outbound record not found for asset in transit!");
                    }
                    else if ((DateTimeHelper.GetUtcNow() - lastOutbound.ReportTime).TotalHours > GlobalSettings.TimeoutThresholdHours)
                    {
                        var timeout = new AssetRecordEntity();
                        timeout.ShallowCopy(lastRecord);
                        timeout.UpdateId();
                        timeout.ReportTime = DateTimeHelper.GetUtcNow();
                        find.State = timeout.State = AssetStates.Timeout;
                        await _db.AssetRecords.AddAsync(timeout);
                    }
                }

                // 计算“周转”:
                var now = DateTimeHelper.GetUtcNow();
                find.DailyMove = GetMoves(records, now.Date); // 当日0点
                find.MonthlyMove = GetMoves(records, new DateTime(now.Year, now.Month, 1)); // 当月1日0点
                find.TotalMove = GetMoves(records);

                // 计算“时长”:
                find.StayDuration = GetStayDuration(records);
                find.TravelDuration = GetTravelDuration(records);
                find.OfflineDuration = GetOfflineDuration(records);

                // 计算时间:
                find.CalculationTime = DateTimeHelper.GetUtcNow();

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<object>.OperationSuccess;
        }
        #endregion
        #endregion [Other]
        #endregion 【Functions】
    }
}
