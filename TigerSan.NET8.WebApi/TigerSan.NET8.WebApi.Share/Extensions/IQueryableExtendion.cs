using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class IQueryableExtendion
    {
        #region 获取“单页数据”
        /// <summary>获取“单页数据”</summary>
        public static IQueryable<TEntity> GetPage<TEntity>(this IQueryable<TEntity> queryable, int pageSize, int pageNumber) where TEntity : IdEntityBase
        {
            return queryable
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize);
        }
        #endregion
    }
}
