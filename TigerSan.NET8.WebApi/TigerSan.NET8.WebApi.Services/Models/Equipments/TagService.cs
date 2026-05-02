using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class TagService : IdServiceBase<TagEntity>, ITagService
    {
        #region 【Fields】
        private readonly IBatchService _batchService;
        private readonly IBaseStationService _baseStationService;
        #endregion 【Fields】

        #region 【Ctor】
        static TagService()
        {
            SetDbSetConfig(nameof(TagEntity.Batch))
                .SetParent(typeof(BatchEntity), nameof(_db.Batches), nameof(BatchEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public TagService(AppDbContext db, IBatchService batchService, IBaseStationService baseStationService) : base(db, db.Tags)
        {
            _batchService = batchService;
            _baseStationService = baseStationService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“单条数据”
        /// <summary>获取“单条数据”</summary>
        public async Task<MyActionResult<TagEntity>> Get(string tagId)
        {
            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.TagId == tagId);
                if (entity == null)
                {
                    return MyResults<TagEntity>.Error("Tag not found!");
                }
                return MyResults<TagEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<TagEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“单条完整数据”
        /// <summary>获取“单条完整数据”</summary>
        public async Task<MyActionResult<TagDto>> GetFull(string tagId)
        {
            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.TagId == tagId);
                if (entity == null)
                {
                    return MyResults<TagDto>.Error("Tag not found!");
                }

                var dto = new TagDto();
                dto.ShallowCopy(entity);

                // 添加“公司”:
                var resGetCompany = await _batchService.GetCompany(entity.Batch);
                var company = resGetCompany.Data;
                if (company == null)
                {
                    LogHelper.Instance.IsNull(nameof(company));
                    return MyResults<TagDto>.Error("Company not found!");
                }
                else
                {
                    dto.Company = company.Id;
                    dto.CompanyName = company.Name;
                }

                // 添加“场地”:
                if (entity.Station != null)
                {
                    var resGetSite = await _baseStationService.GetSite(entity.Station.Value);
                    var site = resGetSite.Data;
                    if (site == null)
                    {
                        LogHelper.Instance.IsNull(nameof(site));
                        return MyResults<TagDto>.Error("Site not found!");
                    }
                    else
                    {
                        dto.Site = site.Id;
                        dto.SiteName = site.Name;
                    }
                }

                return MyResults<TagDto>.Success(null, dto);
            }
            catch (Exception e)
            {
                return MyResults<TagDto>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“完整数据”集合（根据ID列表）
        /// <summary>获取“完整数据”集合（根据ID列表）</summary>
        public async Task<MyActionResult<List<TagDto>>> GetFullList(List<long> ids)
        {
            try
            {
                var list = new List<TagDto>();

                // 获取“数据”集合:
                var resGetList = await GetList(ids);
                if (resGetList.Data == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetList.Message);
                }
                var tags = resGetList.Data;

                // 获取“批次”ID列表:
                var batchIds = tags.Select(i => i.Batch).Distinct().ToList();

                // 获取“公司”字典:
                var resGetCompanyDict = await _batchService.GetCompanyDict(batchIds);
                if (resGetCompanyDict.Data == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetCompanyDict.Message);
                }
                var companyDict = resGetCompanyDict.Data;

                // 获取“场地”字典:
                List<long> stationIds = tags.Where(i => i.Station != null).Select(i => i.Station ?? 0).Distinct().ToList();
                var resGetSiteDict = await _baseStationService.GetSiteDict(stationIds);
                if (resGetSiteDict.Data == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetSiteDict.Message);
                }
                var siteDict = resGetSiteDict.Data;

                // 添加“数据”:
                foreach (var station in tags)
                {
                    var entity = new TagDto();
                    entity.ShallowCopy(station);

                    // 添加“公司”:
                    companyDict.TryGetValue(station.Batch, out var company);
                    if (company == null)
                    {
                        LogHelper.Instance.IsNull(nameof(company));
                    }
                    else
                    {
                        entity.Company = company.Id;
                        entity.CompanyName = company.Name;
                    }

                    // 添加“场地”:
                    if (station.Station != null)
                    {
                        siteDict.TryGetValue(station.Station.Value, out var site);
                        if (site == null)
                        {
                            LogHelper.Instance.IsNull(nameof(site));
                        }
                        else
                        {
                            entity.Site = site.Id;
                            entity.SiteName = site.Name;
                        }
                    }

                    list.Add(entity);
                }

                return MyResults<List<TagDto>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<TagDto>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<TagDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null)
        {
            try
            {
                var list = new List<TagDto>();

                // 获取“数据”集合:
                var resGetList = await GetList(pageSize, pageNumber, sort, ascending, filter);
                var tags = resGetList.Data;
                if (tags == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetList.Message);
                }

                // 获取“批次”ID列表:
                var batchIds = tags.Select(i => i.Batch).Distinct().ToList();

                // 获取“公司”字典:
                var resGetCompanyDict = await _batchService.GetCompanyDict(batchIds);
                if (resGetCompanyDict.Data == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetCompanyDict.Message);
                }
                var companyDict = resGetCompanyDict.Data;

                // 获取“场地”字典:
                List<long> stationIds = tags.Where(i => i.Station != null).Select(i => i.Station ?? 0).Distinct().ToList();
                var resGetSiteDict = await _baseStationService.GetSiteDict(stationIds);
                if (resGetSiteDict.Data == null)
                {
                    return MyResults<List<TagDto>>.Error(resGetSiteDict.Message);
                }
                var siteDict = resGetSiteDict.Data;

                // 添加“数据”:
                foreach (var station in tags)
                {
                    var entity = new TagDto();
                    entity.ShallowCopy(station);

                    // 添加“公司”:
                    companyDict.TryGetValue(station.Batch, out var company);
                    if (company == null)
                    {
                        LogHelper.Instance.IsNull(nameof(company));
                    }
                    else
                    {
                        entity.Company = company.Id;
                        entity.CompanyName = company.Name;
                    }

                    // 添加“场地”:
                    if (station.Station != null)
                    {
                        siteDict.TryGetValue(station.Station.Value, out var site);
                        if (site == null)
                        {
                            LogHelper.Instance.IsNull(nameof(site));
                        }
                        else
                        {
                            entity.Site = site.Id;
                            entity.SiteName = site.Name;
                        }
                    }

                    list.Add(entity);
                }

                return MyResults<List<TagDto>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<TagDto>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“完整数据”集合（tagId、company）
        /// <summary>获取“完整数据”集合（tagId、company）</summary>
        public async Task<MyActionResult<List<TagDto>>> GetFullList1(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            string? tagId = null,
            long? company = null)
        {
            return await GetFullList(pageSize, pageNumber, sort, ascending, new FilterDto()
            {
                Parent = new ParentFilter()
                {
                    Parent = new ParentFilter()
                    {
                        Id = company,
                    }
                },
                Filters = [new PropFilter() { PropName = nameof(TagEntity.TagId), Value = tagId }],
            });
        }
        #endregion

        #region 获取“完整数据”
        /// <summary>获取“完整数据”</summary>
        public async Task<MyActionResult<TagDto>> GetFull(
            string? tagId = null,
            long? company = null)
        {
            var res = await GetFullList1(1, 1, null, null, tagId, company);
            if (res.Data == null)
            {
                return MyResults<TagDto>.Error(res.Message);
            }
            return MyResults<TagDto>.Success(null, res.Data.FirstOrDefault());
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(TagEntity entity, bool isBeginTransaction = true)
        {
            // 检验“标牌ID”是否重复:
            if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId))
            {
                return MyResults<object>.BrandIdRepeated;
            }

            return await base.Add(entity, isBeginTransaction);
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<TagEntity> entities, bool isBeginTransaction = true)
        {
            // 检验“标牌ID”是否重复:
            var names = entities.Where(e => !string.IsNullOrEmpty(e.BrandId)).Select(e => e.BrandId).ToList();
            if (await _dbSet.AnyAsync(i => names.Contains(i.BrandId)))
            {
                return MyResults<object>.BrandIdRepeated;
            }

            return await base.AddRange(entities, isBeginTransaction);
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(TagEntity entity, bool isBeginTransaction = true)
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

                // 检验“标牌ID”是否重复:
                if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId && i.Id != entity.Id))
                {
                    return MyResults<object>.BrandIdRepeated;
                }

                // 修改“数据”:
                find.ShallowCopy(entity);

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
        public override async Task<MyActionResult<object>> EditRange(List<TagEntity> entities, bool isBeginTransaction = true)
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

                foreach (var find in finds)
                {
                    var entity = entities.FirstOrDefault(i => i.Id == find.Id);
                    if (entity == null)
                    {
                        return MyResults<object>.SomeResourceNotExist;
                    }

                    // 检验“标牌ID”是否重复:
                    if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId && i.Id != entity.Id))
                    {
                        return MyResults<object>.BrandIdRepeated;
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
        #endregion 【Functions】
    }
}
