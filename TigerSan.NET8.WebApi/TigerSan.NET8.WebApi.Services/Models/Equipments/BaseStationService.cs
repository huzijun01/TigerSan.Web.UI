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
    public class BaseStationService : IdNameServiceBase<BaseStationEntity>, IBaseStationService
    {
        #region 【Ctor】
        static BaseStationService()
        {
            SetDbSetConfig(nameof(BaseStationEntity.Site))
                .SetParent(typeof(SiteEntity), nameof(_db.Sites), nameof(SiteEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public BaseStationService(AppDbContext db) : base(db, db.BaseStations)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 根据“MAC地址”获取“单条数据”
        /// <summary>根据“MAC地址”获取“单条数据”</summary>
        public async Task<MyActionResult<BaseStationEntity>> GetByMacAddr(string macAddr)
        {
            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.MacAddr == macAddr);
                if (entity == null)
                {
                    return MyResults<BaseStationEntity>.ResourceNotExist;
                }
                return MyResults<BaseStationEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<BaseStationEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<MyActionResult<List<BaseStationDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null)
        {
            try
            {
                var list = new List<BaseStationDto>();

                var resGetList = await GetList(pageSize, pageNumber, sort, ascending, filter);
                var stations = resGetList.Data;
                if (stations == null)
                {
                    return MyResults<List<BaseStationDto>>.Error(resGetList.Message);
                }

                // 添加“数据”:
                foreach (var station in stations)
                {
                    var siteEntity = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(i => i.Id == station.Site);
                    if (siteEntity == null)
                    {
                        LogHelper.Instance.IsNull(nameof(siteEntity));
                        continue;
                    }

                    var dto = new BaseStationDto();
                    dto.ShallowCopy(station);
                    dto.Company = siteEntity.Company;
                    dto.Addr = siteEntity.Addr;
                    dto.AddrDetail = siteEntity.AddrDetail;

                    list.Add(dto);
                }

                return MyResults<List<BaseStationDto>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<BaseStationDto>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“所属公司”集合
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList(List<CompanyEntity>? accessibleCompanies)
        {
            try
            {
                var sites = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Site)
                    .Distinct()
                    .ToListAsync();

                if (sites.Count < 1) return MyResults<List<IdName>>.EmptyIdNameList;

                var companys = await _db.Sites
                    .AsNoTracking()
                    .Where(d => sites.Contains(d.Id))
                    .Select(d => d.Company)
                    .Distinct()
                    .ToListAsync();

                if (companys.Count < 1) return MyResults<List<IdName>>.EmptyIdNameList;

                if (accessibleCompanies == null)
                {
                    return MyResults<List<IdName>>.IsNull(nameof(accessibleCompanies));
                }

                companys = companys.Where(i => accessibleCompanies.Any(a => a.Id == i)).ToList();

                var list = await _db.Companies
                    .AsNoTracking()
                    .Where(i => companys.Contains(i.Id))
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();

                return MyResults<List<IdName>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<IdName>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“所属场地”集合
        /// <summary>获取“所属场地”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongSiteList(long? company = null)
        {
            try
            {
                var sites = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Site)
                    .Distinct()
                    .ToListAsync();

                if (sites.Count < 1) return MyResults<List<IdName>>.EmptyIdNameList;

                var queryable = _db.Sites
                    .AsNoTracking()
                    .Where(i => sites.Contains(i.Id));

                if (company != null)
                {
                    queryable = queryable.Where(i => i.Company == company);
                }

                var list = await queryable
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();

                return MyResults<List<IdName>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<IdName>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“所属基站类型”集合
        /// <summary>获取“所属基站类型”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongStationTypeList(long? company = null, long? site = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                // 筛选:
                if (site != null)
                {
                    queryable = queryable.Where(i => i.Site == site);
                }
                else if (company != null)
                {
                    var sites = await _db.Sites.Where(d => d.Company == company).Select(d => d.Id).ToListAsync();
                    queryable = queryable.Where(i => sites.Contains(i.Site));
                }

                var types = await queryable
                    .Distinct()
                    .Select(i => i.Type)
                    .ToListAsync();

                if (types.Count < 1) return MyResults<List<IdName>>.EmptyIdNameList;

                var list = await _db.StationTypes
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();

                return MyResults<List<IdName>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<IdName>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“场地”
        /// <summary>获取“场地”</summary>
        public async Task<MyActionResult<SiteEntity>> GetSite(long id)
        {
            try
            {
                var station = await _dbSet.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
                if (station == null)
                {
                    LogHelper.Instance.IsNull(nameof(station));
                    return MyResults<SiteEntity>.Error("Station not found");
                }

                var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(s => s.Id == station.Site);
                if (site == null)
                {
                    LogHelper.Instance.IsNull(nameof(site));
                    return MyResults<SiteEntity>.Error("Site not found");
                }

                return MyResults<SiteEntity>.Success(null, site);
            }
            catch (Exception e)
            {
                return MyResults<SiteEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“场地”字典
        /// <summary>获取“场地”字典</summary>
        public async Task<MyActionResult<Dictionary<long, SiteEntity>>> GetSiteDict(List<long> ids)
        {
            var dict = new Dictionary<long, SiteEntity>();
            try
            {
                foreach (var id in ids)
                {
                    var station = await _dbSet.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
                    if (station == null)
                    {
                        LogHelper.Instance.IsNull(nameof(station));
                        continue;
                    }

                    var site = await _db.Sites.AsNoTracking().FirstOrDefaultAsync(s => s.Id == station.Site);
                    if (site == null)
                    {
                        LogHelper.Instance.IsNull(nameof(site));
                        continue;
                    }

                    dict.Add(id, site);
                }

                return MyResults<Dictionary<long, SiteEntity>>.Success(null, dict);
            }
            catch (Exception e)
            {
                return MyResults<Dictionary<long, SiteEntity>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<BaseStationEntity>> Add(BaseStationEntity entity, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entity.UpdateId();
                entity.CreateTime = DateTime.Now;
                entity.ReportTime = null;
                _dbSet.Add(entity);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务

                return MyResults<BaseStationEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<BaseStationEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<BaseStationEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entities.UpdateId(i => { i.CreateTime = DateTime.Now; i.ReportTime = null; });
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

        #region [Others]
        #region 更新“在线状态”
        /// <summary>更新“在线状态”</summary>
        public async Task<MyActionResult<object>> UpdateOnlineState()
        {
            try
            {
                var now = DateTimeHelper.GetUtcNow();

                var timeOuts = await _dbSet
                    .Where(bs => bs.OnlineState == OnlineStates.Online && bs.ReportTime != null
                    && bs.ReportTime.Value.AddSeconds(bs.HeartbeatInterval) < now)
                    .ToListAsync();

                foreach (var timeOut in timeOuts)
                {
                    timeOut.OnlineState = OnlineStates.Offline;
                }

                await _db.SaveChangesAsync();
                return MyResults<object>.Success();
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [Others]
        #endregion 【Functions】
    }
}
