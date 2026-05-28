using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("batch")]
    public class BatchEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Company { get; set; }
        [SnakeColumn]
        public long Scenario { get; set; }
        [SnakeColumn]
        public string BatchId { get; set; } = string.Empty;
        [SnakeColumn]
        public DateTime ShipmentTime { get; set; } = DateTimeHelper.GetUtcNow();
        [SnakeColumn]
        public string? Manager { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Phone { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;
    }
}
