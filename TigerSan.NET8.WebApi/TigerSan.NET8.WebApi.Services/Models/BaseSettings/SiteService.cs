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
        public async Task<List<IdName>> GetBelongCompanyList()
        {
            var list = new List<IdName>();
            try
            {
                var companys = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Company)
                    .Distinct()
                    .ToListAsync();

                if (companys.Count < 1) return list;

                return await _db.Companies
                    .AsNoTracking()
                    .Where(i => companys.Contains(i.Id))
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return list;
            }
        }
        #endregion

        #region 获取“所属类型”集合
        /// <summary>获取“所属类型”集合</summary>
        public async Task<List<IdName>> GetBelongSiteTypeList(long? company = null)
        {
            var list = new List<IdName>();
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

                if (siteTypes.Count < 1) return list;

                return await _db.SiteTypes
                    .AsNoTracking()
                    .Where(i => siteTypes.Contains(i.Id))
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return list;
            }
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
