using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("asset")]
    public class AssetEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Department { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public long State { get; set; }
        [SnakeColumn]
        public string AssetId { get; set; } = string.Empty;
        [SnakeColumn]
        public long? Tag { get; set; }
        [SnakeColumn]
        public string? Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;
        [SnakeColumn]
        public DateTime? BindingTime { get; set; }
    }
}
