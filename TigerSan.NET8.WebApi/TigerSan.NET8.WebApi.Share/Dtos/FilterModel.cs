namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class FilterModel
    {
        public string Field { get; set; } = string.Empty;
        public List<object> Values { get; set; } = new List<object>();
    }
}
