using System.Reflection;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
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
                LogHelper.Instance.IsNull(nameof(method));
                return null;
            }

            try
            {
                var genericMethod = method.MakeGenericMethod(source.ElementType);
                return (IQueryable?)genericMethod.Invoke(null, new object[] { source, predicate });
            }
            catch (TargetInvocationException tie)
            {
                LogHelper.Instance.Error($"The execution of the Where method failed:{Environment.NewLine}{tie.GetMessage()}");
                return null;
            }
            catch (ArgumentException ae)
            {
                LogHelper.Instance.Error($"Type parameter mismatch:{Environment.NewLine}{ae.GetMessage()}");
                return null;
            }
        }
        #endregion
        #endregion 【Where】

        #region 【OrderBy】
        /// <summary>排序</summary>
        public static MethodInfo? OrderBy(bool ascending = true)
        {
            var methodName = ascending ? nameof(Queryable.OrderBy) : nameof(Queryable.OrderByDescending);

            return typeof(Queryable)
                .GetMethods()
                .FirstOrDefault(m => m.Name == methodName && m.GetParameters().Length == 2);
        }
        #endregion 【OrderBy】

        #region 【Others】
        #region 获取“OR”表达式
        /// <summary>获取“OR”表达式</summary>
        private static Expression GetOrExpression(
            ParameterExpression parameter,
            Expression property,
            Type propertyType,
            List<object> values)
        {
            Func<object, Expression> selector = obj =>
            {
                if (propertyType == typeof(string))
                {
                    if (string.IsNullOrEmpty(obj.ToString()))
                        return Expression.Constant(false);

                    return Expression.Equal(
                        Expression.Call(property, MethodPicker.ToLower),
                        Expression.Constant(obj.ToString()?.ToLower(), typeof(string))
                    );
                }
                else
                {
                    var res = ObjectHelper.TryParse(propertyType, obj.ToString(), out var convertedValue);
                    if (res == false)
                        return MethodPicker.GetThrow($"TryParse error!({propertyType.Name})");

                    return Expression.Equal(property, Expression.Constant(convertedValue, propertyType));
                }
            };

            return values.Select(selector).Aggregate(Expression.OrElse);
        }
        #endregion

        #region 获取“Contains”表达式
        /// <summary>获取“Contains”表达式</summary>
        private static Expression GetContainsExpression(
            ParameterExpression parameter,
            Expression property,
            Type propertyType,
            List<object> values)
        {
            if (propertyType == typeof(string))
            {
                // 字符串类型：全部转小写
                var convertedValues = values.Select(v => v.ToString()?.ToLower()).ToArray();

                // 构建：values.Contains(x.Prop.ToLower())
                var valuesConstant = Expression.Constant(convertedValues, typeof(string[]));
                var toLowerCall = Expression.Call(property, MethodPicker.ToLower);

                var containsMethod = typeof(Enumerable)
                    .GetMethods()
                    .First(m => m.Name == "Contains" && m.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(string));

                return Expression.Call(containsMethod, valuesConstant, toLowerCall);
            }
            else
            {
                // 创建强类型数组：
                var convertedValues = Array.CreateInstance(propertyType, values.Count);

                for (int i = 0; i < values.Count; i++)
                {
                    var res = ObjectHelper.TryParse(propertyType, values[i].ToString(), out var converted);
                    if (res == false)
                        return MethodPicker.GetThrow($"TryParse error!({propertyType.Name})");
                    convertedValues.SetValue(converted, i);
                }

                // 构建：values.Contains(x.Prop)
                var valuesConstant = Expression.Constant(convertedValues, propertyType.MakeArrayType());

                var containsMethod = typeof(Enumerable)
                    .GetMethods()
                    .First(m => m.Name == "Contains" && m.GetParameters().Length == 2)
                    .MakeGenericMethod(propertyType);

                return Expression.Call(containsMethod, valuesConstant, property);
            }
        }
        #endregion
        #endregion 【Others】

        #region 不选择
        /// <summary>不选择</summary>
        public static IQueryable<TEntity> False<TEntity>(this IQueryable<TEntity> queryable)
        {
            return queryable.Where(x => false);
        }

        /// <summary>不选择</summary>
        public static IQueryable False(this IQueryable queryable)
        {
            var parameter = Expression.Parameter(queryable.ElementType, "p");
            var falseConstant = Expression.Constant(false, typeof(bool));
            var lambda = Expression.Lambda(falseConstant, parameter);
            return queryable.Where(lambda)!;
        }
        #endregion

        #region 获取“单页数据”
        /// <summary>获取“单页数据”</summary>
        public static IQueryable<TEntity> GetPage<TEntity>(this IQueryable<TEntity> queryable, int? pageSize, int? pageNumber) where TEntity : IdEntityBase
        {
            if (pageSize == null || pageNumber == null) return queryable;
            return queryable
                    .Skip((pageNumber.Value - 1) * pageSize.Value)
                    .Take(pageSize.Value);
        }
        #endregion

        #region 获取“排序数据”
        /// <summary>获取“排序数据”</summary>
        public static MyActionResult<IQueryable<TEntity>> Sort<TEntity>(
            this IQueryable<TEntity> queryable,
            string? propName = null,
            bool? ascending = null) where TEntity : IdEntityBase
        {
            if (string.IsNullOrEmpty(propName)) return MyResults<IQueryable<TEntity>>.Success(null, queryable);

            try
            {
                // 获取实体类型元数据
                var entityType = typeof(TEntity);

                // 获取“属性信息”:
                var propertyInfo = entityType.GetProperty(propName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
                if (propertyInfo == null)
                {
                    var error = $"Property '{propName}' not found on type '{entityType.Name}'";
                    LogHelper.Instance.Error(error);
                    return MyResults<IQueryable<TEntity>>.Error(error);
                }

                // 创建“x”表达式:
                var parameter = Expression.Parameter(entityType, "x");
                // 创建“x.prop”表达式:
                var property = Expression.Property(parameter, propertyInfo);
                var propertyType = propertyInfo.PropertyType;

                // 创建“=”表达式:
                var propertyAccess = Expression.Property(parameter, propName);
                var keySelector = Expression.Lambda(propertyAccess, parameter);

                // 动态调用OrderBy方法
                var orderByMethod = OrderBy(ascending ?? true);
                if (orderByMethod == null)
                {
                    LogHelper.Instance.IsNull(nameof(orderByMethod));
                    return MyResults<IQueryable<TEntity>>.Error($"The {nameof(orderByMethod)} is null!");
                }

                var sortedQuery = orderByMethod.MakeGenericMethod(entityType, propertyType).Invoke(null, [queryable, keySelector]);

                if (sortedQuery == null)
                {
                    LogHelper.Instance.IsNull(nameof(sortedQuery));
                    return MyResults<IQueryable<TEntity>>.Error($"The {nameof(sortedQuery)} is null!");
                }

                return MyResults<IQueryable<TEntity>>.Success(null, (IQueryable<TEntity>)sortedQuery);
            }
            catch (Exception e)
            {
                return MyResults<IQueryable<TEntity>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 获取“过滤器数据”
        public static MyActionResult<IQueryable> GetFilter(Type entityType, IQueryable queryable, PropFilter filter)
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
                if (filter.Values == null)
                    return MyResults<IQueryable>.Success(null, queryable);

                // 属性名为空:
                if (string.IsNullOrEmpty(filter.PropName))
                    return MyResults<IQueryable>.Error(LogHelper.Instance.IsNullOrEmpty(nameof(filter.PropName)));

                // 获取“属性信息”:
                var propertyInfo = entityType.GetProperty(filter.PropName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
                if (propertyInfo == null)
                {
                    return MyResults<IQueryable>.Error(LogHelper.Instance.Error($"Property '{filter.PropName}' not found on type '{entityType.Name}'"));
                }

                // 创建“x”表达式:
                var parameter = Expression.Parameter(entityType, "x");
                // 创建“x.prop”表达式:
                var property = Expression.Property(parameter, propertyInfo);
                var propertyType = propertyInfo.PropertyType;

                // 值去重:
                var values = filter.Values.Distinct().ToList();
                if (propertyType == typeof(string))
                {
                    values = values.Where(v => v != null && !string.IsNullOrEmpty(v.ToString())).ToList();
                }

                // 不选择:
                if (values.Count < 1)
                    return MyResults<IQueryable>.Success(null, queryable.False());

                Expression body;

                if (values.Count > 10) // 超过10个值，使用 Contains（避免栈溢出）
                {
                    body = GetContainsExpression(parameter, property, propertyType, values);
                }
                else // 值少的时候用原来的 OR（性能更好）
                {
                    body = GetOrExpression(parameter, property, propertyType, values);
                }

                // 创建“Lambda”表达式:
                var lambda = Expression.Lambda(body, parameter);

                // 动态调用“Where”方法:
                var newQueryable = queryable.Where(lambda);
                if (newQueryable == null)
                    return MyResults<IQueryable>.Error(LogHelper.Instance.IsNull(nameof(newQueryable)));

                queryable = newQueryable;
            }
            catch (Exception e)
            {
                return MyResults<IQueryable>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<IQueryable>.Success(null, queryable);
        }
        #endregion

        #region 获取“单过滤器数据”
        /// <summary>获取“单过滤器数据”</summary>
        public static MyActionResult<IQueryable<TEntity>> GetOnlyFilter<TEntity>(this IQueryable<TEntity> queryable, PropFilter? filters) where TEntity : IdEntityBase
        {
            if (filters == null) return MyResults<IQueryable<TEntity>>.Success(null, queryable);
            var res = GetFilter(typeof(TEntity), queryable, filters);
            if (res.Data == null)
            {
                LogHelper.Instance.Error(res.Message);
                return MyResults<IQueryable<TEntity>>.Error(res.Message);
            }

            return MyResults<IQueryable<TEntity>>.Success(null, (IQueryable<TEntity>)res.Data);
        }
        #endregion

        #region 获取“多过滤器数据”
        /// <summary>获取“多过滤器数据”</summary>
        public static MyActionResult<IQueryable<TEntity>> GetFilters<TEntity>(this IQueryable<TEntity> queryable, List<PropFilter> filters) where TEntity : IdEntityBase
        {
            foreach (var filter in filters)
            {
                var res = GetFilter(typeof(TEntity), queryable, filter);
                if (res.Data == null)
                    return MyResults<IQueryable<TEntity>>.Error(LogHelper.Instance.Error(res.Message));

                queryable = (IQueryable<TEntity>)res.Data;
            }

            return MyResults<IQueryable<TEntity>>.Success(null, queryable);
        }
        #endregion

        #region 获取“父表过滤器数据”
        /// <summary>获取“父表过滤器数据”</summary>
        public async static Task<MyActionResult<IQueryable<TEntity>>> GetParentFilter<TEntity>(
            this IQueryable<TEntity> queryable,
            string? parentIdPropName,
            AppDbContext db,
            DbSetConfig? config,
            ParentFilter parentFilter) where TEntity : IdEntityBase
        {
            if (config == null)
                return MyResults<IQueryable<TEntity>>.Error(LogHelper.Instance.IsNull(nameof(config)));

            if (string.IsNullOrEmpty(parentIdPropName))
                return MyResults<IQueryable<TEntity>>.Error(LogHelper.Instance.IsNullOrEmpty(nameof(parentIdPropName)));

            var resGetParentIds = await GetParentIds(
                db,
                config,
                parentFilter);
            var parentIds = resGetParentIds.Data;
            if (parentIds == null && resGetParentIds.IsSuccess) // 无需筛选
                return MyResults<IQueryable<TEntity>>.Success(null, queryable);
            else if (parentIds == null)
                return MyResults<IQueryable<TEntity>>.Error(resGetParentIds.Message);

            var res = queryable.GetOnlyFilter(new PropFilter()
            {
                PropName = parentIdPropName,
                Values = parentIds.Cast<object>().ToList()
            });

            if (res.Data == null)
                return MyResults<IQueryable<TEntity>>.Error(LogHelper.Instance.Error(res.Message));

            queryable = res.Data;

            return MyResults<IQueryable<TEntity>>.Success(null, queryable);
        }
        #endregion

        #region 获取“父表ID”集合
        public static async Task<MyActionResult<List<long>>> GetParentIds(
            AppDbContext db,
            DbSetConfig config,
            ParentFilter parentFilter)
        {
            if (parentFilter.Id != null || parentFilter.Ids != null) // 无需向上筛选
            {
                var ids = new List<long>();
                if (parentFilter.Id != null) ids.Add(parentFilter.Id.Value);
                if (parentFilter.Ids != null) ids.AddRange(parentFilter.Ids);
                return MyResults<List<long>>.Success(null, ids);
            }
            else if (parentFilter.Parent == null || config.Parent == null) // 已到顶级
                return MyResults<List<long>>.Success(null, null);

            // 继续向上获取父表ID集合:
            var resGetParentIds = await GetParentIds(
                db,
                config.Parent,
                parentFilter.Parent);
            var grandIds = resGetParentIds.Data;
            if (grandIds == null)
                return resGetParentIds;

            if (grandIds.Count < 1) return MyResults<List<long>>.Success(null, []);

            // 获取父表ID集合:
            var queryableParent = db.GetDbSet(config.DbSetName) as IQueryable<IdEntityBase>;
            if (queryableParent == null)
                return MyResults<List<long>>.Error(LogHelper.Instance.IsNull(nameof(queryableParent)));

            if (string.IsNullOrEmpty(config.ParentIdPropName))
                return MyResults<List<long>>.Error(LogHelper.Instance.IsNullOrEmpty(nameof(config.ParentIdPropName)));

            var resGetFilter = GetFilter(config.EntityType, queryableParent, new PropFilter()
            {
                PropName = config.ParentIdPropName,
                Values = grandIds.Cast<object>().ToList()
            });
            queryableParent = resGetFilter.Data as IQueryable<IdEntityBase>;
            if (queryableParent == null)
                return MyResults<List<long>>.Error(resGetFilter.Message);

            return MyResults<List<long>>.Success(null, await queryableParent.Select(i => i.Id).ToListAsync());
        }
        #endregion
    }
}
