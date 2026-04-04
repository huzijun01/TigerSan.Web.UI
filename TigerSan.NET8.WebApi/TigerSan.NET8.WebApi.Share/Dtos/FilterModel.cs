namespace TigerSan.NET8.WebApi.Share.Dtos
{
    /// <summary>“过滤器”模型</summary>
    public class FilterModel
    {
        public string PropName { get; set; } = string.Empty;
        public List<object> Values { get; set; } = new List<object>();
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
