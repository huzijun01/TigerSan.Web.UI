using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class TagDto : TagEntity
    {
        public long? Company { get; set; }
        public string? CompanyName { get; set; } = string.Empty;
    }
}
