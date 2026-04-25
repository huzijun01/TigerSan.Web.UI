using Microsoft.EntityFrameworkCore;
using System.Data;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AssetService : IdServiceBase<AssetEntity>, IAssetService
    {
        #region 【Fields】
        private readonly ITagService _tagService;
        private readonly IDepartmentService _departmentService;
        private readonly IAssetRecordService _assetRecordService;
        #endregion 【Fields】

        #region 【Ctor】
        static AssetService()
        {
            SetDbSetConfig(nameof(AssetEntity.Department))
                .SetParent(typeof(DepartmentEntity), nameof(_db.Departments), nameof(DepartmentEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public AssetService(
            AppDbContext db,
            ITagService tagService,
            IDepartmentService departmentService,
            IAssetRecordService assetRecordService) : base(db, db.Assets)
        {
            _tagService = tagService;
            _departmentService = departmentService;
            _assetRecordService = assetRecordService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [Private]
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
                duration += (DateTime.Now - inbound.ReportTime).TotalHours;
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
                duration += (DateTime.Now - outbound.ReportTime).TotalHours;
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
                duration += (DateTime.Now - offline.ReportTime).TotalHours;
            }

            return Math.Round(duration, 2, MidpointRounding.AwayFromZero);
        }
        #endregion
        #endregion [Private]

        #region [查]
        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<List<AssetDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null)
        {
            try
            {
                var dtos = new List<AssetDto>();

                // 获取“实体”集合:
                var queryable = _dbSet.AsNoTracking();
                queryable = await GetFilter(queryable, filter);
                var entites = await queryable.GetPage(pageSize, pageNumber).ToListAsync();

                // 添加“其它数据”:
                var departmentIds = entites.Select(e => e.Department).Distinct().ToList();
                var departmentInfoDic = await _departmentService.GetDepartmentInfoDict(departmentIds);
                var types = await _db.AssetTypes.AsNoTracking().ToListAsync();
                var siteNameDict = new Dictionary<long, string>();

                foreach (var entity in entites)
                {
                    var dto = new AssetDto();
                    dtos.Add(dto);
                    dto.ShallowCopy(entity);

                    // 添加“部门企业信息”:
                    var departmentInfo = departmentInfoDic.GetValueOrDefault(entity.Department);
                    if (departmentInfo == null)
                    {
                        LogHelper.Instance.IsNull(nameof(departmentInfo));
                    }
                    else
                    {
                        dto.DepartmentName = departmentInfo.DepartmentName;
                        dto.Company = departmentInfo.Company;
                        dto.CompanyName = departmentInfo.CompanyName;
                    }

                    // 添加“类型名”:
                    var type = types.FirstOrDefault(t => t.Id == entity.Type);
                    if (type == null)
                    {
                        LogHelper.Instance.IsNull(nameof(type));
                    }
                    else
                    {
                        dto.TypeName = type.Name;
                    }

                    if (dto.Tag != null)
                    {
                        var tag = await _tagService.Get(dto.Tag.Value);
                        if (tag == null)
                        {
                            LogHelper.Instance.IsNull(nameof(tag));
                        }
                        else
                        {
                            dto.TagId = tag.TagId;
                        }
                    }

                    // 获取“最新记录”:
                    var lastRecord = await _assetRecordService.GetLast(entity.Id);
                    if (lastRecord != null)
                    {
                        var id = entity.Id;
                        dto.ShallowCopy(lastRecord);
                        dto.Id = id;
                        dto.LastRecord = lastRecord.Id;

                        // 添加“场地名”:
                        if (dto.Site != null)
                        {
                            var siteName = siteNameDict.GetValueOrDefault(dto.Site.Value);
                            if (siteName == null)
                            {
                                var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(s => s.Id == dto.Site.Value);
                                if (site == null)
                                {
                                    LogHelper.Instance.IsNull(nameof(site));
                                }
                                else
                                {
                                    siteName = siteNameDict[dto.Site.Value] = site.Name;
                                }
                            }

                            dto.SiteName = siteName;
                        }
                    }

                    // 重新计算:
                    if (lastRecord != null &&
                        (dto.LastRecord == null
                        || dto.CalculationTime == null
                        || dto.LastRecord != lastRecord.Id
                        || (DateTime.Now - dto.CalculationTime.Value).TotalSeconds > Constants.Calculation_Interval_Seconds)
                        || lastRecord == null && dto.LastRecord != null)
                    {
                        dto.CalculationTime = DateTime.Now;
                        var res = await Calculate(entity.Id, false);
                        if (res.IsError || res.Data == null)
                        {
                            LogHelper.Instance.Warning($"Calculation failed! (Id = {entity.Id})");
                            continue;
                        }

                        dto.ShallowCopy(res.Data);
                    }
                }

                return dtos;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<AssetDto>();
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult<object>> Add(AssetDto dto, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (!string.IsNullOrEmpty(dto.TagId))
                {
                    dto.BindingTime = DateTime.Now;

                    // 修改“标签ID”:
                    var tag = await _tagService.GetFull(dto.TagId, dto.Company);
                    if (tag == null)
                    {
                        return MyResults<object>.TagNotFound(dto.TagId);
                    }
                    // 绑定“标签”:
                    dto.Tag = tag.Id;

                    // 检验“标签”是否重复:
                    if (dto.Tag != null && await _dbSet.AnyAsync(i => i.Tag == dto.Tag))
                    {
                        return MyResults<object>.TagRepeated;
                    }

                    // “标签”绑定“资产”:
                    tag.Asset = dto.Id;
                    tag.BrandId = dto.AssetId;
                    var resTag = await _tagService.Edit(tag, false);
                    if (resTag.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.Error(resTag.Message);
                    }
                }

                res = await base.Add(dto, isBeginTransaction);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult<object>> AddRange(List<AssetDto> dtos, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 转为“实体”:
                var entities = new List<AssetEntity>();
                foreach (var dto in dtos)
                {
                    if (!string.IsNullOrEmpty(dto.TagId))
                    {
                        dto.BindingTime = DateTime.Now;

                        // 修改“标签ID”:
                        var tag = await _tagService.GetFull(dto.TagId, dto.Company);
                        if (tag == null)
                        {
                            return MyResults<object>.TagNotFound(dto.TagId);
                        }
                        // 绑定“标签”:
                        dto.Tag = tag.Id;

                        // “标签”绑定“资产”:
                        tag.Asset = dto.Id;
                        tag.BrandId = dto.AssetId;
                        var resTag = await _tagService.Edit(tag, false);
                        if (resTag.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resTag.Message);
                        }
                    }

                    var entity = new AssetEntity();
                    entity.ShallowCopy(dto);
                    entities.Add(entity);
                }

                // 检验“标签”是否重复:
                var tags = entities.Where(e => e.Tag != null).Select(e => e.Tag).ToList();
                if (await _dbSet.AnyAsync(i => tags.Contains(i.Tag)))
                {
                    return MyResults<object>.TagRepeated;
                }

                res = await base.AddRange(entities, isBeginTransaction);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult<object>> Edit(AssetDto dto, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 检验“资源”是否存在:
                var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == dto.Id);
                if (find == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                // 修改“标签ID”:
                if (string.IsNullOrEmpty(dto.TagId))
                {
                    if (find.Tag != null)
                    {
                        // “标签”解绑“资产”:
                        var tag = await _tagService.Get(find.Tag.Value);
                        if (tag != null)
                        {
                            tag.Asset = null;
                            tag.BrandId = null;
                            var resTag = await _tagService.Edit(tag, false);
                            if (resTag.IsError)
                            {
                                return MyResults<object>.Error(resTag.Message);
                            }
                        }
                    }

                    dto.Tag = null;
                    dto.BindingTime = null;
                }
                else
                {
                    dto.BindingTime = DateTime.Now;

                    var tag = await _tagService.GetFull(dto.TagId, dto.Company);
                    if (tag == null)
                    {
                        return MyResults<object>.TagNotFound(dto.TagId);
                    }

                    // 绑定“标签”:
                    dto.Tag = tag.Id;

                    // “标签”绑定“资产”:
                    tag.Asset = dto.Id;
                    tag.BrandId = dto.AssetId;
                    var resTag = await _tagService.Edit(tag, false);
                    if (resTag.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.Error(resTag.Message);
                    }
                }

                // 检验“标签”是否重复:
                if (dto.Tag != null && await _dbSet.AnyAsync(i => i.Tag == dto.Tag && i.Id != dto.Id))
                {
                    return MyResults<object>.TagRepeated;
                }

                // 修改“数据”:
                find.ShallowCopy(dto);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 修改“多条数据”
        /// <summary>修改“多条数据”</summary>
        public async Task<MyActionResult<object>> EditRange(List<AssetDto> dtos, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 转为“实体”:
                var entities = new List<AssetEntity>();
                foreach (var dto in dtos)
                {
                    // 修改“标签ID”:
                    if (string.IsNullOrEmpty(dto.TagId))
                    {
                        if (dto.Tag != null)
                        {
                            // “标签”解绑“资产”:
                            var tag = await _tagService.Get(dto.Tag.Value);
                            if (tag != null)
                            {
                                tag.Asset = null;
                                tag.BrandId = null;
                                var resTag = await _tagService.Edit(tag, false);
                                if (resTag.IsError)
                                {
                                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                                    return MyResults<object>.Error(resTag.Message);
                                }
                            }
                        }

                        dto.Tag = null;
                        dto.BindingTime = null;
                    }
                    else
                    {
                        dto.BindingTime = DateTime.Now;

                        var tag = await _tagService.GetFull(dto.TagId, dto.Company);
                        if (tag == null)
                        {
                            return MyResults<object>.TagNotFound(dto.TagId);
                        }

                        // 绑定“标签”:
                        dto.Tag = tag.Id;

                        // “标签”绑定“资产”:
                        tag.Asset = dto.Id;
                        tag.BrandId = dto.AssetId;
                        var resTag = await _tagService.Edit(tag, false);
                        if (resTag.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resTag.Message);
                        }
                    }

                    var entity = new AssetEntity();
                    entity.ShallowCopy(dto);
                    entities.Add(entity);
                }

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

                foreach (var find in finds)
                {
                    var entity = entities.FirstOrDefault(i => i.Id == find.Id);
                    if (entity == null)
                    {
                        return MyResults<object>.SomeResourceNotExist;
                    }

                    // 检验“标签”是否重复:
                    if (entity.Tag != null && await _dbSet.AnyAsync(i => i.Tag == entity.Tag && i.Id != entity.Id))
                    {
                        return MyResults<object>.TagRepeated;
                    }

                    // 修改“数据”:
                    find.ShallowCopy(entity);
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 计算
        /// <summary>计算</summary>
        public async Task<MyActionResult<AssetEntity>> Calculate(long id, bool isBeginTransaction = true)
        {
            var res = MyResults<AssetEntity>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 检验“资源”是否存在:
                var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);
                if (find == null)
                {
                    return MyResults<AssetEntity>.ResourceNotExist;
                }
                res.Data = find;

                var records = await _db.AssetRecords.Where(r => r.Asset == id).OrderByDescending(r => r.ReportTime).ToListAsync();
                var lastRecord = records.FirstOrDefault();

                // 设置“状态”:
                find.LastRecord = lastRecord?.Id;
                find.State = lastRecord?.State ?? AssetStates.NoRecord;

                // 是否滞留:
                if (lastRecord != null && lastRecord.State == AssetStates.InStore)
                {
                    var lastInbound = records.LastOrDefault(r => r.State == AssetStates.Inbound);
                    if (lastInbound == null)
                    {
                        LogHelper.Instance.Warning("Inbound record not found for asset in store!");
                    }
                    else if ((DateTime.Now - lastInbound.ReportTime).TotalHours > Constants.Stolid_Threshold_Hours)
                    {
                        var stolid = new AssetRecordEntity();
                        stolid.ShallowCopy(lastRecord);
                        stolid.UpdateId();
                        stolid.ReportTime = DateTime.Now;
                        find.State = stolid.State = AssetStates.Stolid;
                        await _db.AssetRecords.AddAsync(stolid);
                    }
                }

                // 计算“周转”:
                var now = DateTime.Now;
                var todayStart = now.Date; // 当日0点
                var monthStart = new DateTime(now.Year, now.Month, 1); // 当月1日0点
                find.DailyMove = records.Count(r => r.ReportTime > todayStart && r.State == AssetStates.InTransit);
                find.MonthlyMove = records.Count(r => r.ReportTime > monthStart && r.State == AssetStates.InTransit);
                find.TotalMove = records.Count(r => r.State == AssetStates.InTransit);

                // 计算“时长”:
                find.StayDuration = GetStayDuration(records);
                find.TravelDuration = GetTravelDuration(records);
                find.OfflineDuration = GetOfflineDuration(records);

                // 计算时间:
                find.CalculationTime = DateTime.Now;

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<AssetEntity>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [Other]
        #region 入库
        /// <summary>入库</summary>
        public async Task<MyActionResult<object>> Inbound(List<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (ids.Count < 1) return res;

                var entities = await _dbSet.Where(i => ids.Contains(i.Id)).ToListAsync();

                var count = entities.Count;
                if (count < 1)
                {
                    return MyResults<object>.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    return MyResults<object>.SomeResourceNotExist;
                }

                foreach (var entity in entities)
                {
                    var lastRecord = await _assetRecordService.GetLast(entity.Id);
                    if (lastRecord == null)
                    {
                        return MyResults<object>.NoAssetRecord(entity.AssetId);
                    }
                    else if (lastRecord.State != AssetStates.Inbound)
                    {
                        return MyResults<object>.NotInbound(entity.AssetId);
                    }

                    var inStore = new AssetRecordEntity();
                    inStore.ShallowCopy(lastRecord);
                    inStore.UpdateId();
                    inStore.State = AssetStates.InStore;
                    inStore.ReportTime = DateTime.Now;
                    await _db.AssetRecords.AddAsync(inStore);
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 出库
        /// <summary>出库</summary>
        public async Task<MyActionResult<object>> Outbound(long site, List<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (!_db.Sites.AsNoTracking().Any(s => s.Id == site))
                {
                    return MyResults<object>.SiteNotExist;
                }

                if (ids.Count < 1) return res;

                var entities = await _dbSet.Where(i => ids.Contains(i.Id)).ToListAsync();

                var count = entities.Count;
                if (count < 1)
                {
                    return MyResults<object>.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    return MyResults<object>.SomeResourceNotExist;
                }

                foreach (var entity in entities)
                {
                    var lastRecord = await _assetRecordService.GetLast(entity.Id);
                    if (lastRecord == null)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.NoAssetRecord(entity.AssetId);
                    }
                    else if (lastRecord.State != AssetStates.InStore && lastRecord.State != AssetStates.Stolid)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.NotInStoreOrStolid(entity.AssetId);
                    }
                    else if (lastRecord.Site == site)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.TargetSiteSameAsCurrent(entity.AssetId);
                    }

                    var inTransit = new AssetRecordEntity();
                    inTransit.ShallowCopy(lastRecord);
                    inTransit.UpdateId();
                    inTransit.State = AssetStates.Outbound;
                    inTransit.ReportTime = DateTime.Now;
                    inTransit.TargetSite = site;
                    await _db.AssetRecords.AddAsync(inTransit);
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [Other]
        #endregion 【Functions】
    }
}
