using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("base_station")]
    public class BaseStationEntity : IdName
    {
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public long Site { get; set; }
        [SnakeColumn]
        public bool IsEnable { get; set; } = false;
        [SnakeColumn]
        public bool IsMobile { get; set; } = false;
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; } = OnlineStates.Offline;
        [SnakeColumn]
        public string MacAddr { get; set; } = string.Empty;
        [SnakeColumn]
        public int HeartbeatInterval { get; set; }
        [SnakeColumn]
        public int ReportInterval { get; set; }
        [SnakeColumn]
        public long MonthOffline { get; set; }
        [SnakeColumn]
        public DateTime CreateTime { get; set; } = DateTimeHelper.GetUtcNow();
        [SnakeColumn]
        public DateTime? ReportTime { get; set; } = null;
        [SnakeColumn]
        public LocationModes? LocationMode { get; set; }
        [SnakeColumn]
        public double? Longitude { get; set; }
        [SnakeColumn]
        public double? Latitude { get; set; }
        [SnakeColumn]
        public string? Image { get; set; }
    }
}
