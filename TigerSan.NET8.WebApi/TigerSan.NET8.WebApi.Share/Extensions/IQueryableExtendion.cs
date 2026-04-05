using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class IQueryableExtendion
    {
        #region 获取“过滤器数据”
        public static IQueryable GetFilter(Type entityType, IQueryable queryable, PropFilterDto filter)
        {
            try
            {
                // 如果单值存在，则将其添加到多值列表中:
                if (filter.Value != null)
                {
                    if (filter.Values == null)
                    {
                        filter.Values = new List<object>();
                    }
                    filter.Values.Add(filter.Value);
                }

                // 验证过滤器参数的有效性:
                if (filter.Values == null || string.IsNullOrEmpty(filter.PropName) || !filter.Values.Any()) return queryable;

                // 创建动态参数表达式:
                var parameter = Expression.Parameter(entityType, "x");

                // 通过属性名反射获取属性信息:
                var propertyInfo = entityType.GetProperty(filter.PropName);
                if (propertyInfo == null)
                {
                    LogHelper.Instance.Warning($"Property '{filter.PropName}' not found on type '{entityType.Name}'");
                    return queryable;
                }

                var property = Expression.Property(parameter, propertyInfo);
                var propertyType = propertyInfo.PropertyType;

                // 根据属性类型选择表达式构建方式:
                Func<object, BinaryExpression> selector;
                if (propertyType == typeof(string))
                {
                    selector = v => Expression.Equal(
                        Expression.Call(property, typeof(string).GetMethod("ToLower", Type.EmptyTypes)!),
                        Expression.Constant(v.ToString()?.ToLower(), typeof(string))
                    );
                }
                else if (propertyType == typeof(int))
                {
                    selector = v =>
                    {
                        int.TryParse(v.ToString(), out var convertedValue);
                        return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                    };
                }
                else if (propertyType == typeof(double))
                {
                    selector = v =>
                    {
                        double.TryParse(v.ToString(), out var convertedValue);
                        return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                    };
                }
                else if (propertyType == typeof(long))
                {
                    selector = v =>
                    {
                        long.TryParse(v.ToString(), out var convertedValue);
                        return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                    };
                }
                else if (propertyType == typeof(bool))
                {
                    selector = v =>
                    {
                        bool.TryParse(v.ToString(), out var convertedValue);
                        return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                    };
                }
                else
                {
                    LogHelper.Instance.Warning($"Unsupported filter type: {propertyType.Name}");
                    return queryable;
                }

                // 构建OR条件表达式:
                var values = filter.Values.Distinct().ToList();
                var body = values.Select(selector).Aggregate(Expression.OrElse);
                // 构建Lambda表达式:
                var lambda = Expression.Lambda(body, parameter);
                // 动态调用Where方法:
                var whereMethod = typeof(Queryable)
                    .GetMethods()
                    .FirstOrDefault(m =>
                    m.Name == "Where" &&
                    m.GetParameters()[1].ParameterType.Name.StartsWith("Expression`1"))
                    ?.MakeGenericMethod(entityType);

                var newQueryable = whereMethod?.Invoke(null, new object[] { queryable, lambda }) as IQueryable;

                if (newQueryable == null)
                {
                    LogHelper.Instance.IsNull(nameof(newQueryable));
                    return queryable;
                }

                queryable = newQueryable;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
            }

            return queryable;
        }
        #endregion

        #region 获取“单页数据”
        /// <summary>获取“单页数据”</summary>
        public static IQueryable<TEntity> GetPage<TEntity>(this IQueryable<TEntity> queryable, int pageSize, int pageNumber) where TEntity : IdEntityBase
        {
            return queryable
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize);
        }
        #endregion

        #region 获取“单过滤器数据”
        /// <summary>获取“单过滤器数据”</summary>
        public static IQueryable<TEntity> GetOnlyFilter<TEntity>(this IQueryable<TEntity> queryable, PropFilterDto filters) where TEntity : IdEntityBase
        {
            return (IQueryable<TEntity>)GetFilter(typeof(TEntity), queryable, filters);
        }
        #endregion

        #region 获取“多过滤器数据”
        /// <summary>获取“多过滤器数据”</summary>
        public static IQueryable<TEntity> GetFilters<TEntity>(this IQueryable<TEntity> queryable, List<PropFilterDto> filters) where TEntity : IdEntityBase
        {
            foreach (var filter in filters)
            {
                queryable = (IQueryable<TEntity>)GetFilter(typeof(TEntity), queryable, filter);
            }

            return queryable;
        }
        #endregion

        #region 获取“父表过滤器数据”
        /// <summary>获取“父表过滤器数据”</summary>
        public async static Task<IQueryable<TEntity>> GetParentFilter<TEntity>(
            this IQueryable<TEntity> queryable,
            string? parentIdPropName,
            AppDbContext db,
            ParentFilterModel? parent,
            ParentFilterDto parentDto) where TEntity : IdEntityBase
        {
            if (parent == null || parentIdPropName == null)
            {
                LogHelper.Instance.Warning($"The _parent or _parentIdPropName has not been set for the current Service!");
                return queryable;
            }

            var parentIds = await GetParentIds(
                db,
                parent,
                parentDto);

            queryable = queryable.GetOnlyFilter(new PropFilterDto()
            {
                PropName = parentIdPropName,
                Values = parentIds.Cast<object>().ToList()
            });

            return queryable;
        }
        #endregion

        #region 获取“父表ID”集合
        public static async Task<List<long>> GetParentIds(
            AppDbContext db,
            ParentFilterModel parent,
            ParentFilterDto parentDto)
        {
            var ids = new List<long>();

            if (parentDto.Ids.Count() > 0) // 无需向上筛选
            {
                return parentDto.Ids;
            }
            else if (parentDto.Parent == null || parent.Parent == null) // 已到顶级
            {
                return ids;
            }

            // 继续向上获取父表ID集合:
            parentDto.Ids = await GetParentIds(
                db,
                parent.Parent,
                parentDto.Parent);

            if (parentDto.Ids.Count() < 1) return ids;

            // 获取父表ID集合:
            var queryableParent = db.GetQueryable(parent.DbSetName) as IQueryable<IdEntityBase>;
            if (queryableParent == null)
            {
                LogHelper.Instance.IsNull(nameof(queryableParent));
                return ids;
            }
            if (parent.ParentIdPropName == null)
            {
                LogHelper.Instance.IsNull(nameof(parent.ParentIdPropName));
                return ids;
            }

            queryableParent = GetFilter(parent.EntityType, queryableParent, new PropFilterDto()
            {
                PropName = parent.ParentIdPropName,
                Values = parentDto.Ids.Cast<object>().ToList()
            }) as IQueryable<IdEntityBase>;
            if (queryableParent == null)
            {
                LogHelper.Instance.IsNull(nameof(queryableParent));
                return ids;
            }

            return await queryableParent.Select(i => i.Id).ToListAsync();
        }
        #endregion
    }
}
