using Microsoft.EntityFrameworkCore;
using System.Data;
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
    public class AssetService : IdServiceBase<AssetEntity>, IAssetService
    {
        #region 【Fields】
        private readonly ITagService _tagService;
        private readonly IDepartmentService _departmentService;
        private readonly IAssetRecordService _assetRecordService;
        private readonly IBindingRecordService _bindingRecordService;
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
            IAssetRecordService assetRecordService,
            IBindingRecordService bindingRecordService) : base(db, db.Assets)
        {
            _tagService = tagService;
            _departmentService = departmentService;
            _assetRecordService = assetRecordService;
            _bindingRecordService = bindingRecordService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 根据“RFID”获取“单条数据”
        /// <summary>根据“RFID”获取“单条数据”</summary>
        public async Task<MyActionResult<AssetEntity>> GetByRFID(string rfid)
        {
            try
            {
                var tag = await _db.Tags.AsNoTracking().FirstOrDefaultAsync(i => i.Rfid == rfid);
                if (tag == null)
                {
                    return MyResults<AssetEntity>.ResourceNotExist;
                }
                else if (tag.Asset == null)
                {
                    return MyResults<AssetEntity>.TagNotBoundAsset;
                }

                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == tag.Asset);
                if (entity == null)
                {
                    return MyResults<AssetEntity>.ResourceNotExist;
                }
                return MyResults<AssetEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<AssetEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“完整数据”
        /// <summary>获取“完整数据”</summary>
        public async Task<MyActionResult<AssetDto>> GetFull(
            List<long> companies,
            long? id = null,
            string? rfid = null)
        {
            if (id == null && rfid == null) return MyResults<AssetDto>.Success();

            AssetEntity? entity;

            if (id != null)
            {
                entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
            }
            else if (rfid != null)
            {
                var tag = await _db.Tags.AsNoTracking().FirstOrDefaultAsync(i => i.Rfid == rfid);
                if (tag == null) return MyResults<AssetDto>.ResourceNotExist;
                if (tag.Asset == null) return MyResults<AssetDto>.TagNotBoundAsset;
                entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == tag.Asset);
            }
            else
            {
                return MyResults<AssetDto>.Success();
            }

            var res = await GetFullList(1, 1, null, null, new FilterDto()
            {
                Parent = new ParentFilter()
                {
                    Parent = new ParentFilter()
                    {
                        Ids = companies,
                    }
                },
                Filters = entity != null ? [new PropFilter(nameof(AssetEntity.Id), entity.Id)] : null,
            });
            if (res.Data == null)
            {
                return MyResults<AssetDto>.Error(res.Message);
            }

            return MyResults<AssetDto>.Success(null, res.Data.FirstOrDefault());
        }
        #endregion

        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<AssetDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null)
        {
            try
            {
                var dtos = new List<AssetDto>();

                // 获取“实体”集合:
                var res = await base.GetList(pageSize, pageNumber, sort, ascending, filter);
                var entites = res.Data;
                if (entites == null)
                {
                    return MyResults<List<AssetDto>>.Error(res.Message);
                }

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

                    // 添加“记录企业信息”:
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

                    // 添加“标签信息”:
                    if (dto.Tag != null)
                    {
                        var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == dto.Tag.Value);
                        if (tag == null)
                        {
                            LogHelper.Instance.IsNull(nameof(tag));

                            var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                            if (find != null)
                            {
                                find.Tag = dto.Tag = null;
                                _db.SaveChanges();
                            }
                        }
                        else
                        {
                            dto.TagId = tag.TagId;
                            dto.Rfid = tag.Rfid;
                        }
                    }

                    // 添加“车辆信息”:
                    if (dto.Vehicle != null)
                    {
                        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(t => t.Id == dto.Vehicle.Value);
                        if (vehicle == null)
                        {
                            LogHelper.Instance.IsNull(nameof(vehicle));

                            var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                            if (find != null)
                            {
                                find.Vehicle = dto.Vehicle = null;
                                _db.SaveChanges();
                            }
                        }
                        else
                        {
                            dto.Plate = vehicle.Plate;
                        }
                    }

                    // 添加“调拨信息”:
                    if (dto.Transfer != null)
                    {
                        var transfer = await _db.Transfers.FirstOrDefaultAsync(t => t.Id == dto.Transfer.Value);
                        if (transfer == null)
                        {
                            LogHelper.Instance.IsNull(nameof(transfer));

                            var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                            if (find != null)
                            {
                                find.Transfer = dto.Transfer = null;
                                _db.SaveChanges();
                            }
                        }
                        else
                        {
                            dto.TransferCode = transfer.Code;
                        }
                    }

                    // 获取“最新记录”:
                    var resGetLast = await _assetRecordService.GetFullLast(entity.Id);
                    if (resGetLast.IsError)
                    {
                        LogHelper.Instance.Error(resGetLast.Message);
                        continue;
                    }
                    var lastRecord = resGetLast.Data;
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
                        || (DateTimeHelper.GetUtcNow() - dto.CalculationTime.Value).TotalSeconds > Constants.CalculationIntervalSeconds)
                        || lastRecord == null && dto.LastRecord != null)
                    {
                        dto.CalculationTime = DateTimeHelper.GetUtcNow();
                        var resCalculate = await _assetRecordService.Calculate(entity.Id, false);
                        if (resCalculate.IsError || resCalculate.Data == null)
                        {
                            LogHelper.Instance.Warning($"Calculation failed! (Id = {entity.Id})");
                            continue;
                        }

                        dto.ShallowCopy(resCalculate.Data);
                    }
                }

                return MyResults<List<AssetDto>>.Success(null, dtos);
            }
            catch (Exception e)
            {
                return MyResults<List<AssetDto>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“位置”
        /// <summary>获取“位置”</summary>
        public async Task<MyActionResult<AssetPosition>> GetPosition(long asset)
        {
            try
            {
                var find = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == asset);
                if (find == null)
                {
                    return MyResults<AssetPosition>.AssetNotExist;
                }

                var lastRecord = await _db.AssetRecords.AsNoTracking()
                    .OrderByDescending(i => i.ReportTime)
                    .FirstOrDefaultAsync(i => i.Asset == asset && i.Longitude > 0 && i.Latitude > 0);
                if (lastRecord == null) return MyResults<AssetPosition>.Success();

                return MyResults<AssetPosition>.Success(null, new AssetPosition()
                {
                    Id = find.Id,
                    AssetId = find.AssetId,
                    LastRecord = find.LastRecord,
                    Longitude = lastRecord.Longitude,
                    Latitude = lastRecord.Latitude,
                    ReportTime = lastRecord.ReportTime,
                    LocationMode = lastRecord.LocationMode,
                });
            }
            catch (Exception e)
            {
                return MyResults<AssetPosition>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“位置”集合
        /// <summary>获取“位置”集合</summary>
        public async Task<MyActionResult<List<AssetPosition>>> GetPositionList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                var res = await GetFilter(queryable, filter);
                queryable = res.Data;
                if (queryable == null)
                {
                    return MyResults<List<AssetPosition>>.Error(res.Message);
                }

                var resSort = queryable.Sort(sort, ascending);
                queryable = resSort.Data;
                if (queryable == null)
                {
                    return MyResults<List<AssetPosition>>.Error(resSort.Message);
                }

                var assets = await queryable
                    .GetPage(pageSize, pageNumber)
                    .Select(i => i.Id)
                    .ToListAsync();

                var positions = new List<AssetPosition>();

                foreach (var asset in assets)
                {
                    var resPosition = await GetPosition(asset);
                    var position = resPosition.Data;
                    if (position == null) continue;
                    positions.Add(position);
                }

                return MyResults<List<AssetPosition>>.Success(null, positions);
            }
            catch (Exception e)
            {
                return MyResults<List<AssetPosition>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult<AssetEntity>> Add(AssetDto dto, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                TagDto? tag = null;

                if (!string.IsNullOrEmpty(dto.TagId))
                {
                    dto.BindingTime = DateTimeHelper.GetUtcNow();

                    // 修改“标签ID”:
                    var resGetFull = await _tagService.GetFullByTagId(dto.TagId);
                    tag = resGetFull.Data;
                    if (tag == null)
                    {
                        return MyResults<AssetEntity>.TagNotFound(dto.TagId);
                    }
                    // 绑定“标签”:
                    dto.Tag = tag.Id;
                    dto.TagType = tag.Type;

                    // 检验“标签”是否重复:
                    if (dto.Tag != null && await _dbSet.AnyAsync(i => i.Tag == dto.Tag))
                    {
                        return MyResults<AssetEntity>.TagRepeated;
                    }
                }

                var res = await base.Add(dto, false);
                var asset = res.Data;
                if (asset == null)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return res;
                }

                if (tag != null)
                {
                    // “标签”绑定“资产”:
                    tag.Asset = asset.Id;
                    tag.AssetId = dto.AssetId;
                    var resTag = await _tagService.Edit(tag, false);
                    if (resTag.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<AssetEntity>.Error(resTag.Message);
                    }

                    var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, true, dto.BindingTime), false);
                    if (resAdd.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<AssetEntity>.Error(resAdd.Message);
                    }
                }

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务

                return res;
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<AssetEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
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
                        dto.BindingTime = DateTimeHelper.GetUtcNow();

                        // 修改“标签ID”:
                        var resGetFull = await _tagService.GetFullByTagId(dto.TagId);
                        if (resGetFull.Data == null)
                        {
                            return MyResults<object>.TagNotFound(dto.TagId);
                        }
                        var tag = resGetFull.Data;
                        // 绑定“标签”:
                        dto.Tag = tag.Id;
                        dto.TagType = tag.Type;

                        // “标签”绑定“资产”:
                        tag.Asset = dto.Id;
                        tag.AssetId = dto.AssetId;
                        var resTag = await _tagService.Edit(tag, false);
                        if (resTag.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resTag.Message);
                        }

                        var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, true, dto.BindingTime), false);
                        if (resAdd.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resAdd.Message);
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

                res = await base.AddRange(entities, false);

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
                        var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == find.Tag.Value);
                        if (tag != null)
                        {
                            tag.Asset = null;
                            tag.AssetId = null;
                            var resTag = await _tagService.Edit(tag, false);
                            if (resTag.IsError)
                            {
                                return MyResults<object>.Error(resTag.Message);
                            }

                            var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, false, null), false);
                            if (resAdd.IsError)
                            {
                                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                                return MyResults<object>.Error(resAdd.Message);
                            }
                        }
                    }

                    dto.Tag = null;
                    dto.TagType = null;
                    dto.BindingTime = null;
                }
                else
                {
                    if (find.Tag != dto.Tag)
                    {
                        dto.BindingTime = DateTimeHelper.GetUtcNow();
                    }

                    var resGetFull = await _tagService.GetFullByTagId(dto.TagId);
                    if (resGetFull.IsError)
                    {
                        return MyResults<object>.Error(resGetFull.Message);
                    }
                    var tag = resGetFull.Data;
                    if (tag == null)
                    {
                        return MyResults<object>.TagNotFound(dto.TagId);
                    }

                    // 绑定“标签”:
                    dto.Tag = tag.Id;
                    dto.TagType = tag.Type;

                    // “标签”绑定“资产”:
                    tag.Asset = dto.Id;
                    tag.AssetId = dto.AssetId;
                    var resTag = await _tagService.Edit(tag, false);
                    if (resTag.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.Error(resTag.Message);
                    }

                    var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, true, dto.BindingTime), false);
                    if (resAdd.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.Error(resAdd.Message);
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
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
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
                    // 检验“资源”是否存在:
                    var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == dto.Id);
                    if (find == null)
                    {
                        return MyResults<object>.ResourceNotExist;
                    }

                    // 修改“标签ID”:
                    if (string.IsNullOrEmpty(dto.TagId))
                    {
                        if (dto.Tag != null)
                        {
                            // “标签”解绑“资产”:
                            var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == dto.Tag.Value);
                            if (tag != null)
                            {
                                tag.Asset = null;
                                tag.AssetId = null;
                                var resTag = await _tagService.Edit(tag, false);
                                if (resTag.IsError)
                                {
                                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                                    return MyResults<object>.Error(resTag.Message);
                                }

                                var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, false, null), false);
                                if (resAdd.IsError)
                                {
                                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                                    return MyResults<object>.Error(resAdd.Message);
                                }
                            }
                        }

                        dto.Tag = null;
                        dto.TagType = null;
                        dto.BindingTime = null;
                    }
                    else
                    {
                        if (find.Tag != dto.Tag)
                        {
                            dto.BindingTime = DateTimeHelper.GetUtcNow();
                        }

                        var resGetFull = await _tagService.GetFullByTagId(dto.TagId);
                        var tag = resGetFull.Data;
                        if (resGetFull.IsError)
                        {
                            return MyResults<object>.Error(resGetFull.Message);
                        }
                        if (tag == null)
                        {
                            return MyResults<object>.TagNotFound(dto.TagId);
                        }

                        // 绑定“标签”:
                        dto.Tag = tag.Id;
                        dto.TagType = tag.Type;

                        // “标签”绑定“资产”:
                        tag.Asset = dto.Id;
                        tag.AssetId = dto.AssetId;
                        var resTag = await _tagService.Edit(tag, false);
                        if (resTag.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resTag.Message);
                        }

                        var resAdd = await _bindingRecordService.Add(new BindingRecordEntity(tag.Id, dto.Id, true, dto.BindingTime), false);
                        if (resAdd.IsError)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(resAdd.Message);
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
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public override async Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                var entity = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);
                if (entity == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                // 资产记录：
                await _db.AssetRecords.Where(i => i.Asset == entity.Tag).ExecuteDeleteAsync();
                // 绑定记录：
                await _db.BindingRecords.Where(i => i.Asset == entity.Tag).ExecuteDeleteAsync();
                // 解绑：
                if (entity.Tag != null)
                {
                    var tag = await _db.Tags.FirstOrDefaultAsync(i => i.Id == entity.Tag);
                    if (tag == null)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return MyResults<object>.TagNotFound(entity.Tag.ToString() ?? "");
                    }
                    tag.Asset = null;
                    tag.AssetId = null;
                }

                _dbSet.Remove(entity);
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

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public override async Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (ids.Count < 1) return res;

                var entities = await _dbSet.Where(i => ids.Contains(i.Id)).ToListAsync();

                var count = entities.Count;
                if (count < 1)
                    return MyResults<object>.ResourceNotExist;
                else if (count < ids.Count)
                    return MyResults<object>.SomeResourceNotExist;

                // 资产记录：
                await _db.AssetRecords.Where(i => ids.Contains(i.Asset)).ExecuteDeleteAsync();
                // 绑定记录：
                await _db.BindingRecords.Where(i => ids.Contains(i.Asset)).ExecuteDeleteAsync();
                // 解绑：
                foreach (var entity in entities)
                {
                    if (entity.Tag != null)
                    {
                        var tag = await _db.Tags.FirstOrDefaultAsync(i => i.Id == entity.Tag);
                        if (tag == null)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.TagNotFound(entity.Tag.ToString() ?? "");
                        }
                        tag.Asset = null;
                        tag.AssetId = null;
                    }
                }

                _dbSet.RemoveRange(entities);
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
        #endregion [删]

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
                    var resGetLast = await _assetRecordService.GetLast(entity.Id);
                    if (resGetLast.IsError)
                    {
                        return MyResults<object>.Error(resGetLast.Message);
                    }

                    var lastRecord = resGetLast.Data;
                    if (lastRecord == null)
                    {
                        return MyResults<object>.NoAssetRecord(entity.AssetId);
                    }
                    else if (lastRecord.State != AssetStates.Inbound)
                    {
                        return MyResults<object>.NotInbound(entity.AssetId);
                    }

                    // 新增“入库记录”：
                    var inStore = new AssetRecordEntity();
                    inStore.ShallowCopy(lastRecord);
                    inStore.UpdateId();
                    inStore.State = AssetStates.InStore;
                    inStore.ReportTime = DateTimeHelper.GetUtcNow();
                    await _db.AssetRecords.AddAsync(inStore);

                    // 完成“调拨”：
                    if (entity.Transfer != null)
                    {
                        var transfer = await _db.Transfers.FirstOrDefaultAsync(i => i.Id == entity.Transfer);
                        if (transfer == null)
                        {
                            if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                            return MyResults<object>.Error(LogHelper.Instance.IsNull(nameof(transfer)));
                        }

                        if (transfer.Target == inStore.Site)
                        {
                            entity.Transfer = null;
                            transfer.EndTime = DateTimeHelper.GetUtcNow();
                        }
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
                    var resGetLast = await _assetRecordService.GetLast(entity.Id);
                    if (resGetLast.IsError)
                    {
                        return MyResults<object>.Error(resGetLast.Message);
                    }

                    var lastRecord = resGetLast.Data;
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
                    inTransit.ReportTime = DateTimeHelper.GetUtcNow();
                    inTransit.TargetSite = site;
                    await _db.AssetRecords.AddAsync(inTransit);
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
        #endregion [Other]
        #endregion 【Functions】
    }
}
