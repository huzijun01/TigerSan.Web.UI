using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models.Base
{
    public class IdNameRepeatableServiceBase<TEntity> : IdServiceBase<TEntity>, IIdNameServiceBase<TEntity> where TEntity : IdName
    {
        #region 【Ctor】
        public IdNameRepeatableServiceBase(AppDbContext db, DbSet<TEntity> dbSet) : base(db, dbSet)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“ID名称对”集合
        public async Task<MyActionResult<List<IdName>>> SelectIdName(bool? isDistinct = null, FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();
                var res = await GetFilter(queryable, filter);
                if (res.Data == null)
                {
                    return MyResults<List<IdName>>.Error(res.Message);
                }
                queryable = res.Data;

                var select = queryable.Select(i => new IdName(i));

                if (isDistinct ?? false)
                {
                    select = select.Distinct();
                }

                return MyResults<List<IdName>>.Success(null, (List<IdName>)await EntityFrameworkQueryableExtensions.ToListAsync<IdName>(select));
            }
            catch (Exception e)
            {
                return MyResults<List<IdName>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
