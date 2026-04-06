using System.Reflection;
using System.ComponentModel;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    #region 方法获取器
    public static class MethodPicker
    {
        /// <summary>获取方法</summary>
        public static MethodInfo GetMethod<T>(Expression<Action<T>> expression)
            => ((MethodCallExpression)expression.Body).Method;

        /// <summary>转为小写</summary>
        public static readonly MethodInfo ToLower = GetMethod<string>(s => s.ToLower());

        /// <summary>抛出异常</summary>
        public static Expression GetThrow(string msg)
            => Expression.Throw(Expression.Constant(new InvalidOperationException(msg)));
    }
    #endregion

    public static class IQueryableExtendion
    {
        #region 【Where】
        private static readonly Lazy<MethodInfo?> _cachedWhereMethod = new Lazy<MethodInfo?>(GetWhereMethod, true);

        #region 获取“Where”方法
        private static MethodInfo? GetWhereMethod()
        {
            var queryableType = typeof(Queryable);
            var methods = queryableType.GetMethods(BindingFlags.Public | BindingFlags.Static)
                .Where(m => m.Name == nameof(Queryable.Where) &&
                            m.GetParameters().Length == 2);

            return methods.FirstOrDefault(m =>
                m.GetParameters()[1].ParameterType.IsGenericType &&
                m.GetParameters()[1].ParameterType.GetGenericTypeDefinition() == typeof(Expression<>));
        }
        #endregion

        #region 调用“Where”方法
        public static IQueryable? Where(this IQueryable source, LambdaExpression predicate)
        {
            var method = _cachedWhereMethod.Value;
            if (method == null)
            {
                LogHelper.Instance.Warning("The Queryable.Where method cannot be found!");
                return null;
            }

            try
            {
                var genericMethod = method.MakeGenericMethod(source.ElementType);
                return (IQueryable?)genericMethod.Invoke(null, new object[] { source, predicate });
            }
            catch (TargetInvocationException tie)
            {
                LogHelper.Instance.Warning($"执行Where方法失败: {tie.InnerException?.Message ?? tie.Message}");
                return null;
            }
            catch (ArgumentException ae)
            {
                LogHelper.Instance.Warning($"类型参数不匹配: {ae.InnerException?.Message ?? ae.Message}");
                return null;
            }
        }
        #endregion
        #endregion 【Where】

        #region 【Helpers】
        #region 转换类型
        /// <summary>转换类型</summary>
        public static bool TryParse(Type type, string? input, out object result)
        {
            result = new object();
            try
            {
                if (input == null) return false;

                var converter = TypeDescriptor.GetConverter(type);
                if (converter == null || !converter.IsValid(input)) return false;

                var convertedValue = converter.ConvertFromString(input);
                if (convertedValue == null) return false;

                result = convertedValue;
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion
        #endregion 【Helpers】

        #region 获取“过滤器数据”
        public static IQueryable GetFilter(Type entityType, IQueryable queryable, PropFilter filter)
        {
            try
            {
                // 添加单值:
                if (filter.Value != null)
                {
                    if (filter.Values == null)
                    {
                        filter.Values = new List<object>();
                    }
                    filter.Values.Add(filter.Value);
                }

                // 验证过滤器参数的有效性:
                if (filter.Values == null || filter.Values.Count() < 1 || string.IsNullOrEmpty(filter.PropName)) return queryable;

                // 获取“属性信息”:
                var propertyInfo = entityType.GetProperty(filter.PropName);
                if (propertyInfo == null)
                {
                    LogHelper.Instance.Warning($"Property '{filter.PropName}' not found on type '{entityType.Name}'");
                    return queryable;
                }

                // 创建“x”表达式:
                var parameter = Expression.Parameter(entityType, "x");
                // 创建“x.prop”表达式:
                var property = Expression.Property(parameter, propertyInfo);
                var propertyType = propertyInfo.PropertyType;

                // 创建“=”表达式:
                Func<object, Expression> selector;
                if (propertyType == typeof(string))
                {
                    selector = obj => Expression.Equal(
                        Expression.Call(property, MethodPicker.ToLower),
                        Expression.Constant(obj.ToString()?.ToLower(), typeof(string))
                    );
                }
                else
                {
                    selector = obj =>
                    {
                        var res = TryParse(propertyType, obj.ToString(), out var convertedValue);
                        if (res == false)
                        {
                            return MethodPicker.GetThrow($"TryParse error!({propertyType.Name})");
                        }

                        return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                    };
                }

                // 创建“OR”表达式:
                var values = filter.Values.Distinct().ToList();
                var body = values.Select(selector).Aggregate(Expression.OrElse);

                // 创建“Lambda”表达式:
                var lambda = Expression.Lambda(body, parameter);

                // 动态调用“Where”方法:
                var newQueryable = queryable.Where(lambda);
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
        public static IQueryable<TEntity> GetOnlyFilter<TEntity>(this IQueryable<TEntity> queryable, PropFilter filters) where TEntity : IdEntityBase
        {
            return (IQueryable<TEntity>)GetFilter(typeof(TEntity), queryable, filters);
        }
        #endregion

        #region 获取“多过滤器数据”
        /// <summary>获取“多过滤器数据”</summary>
        public static IQueryable<TEntity> GetFilters<TEntity>(this IQueryable<TEntity> queryable, List<PropFilter> filters) where TEntity : IdEntityBase
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
            ParentFilter parentDto) where TEntity : IdEntityBase
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

            queryable = queryable.GetOnlyFilter(new PropFilter()
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
            ParentFilter parentDto)
        {
            var ids = new List<long>();

            // 添加单值:
            if (parentDto.Id != null)
            {
                if (parentDto.Ids == null)
                {
                    parentDto.Ids = new List<long>();
                }
                parentDto.Ids.Add(parentDto.Id.Value);
            }

            if (parentDto.Ids != null && parentDto.Ids.Count() > 0) // 无需向上筛选
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
            var queryableParent = db.GetDbSet(parent.DbSetName) as IQueryable<IdEntityBase>;
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

            queryableParent = GetFilter(parent.EntityType, queryableParent, new PropFilter()
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
