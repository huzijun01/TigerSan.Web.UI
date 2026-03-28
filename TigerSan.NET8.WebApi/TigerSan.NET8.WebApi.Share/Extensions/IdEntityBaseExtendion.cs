using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class IdEntityBaseExtendion
    {
        public static void UpdateId<TEntity>(this List<TEntity> entities) where TEntity : IdEntityBase
        {
            foreach (var entity in entities)
            {
                entity.UpdateId();
            }
        }
    }
}
