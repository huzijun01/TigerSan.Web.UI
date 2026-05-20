using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class AssetPosition : IdEntityBase
    {
        public string AssetId { get; set; } = string.Empty;
        public long? Type { get; set; }
        public long? LastRecord { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public DateTime? ReportTime { get; set; }
    }
}
