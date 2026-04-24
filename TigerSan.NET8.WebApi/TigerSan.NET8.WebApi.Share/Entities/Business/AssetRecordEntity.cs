using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("asset_record")]
    public class AssetRecordEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Asset { get; set; }
        [SnakeColumn]
        public long Tag { get; set; }
        [SnakeColumn]
        public AssetStates State { get; set; } = AssetStates.NoRecord;
        // Tag:
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; } = OnlineStates.Offline;
        [SnakeColumn]
        public long? Site { get; set; }
        [SnakeColumn]
        public long? TargetSite { get; set; }
        [SnakeColumn]
        public long? Station { get; set; }
        [SnakeColumn]
        public int? Battery { get; set; }
        [SnakeColumn]
        public int? Signal { get; set; }
        [SnakeColumn]
        public double? Temperature { get; set; }
        [SnakeColumn]
        public double? Longitude { get; set; }
        [SnakeColumn]
        public double? Latitude { get; set; }
        [SnakeColumn]
        public DateTime ReportTime { get; set; }
    }
}
