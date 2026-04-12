using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("tag")]
    public class TagEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Batch { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public long? Station { get; set; }
        [SnakeColumn]
        public bool IsEnable { get; set; } = false;
        [SnakeColumn]
        public OnlineState OnlineState { get; set; } = OnlineState.Offline;
        [SnakeColumn]
        public string TagId { get; set; } = string.Empty;
        [SnakeColumn]
        public string? BrandId { get; set; } = string.Empty;
        [SnakeColumn]
        public int? Battery { get; set; }
        [SnakeColumn]
        public double? Temperature { get; set; }
        [SnakeColumn]
        public int? Signal { get; set; }
        [SnakeColumn]
        public string? Comment { get; set; }
        [SnakeColumn]
        public DateTime? LastReportTime { get; set; } = null;
    }
}
