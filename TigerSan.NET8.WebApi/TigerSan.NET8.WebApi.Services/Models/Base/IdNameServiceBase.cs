using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities.Base;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models.Base
{
    public class IdNameServiceBase<TEntity> : IdServiceBase<TEntity>, IIdServiceBase<TEntity> where TEntity : IdNameEntityBase
    {
        #region 【Ctor】
        public IdNameServiceBase(AppDbContext db, DbSet<TEntity> dbSet) : base(db, dbSet)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        /// <summary>获取“ID名称对”集合</summary>
        public async Task<List<IdName>> SelectIdName(bool? isDistinct)
        {
            var query = _dbSet.Select(x => new IdName(x));

            if (isDistinct ?? false)
            {
                query = query.Distinct();
            }

            return await query.ToListAsync();
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
