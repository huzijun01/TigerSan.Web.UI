using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models.Base
{
    public class IdNameServiceBase<TEntity> : IdServiceBase<TEntity>, IIdNameServiceBase<TEntity> where TEntity : IdNameEntityBase
    {
        #region 【Ctor】
        public IdNameServiceBase(AppDbContext db, DbSet<TEntity> dbSet) : base(db, dbSet)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        /// <summary>获取“ID名称对”集合</summary>
        public async Task<List<IdName>> SelectIdName(bool? isDistinct = null, FilterDto? filter = null)
        {
            var queryable = _dbSet.AsNoTracking();
            queryable = await GetFilter(queryable, filter);

            var select = queryable.Select(i => new IdName(i));

            if (isDistinct ?? false)
            {
                select = select.Distinct();
            }

            return await select.ToListAsync();
        }
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(TEntity entity, bool isBeginTransaction = true)
        {
            // 检验“名称”是否重复:
            if (await _dbSet.AnyAsync(i => i.Name == entity.Name))
            {
                return MyResults<object>.NameRepeated;
            }

            return await base.Add(entity, isBeginTransaction);
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<TEntity> entities, bool isBeginTransaction = true)
        {
            // 检验“名称”是否重复:
            var names = entities.Select(e => e.Name).ToList();
            if (await _dbSet.AnyAsync(i => names.Contains(i.Name)))
            {
                return MyResults<object>.NameRepeated;
            }

            return await base.AddRange(entities, isBeginTransaction);
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(TEntity entity, bool isBeginTransaction = true)
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

                // 检验“名称”是否重复:
                if (await _dbSet.AnyAsync(i => i.Name == entity.Name && i.Id != entity.Id))
                {
                    return MyResults<object>.NameRepeated;
                }

                find.ShallowCopy(entity);

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
        #endregion [改]
        #endregion 【Functions】
    }
}
