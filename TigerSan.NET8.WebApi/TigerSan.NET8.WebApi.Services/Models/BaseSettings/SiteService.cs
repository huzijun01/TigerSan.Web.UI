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
    public class SiteService : IdNameServiceBase<SiteEntity>, ISiteService
    {
        #region 【Ctor】
        static SiteService()
        {
            SetDbSetConfig(nameof(SiteEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public SiteService(AppDbContext db) : base(db, db.Sites)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“所属公司”集合
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList(List<CompanyEntity>? accessibleCompanies)
        {
            try
            {
                var companys = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Company)
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
                LogHelper.Instance.Error(e.GetMessage());
                return MyResults<List<IdName>>.Error(e.GetMessage());
            }
        }
        #endregion

        #region 获取“所属类型”集合
        /// <summary>获取“所属类型”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongSiteTypeList(long? company = null)
        {
            try
            {
                var queryable = _dbSet
                    .AsNoTracking();

                if (company != null)
                {
                    queryable = queryable.Where(i => i.Company == company);
                }

                var siteTypes = await queryable
                    .Distinct()
                    .Select(i => i.Type)
                    .ToListAsync();

                if (siteTypes.Count < 1) return MyResults<List<IdName>>.EmptyIdNameList;

                var list = await _db.SiteTypes
                    .AsNoTracking()
                    .Where(i => siteTypes.Contains(i.Id))
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();

                return MyResults<List<IdName>>.Success(null, list);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return MyResults<List<IdName>>.Error(e.GetMessage());
            }
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
