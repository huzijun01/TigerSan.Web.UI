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

        #region 【Helpers】
        #region 转换类型
        /// <summary>转换类型</summary>
        public static bool TryParse(Type type, string? input, out object result)
        {
            result = new object();
            try
            {
                if (input == null) return false;

                Type underlyingType = Nullable.GetUnderlyingType(type) ?? type;

                if (underlyingType.IsEnum)
                {
                    return TryParseEnum(underlyingType, input, out result);
                }

                var converter = TypeDescriptor.GetConverter(underlyingType);
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

        #region 转换“枚举”
        /// <summary>转换“枚举”</summary>
        private static bool TryParseEnum(Type enumType, string input, out object result)
        {
            result = new object();
            try
            {
                if (char.IsDigit(input[0]) || input.StartsWith("-") && char.IsDigit(input[1]))
                {
                    if (Enum.IsDefined(enumType, Convert.ToInt32(input)))
                    {
                        result = Enum.ToObject(enumType, Convert.ToInt32(input));
                        return true;
                    }
                }
                else
                {
                    var enumValue = Enum.Parse(enumType, input, ignoreCase: true);
                    result = enumValue;
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
        #endregion
        #endregion 【Helpers】

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

                // 不选择:
                if (filter.Values.Count() < 1)
                    return MyResults<IQueryable>.Success(null, queryable.False());

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

                // 创建“=”表达式:
                Func<object, Expression> selector;
                if (propertyType == typeof(string))
                {
                    if (string.IsNullOrEmpty(filter.Value?.ToString()))
                        return MyResults<IQueryable>.Success(null, queryable);

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
                            return MethodPicker.GetThrow($"TryParse error!({propertyType.Name})");

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
            // 添加单值:
            if (parentFilter.Id != null)
            {
                if (parentFilter.Ids == null)
                {
                    parentFilter.Ids = new List<long>();
                }
                parentFilter.Ids.Add(parentFilter.Id.Value);
            }

            if (parentFilter.Ids != null && parentFilter.Ids.Count > 0) // 无需向上筛选
                return MyResults<List<long>>.Success(null, parentFilter.Ids);
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
