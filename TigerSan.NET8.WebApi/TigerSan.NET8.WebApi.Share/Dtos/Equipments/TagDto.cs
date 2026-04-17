using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class TagDto : TagEntity
    {
        public long? Company { get; set; }
        public string? CompanyName { get; set; } = string.Empty;
        public long? Site { get; set; }
        public string? SiteName { get; set; } = string.Empty;
    }
}
