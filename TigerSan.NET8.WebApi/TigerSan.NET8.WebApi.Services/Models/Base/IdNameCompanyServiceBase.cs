using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models.Base
{
    public class IdNameCompanyServiceBase<TEntity> : IdNameServiceBase<TEntity>, IIdNameServiceBase<TEntity> where TEntity : IdNameCompanyEntityBase
    {
        #region 【Ctor】
        public IdNameCompanyServiceBase(AppDbContext db, DbSet<TEntity> dbSet) : base(db, dbSet)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“单条数据”
        /// <summary>获取“单条数据”</summary>
        public new virtual async Task<MyActionResult<TEntity>> Get(long id)
        {
            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
                if (entity == null)
                {
                    return MyResults<TEntity>.ResourceNotExist;
                }

                // 添加“公司名称”:
                var parent = _dbSetConfig.Parent;
                if (parent != null && parent.DbSetName == nameof(_db.Companies))
                {
                    var company = await _db.Companies.FirstOrDefaultAsync(i => i.Id == entity.Company);
                    if (company != null) entity.CompanyName = company.Name;
                }

                return MyResults<TEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                return MyResults<TEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“数据”集合
        /// <summary>获取“数据”集合</summary>
        public new virtual async Task<MyActionResult<List<TEntity>>> GetList(
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
                    return MyResults<List<TEntity>>.Error(res.Message);
                }

                var resSort = queryable.Sort(sort, ascending);
                queryable = resSort.Data;
                if (queryable == null)
                {
                    return MyResults<List<TEntity>>.Error(resSort.Message);
                }

                var list = await queryable.GetPage(pageSize, pageNumber).ToListAsync();

                // 添加“公司名称”:
                var parent = _dbSetConfig.Parent;
                if (parent != null && parent.DbSetName == nameof(_db.Companies))
                {
                    var companies = await _db.Companies.Select(i => new IdName(i.Id, i.Name)).ToListAsync();
                    if (companies != null)
                    {
                        foreach (var item in list)
                        {
                            var company = companies.FirstOrDefault(i => i.Id == item.Company);
                            if (company != null) item.CompanyName = company.Name;
                        }
                    }
                }

                return MyResults<List<TEntity>>.Success(null, list);
            }
            catch (Exception e)
            {
                return MyResults<List<TEntity>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
