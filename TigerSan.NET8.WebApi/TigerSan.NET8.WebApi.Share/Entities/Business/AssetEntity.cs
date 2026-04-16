using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    public class AssetBaseEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Department { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public string AssetId { get; set; } = string.Empty;
        [SnakeColumn]
        public AssetStates State { get; set; }
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; }
        [SnakeColumn]
        public long? Tag { get; set; }
        [SnakeColumn]
        public long? LastRecord { get; set; }
        [SnakeColumn]
        public string? Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;
        [SnakeColumn]
        public DateTime? BindingTime { get; set; }
        [SnakeColumn]
        public DateTime? CalculationTime { get; set; }
    }

    [Table("asset")]
    public class AssetEntity : AssetBaseEntity
    {
        [SnakeColumn]
        public int? DailyMove { get; set; }
        [SnakeColumn]
        public int? MonthlyMove { get; set; }
        [SnakeColumn]
        public int? TotalMove { get; set; }
        [SnakeColumn]
        public double? StayDuration { get; set; }
        [SnakeColumn]
        public double? TravelDuration { get; set; }
        [SnakeColumn]
        public double? OfflineDuration { get; set; }
    }
}
