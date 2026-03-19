using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class ServiceBase<T> : IServiceBase<T> where T : IdEntity
    {
        #region 【Fields】
        public AppDbContext _db;
        public DbSet<T> _dbSet;
        #endregion 【Fields】

        #region 【Ctor】
        public ServiceBase(AppDbContext db, DbSet<T> dbSet)
        {
            _db = db;
            _dbSet = dbSet;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“单条数据”
        /// <summary>获取“单条数据”</summary>
        public async Task<T?> Get(long id)
        {
            try
            {
                return await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return null;
            }
        }
        #endregion

        #region 获取“总数”
        /// <summary>获取“总数”</summary>
        public async Task<int> GetCount()
        {
            try
            {
                return await _dbSet.AsNoTracking().CountAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return 0;
            }
        }
        #endregion

        #region 获取“所有数据”
        /// <summary>获取“所有数据”</summary>
        public async Task<List<T>> GetAllList()
        {
            try
            {
                return await _dbSet.AsNoTracking().ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<T>();
            }
        }
        #endregion

        #region 获取“单页数据”
        /// <summary>获取“单页数据”</summary>
        public async Task<List<T>> GetList(int pageSize, int pageNumber)
        {
            try
            {
                return await _dbSet
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<T>();
            }
        }
        #endregion

        #region 获取“字段”集合
        /// <summary>获取“字段”集合</summary>
        public async Task<List<object>> Select(string field, bool isDistinct = false)
        {
            try
            {
                // 1. 验证字段有效性
                var entityType = _dbSet.EntityType; // 获取实体类型
                var property = entityType.FindProperty(field);
                if (property == null) throw new ArgumentException($"Invalid field: {field}");

                // 2. 构建动态选择表达式
                var parameter = Expression.Parameter(entityType.ClrType, "x");
                var propertyExpression = Expression.Property(parameter, field);
                var selector = Expression.Lambda<Func<object, object>>(
                    Expression.Convert(propertyExpression, typeof(object)),
                    parameter
                );

                // 3. 执行动态查询
                var query = _dbSet.AsNoTracking().Select(selector);

                if (isDistinct)
                {
                    query = query.Distinct();
                }

                return await query.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<object>();
            }
        }
        #endregion

        #region 筛选集合
        /// <summary>筛选集合</summary>
        public async Task<List<object>> Where(List<FilterModel> filters, int? pageSize = null, int? pageNumber = null)
        {
            if (filters == null || !filters.Any())
                return await _dbSet.AsNoTracking().Select(x => (object)x).ToListAsync();

            try
            {
                var entityType = _dbSet.EntityType;
                var parameter = Expression.Parameter(entityType.ClrType, "x");
                var conditions = new List<Expression>();

                foreach (var filter in filters)
                {
                    // 字段存在性检查（不校验类型）
                    if (entityType.FindProperty(filter.Field) == null)
                        continue; // 跳过无效字段

                    // 构建Contains表达式
                    var propertyExpression = Expression.Property(parameter, filter.Field);
                    var containsMethod = typeof(Enumerable).GetMethods()
                        .First(m => m.Name == "Contains" && m.GetParameters().Length == 2)
                        .MakeGenericMethod(typeof(object));

                    var containsExpression = Expression.Call(
                        containsMethod,
                        Expression.Constant(filter.Values),
                        Expression.Convert(propertyExpression, typeof(object)) // 处理值类型
                    );

                    conditions.Add(containsExpression);
                }

                // 构建组合表达式（AND逻辑）
                var combinedExpression = conditions.FirstOrDefault();
                if (combinedExpression != null && conditions.Count > 1)
                {
                    combinedExpression = conditions.Skip(1)
                        .Aggregate(combinedExpression, Expression.AndAlso);
                }

                // 构建Lambda表达式
                var lambda = Expression.Lambda<Func<object, bool>>(
                    combinedExpression ?? Expression.Constant(true),
                    parameter
                );

                // 构建基础查询
                var query = _dbSet
                    .AsNoTracking()
                    .Select(x => new { Entity = x, Match = lambda.Compile()(x) })
                    .Where(x => x.Match)
                    .Select(x => (object)x.Entity);

                // 应用分页逻辑
                if (pageSize.HasValue && pageSize > 0 && pageNumber.HasValue && pageNumber > 0)
                {
                    var skip = (pageNumber.Value - 1) * pageSize.Value;
                    query = query.Skip(skip).Take(pageSize.Value);
                }

                return await query.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error($"Filter error: {e.Message}");
                return new List<object>();
            }
        }

        #endregion

        #region “单条数据”是否存在
        /// <summary>“单条数据”是否存在</summary>
        public async Task<bool> IsExists(long id)
        {
            return await _dbSet.AsNoTracking().AnyAsync(i => i.Id == id);
        }
        #endregion

        #region “多条数据”是否存在
        /// <summary>“多条数据”是否存在</summary>
        public async Task<bool> IsExistsRange(IList<long> ids)
        {
            return await _dbSet.AsNoTracking().AnyAsync(i => ids.Contains(i.Id));
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add(T entity)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                if (await IsExists(entity.Id))
                {
                    return MyResults.ResourceExists;
                }

                _dbSet.Add(entity);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> AddRange(IList<T> entities)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var ids = entities.Select(i => i.Id).ToList();
                if (await IsExistsRange(ids))
                {
                    return MyResults.ResourceExists;
                }

                await _dbSet.AddRangeAsync(entities);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit(T entity)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var find = _dbSet.FirstOrDefault(i => i.Id == entity.Id);
                if (find == null)
                {
                    return MyResults.ResourceNotExist;
                }

                find.ShallowCopy(entity);

                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public async Task<MyActionResult> Remove(long id)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var entity = _dbSet.FirstOrDefault(i => i.Id == id);
                if (entity == null)
                {
                    return MyResults.ResourceNotExist;
                }

                _dbSet.Remove(entity);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public async Task<MyActionResult> RemoveRange(IList<long> ids)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                if (ids.Count < 1) return res;

                var entities = _dbSet.Where(i => ids.Contains(i.Id));

                var count = await entities.CountAsync();
                if (count < 1)
                {
                    return MyResults.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    res = MyResults.SomeResourceNotExist;
                }


                _dbSet.RemoveRange(entities);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [删]
        #endregion 【Functions】
    }
}
