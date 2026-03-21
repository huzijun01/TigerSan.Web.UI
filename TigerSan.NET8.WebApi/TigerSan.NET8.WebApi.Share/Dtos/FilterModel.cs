using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class FilterModel<TEntity, TField> where TEntity : IdEntityBase
    {
        public Func<TEntity, TField> Selector;
        public List<TField> Values { get; set; } = new List<TField>();

        public FilterModel(Func<TEntity, TField> selector)
        {
            Selector = selector;
        }

        public bool IsMatch(TEntity entity)
        {
            return Values.Contains(Selector(entity));
        }
    }

    /// <summary>ID值对</summary>
    public class IdValue<TField>
    {
        public long Id { get; set; }
        public TField Value { get; set; }

        public IdValue(TField value)
        {
            Value = value;
        }
    }
}
