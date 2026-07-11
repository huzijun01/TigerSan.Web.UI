using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class AssetLngLat
    {
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public long? Site { get; set; }
        public string? Address { get; set; }
        public DateTime ReportTime { get; set; }
        public LocationModes? LocationMode { get; set; }
    }

    public class AssetPosition : IdEntityBase
    {
        public string AssetId { get; set; } = string.Empty;
        public long? LastRecord { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public DateTime? ReportTime { get; set; }
        public LocationModes? LocationMode { get; set; }
    }
}
