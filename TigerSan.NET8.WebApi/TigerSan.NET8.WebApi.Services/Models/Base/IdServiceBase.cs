using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models.Base
{
    public class IdServiceBase<TEntity> : IIdServiceBase<TEntity> where TEntity : IdEntityBase
    {
        #region 【Fields】
        public AppDbContext _db;
        public DbSet<TEntity> _dbSet;
        /// <summary>“当前表”配置</summary>
        private readonly static DbSetConfig _dbSetConfig = new DbSetConfig(typeof(TEntity), AppDbContext.GetDbSetName(typeof(DbSet<TEntity>)));
        #endregion 【Fields】

        #region 【Ctor】
        public IdServiceBase(AppDbContext db, DbSet<TEntity> dbSet)
        {
            _db = db;
            _dbSet = dbSet;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [static]
        #region 修改“当前表”配置
        /// <summary>修改“当前表”配置</summary>
        public static DbSetConfig SetDbSetConfig(string parentIdPropName)
        {
            _dbSetConfig.ParentIdPropName = parentIdPropName;
            return _dbSetConfig;
        }
        #endregion
        #endregion [static]

        #region 获取“过滤器数据”
        /// <summary>获取“过滤器数据”</summary>
        public virtual async Task<IQueryable<TEntity>> GetFilter(IQueryable<TEntity> queryable, FilterDto? filter = null)
        {
            try
            {
                if (filter != null)
                {
                    if (filter.Filters != null)
                    {
                        queryable = queryable.GetFilters(filter.Filters);
                    }

                    if (filter.Parent != null)
                    {
                        queryable = await queryable.GetParentFilter(
                            _dbSetConfig.ParentIdPropName,
                            _db,
                            _dbSetConfig.Parent,
                            filter.Parent);
                    }
                }

                return queryable;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return queryable;
            }
        }
        #endregion

        #region [查]
        #region 获取“单条数据”
        /// <summary>获取“单条数据”</summary>
        public virtual async Task<TEntity?> Get(long id)
        {
            try
            {
                return await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return null;
            }
        }
        #endregion

        #region 获取“总数”
        /// <summary>获取“总数”</summary>
        public virtual async Task<int> GetCount(FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                queryable = await GetFilter(queryable, filter);

                return await queryable.CountAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return 0;
            }
        }
        #endregion

        #region 获取“数据”集合
        /// <summary>获取“数据”集合</summary>
        public virtual async Task<List<TEntity>> GetList(List<long> ids)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                queryable = queryable.Where(i => ids.Contains(i.Id));

                return await queryable.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<TEntity>();
            }
        }
        #endregion

        #region 获取“数据”集合
        /// <summary>获取“数据”集合</summary>
        public virtual async Task<List<TEntity>> GetList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                queryable = await GetFilter(queryable, filter);

                return await queryable.GetPage(pageSize, pageNumber).ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<TEntity>();
            }
        }
        #endregion

        #region 获取“字段”集合
        /// <summary>获取“字段”集合</summary>
        public virtual async Task<List<TField>> Select<TField>(
            Func<TEntity, TField> selector,
            bool isDistinct = false,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();
                queryable = await GetFilter(queryable, filter);

                var list = queryable.Select(selector);

                if (isDistinct)
                {
                    list = list.Distinct();
                }

                return list.ToList();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<TField>();
            }
        }
        #endregion

        #region 获取“ID值对”集合
        /// <summary>获取“ID值对”集合</summary>
        public virtual async Task<List<IdValue<TField>>> SelectIdValue<TField>(
            Func<TEntity, TField> selector,
            bool? isDistinct = null,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();
                queryable = await GetFilter(queryable, filter);

                var list = queryable.Select(i => new IdValue<TField>(selector(i), i.Id));

                if (isDistinct ?? false)
                {
                    list = list.Distinct();
                }

                return list.ToList();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<IdValue<TField>>();
            }
        }
        #endregion

        #region “单条数据”是否存在
        /// <summary>“单条数据”是否存在</summary>
        public virtual async Task<bool> IsExists(long id)
        {
            return await _dbSet.AsNoTracking().AnyAsync(i => i.Id == id);
        }
        #endregion

        #region “多条数据”是否存在
        /// <summary>“多条数据”是否存在</summary>
        public virtual async Task<bool> IsExistsRange(List<long> ids)
        {
            return await _dbSet.AsNoTracking().AnyAsync(i => ids.Contains(i.Id));
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public virtual async Task<MyActionResult<object>> Add(TEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entity.UpdateId();
                _dbSet.Add(entity);

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
        public virtual async Task<MyActionResult<object>> AddRange(List<TEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entities.UpdateId();
                await _dbSet.AddRangeAsync(entities);

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
        public virtual async Task<MyActionResult<object>> Edit(TEntity entity, bool isBeginTransaction = true)
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

                // 修改“数据”:
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

        #region 修改“多条数据”
        /// <summary>修改“多条数据”</summary>
        public virtual async Task<MyActionResult<object>> EditRange(List<TEntity> entities, bool isBeginTransaction = true)
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

                // 修改“数据”:
                foreach (var find in finds)
                {
                    var entity = entities.FirstOrDefault(i => i.Id == find.Id);
                    if (entity == null)
                    {
                        return MyResults<object>.SomeResourceNotExist;
                    }
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
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public virtual async Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
                if (entity == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                _dbSet.Remove(entity);
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

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public virtual async Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (ids.Count < 1) return res;

                var entities = _dbSet.AsNoTracking().Where(i => ids.Contains(i.Id));

                var count = await entities.CountAsync();
                if (count < 1)
                {
                    return MyResults<object>.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    return MyResults<object>.SomeResourceNotExist;
                }


                _dbSet.RemoveRange(entities);
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
        #endregion [删]
        #endregion 【Functions】
    }
}
