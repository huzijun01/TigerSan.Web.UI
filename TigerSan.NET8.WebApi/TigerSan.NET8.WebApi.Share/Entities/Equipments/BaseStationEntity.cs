using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("base_station")]
    public class BaseStationEntity : IdNameEntityBase
    {
        [SnakeColumn]
        public long Site { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public bool IsEnable { get; set; } = false;
        [SnakeColumn]
        public OnlineState OnlineState { get; set; } = OnlineState.Offline;
        [SnakeColumn]
        public string MacAddr { get; set; } = string.Empty;
        [SnakeColumn]
        public int HeartbeatInterval { get; set; }
        [SnakeColumn]
        public int ReportInterval { get; set; }
        [SnakeColumn]
        public long MonthOffline { get; set; }
        [SnakeColumn]
        public DateTime CreateTime { get; set; } = DateTime.Now;
        [SnakeColumn]
        public DateTime? LastReportTime { get; set; } = null;
    }
}
