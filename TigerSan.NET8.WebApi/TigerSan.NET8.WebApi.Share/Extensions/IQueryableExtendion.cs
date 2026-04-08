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
                LogHelper.Instance.Warning($"The execution of the Where method failed:{Environment.NewLine}{tie.GetMessage()}");
                return null;
            }
            catch (ArgumentException ae)
            {
                LogHelper.Instance.Warning($"Type parameter mismatch:{Environment.NewLine}{ae.GetMessage()}");
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

                if (type.IsEnum)
                {
                    return TryParseEnum(type, input, out result);
                }

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
                var propertyInfo = entityType.GetProperty(filter.PropName, BindingFlags.Public | BindingFlags.Instance);
                if (propertyInfo == null)
                {
                    LogHelper.Instance.Warning($"Property '{filter.PropName}' not found on type '{entityType.Name}'");
                    return queryable.False();
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
                    if (string.IsNullOrEmpty(filter.Value?.ToString())) return queryable;
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
                    return queryable.False();
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
        public static IQueryable<TEntity> GetPage<TEntity>(this IQueryable<TEntity> queryable, int? pageSize, int? pageNumber) where TEntity : IdEntityBase
        {
            if (pageSize == null || pageNumber == null) return queryable;
            return queryable
                    .Skip((pageNumber.Value - 1) * pageSize.Value)
                    .Take(pageSize.Value);
        }
        #endregion

        #region 获取“单过滤器数据”
        /// <summary>获取“单过滤器数据”</summary>
        public static IQueryable<TEntity> GetOnlyFilter<TEntity>(this IQueryable<TEntity> queryable, PropFilter? filters) where TEntity : IdEntityBase
        {
            if (filters == null) return queryable;
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
            DbSetConfig? config,
            ParentFilter parent) where TEntity : IdEntityBase
        {
            if (config == null)
            {
                LogHelper.Instance.IsNull(nameof(config));
                return queryable.False();
            }
            if (parentIdPropName == null)
            {
                LogHelper.Instance.IsNull(nameof(parentIdPropName));
                return queryable.False();
            }

            var parentIds = await GetParentIds(
                db,
                config,
                parent);

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
            DbSetConfig config,
            ParentFilter parent)
        {
            var ids = new List<long>();

            // 添加单值:
            if (parent.Id != null)
            {
                if (parent.Ids == null)
                {
                    parent.Ids = new List<long>();
                }
                parent.Ids.Add(parent.Id.Value);
            }

            if (parent.Ids != null && parent.Ids.Count() > 0) // 无需向上筛选
            {
                return parent.Ids;
            }
            else if (parent.Parent == null || config.Parent == null) // 已到顶级
            {
                return ids;
            }

            // 继续向上获取父表ID集合:
            parent.Ids = await GetParentIds(
                db,
                config.Parent,
                parent.Parent);

            if (parent.Ids.Count() < 1) return ids;

            // 获取父表ID集合:
            var queryableParent = db.GetDbSet(config.DbSetName) as IQueryable<IdEntityBase>;
            if (queryableParent == null)
            {
                LogHelper.Instance.IsNull(nameof(queryableParent));
                return ids;
            }
            if (config.ParentIdPropName == null)
            {
                LogHelper.Instance.IsNull(nameof(config.ParentIdPropName));
                return ids;
            }

            queryableParent = GetFilter(config.EntityType, queryableParent, new PropFilter()
            {
                PropName = config.ParentIdPropName,
                Values = parent.Ids.Cast<object>().ToList()
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
