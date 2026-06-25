using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class IdEntityBaseExtendion
    {
        public static void UpdateId<TEntity>(this List<TEntity> entities, Action<TEntity>? init = null) where TEntity : IdEntityBase
        {
            foreach (var entity in entities)
            {
                entity.UpdateId();
                init?.Invoke(entity);
            }
        }
    }
}
