using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("base_station_mgt")]
    public class BaseStationMgtEntity : IndexEntity
    {
        [SnakeColumn]
        public string MacAddr { get; set; } = string.Empty;
        [SnakeColumn]
        public string EqpName { get; set; } = string.Empty;
        [SnakeColumn]
        public string EqpType { get; set; } = string.Empty;
        [SnakeColumn]
        public OnlineState OnlineState { get; set; } = OnlineState.Offline;
        [SnakeColumn]
        public DateTime UpdateTime { get; set; } = DateTime.Now;
        [SnakeColumn]
        public string Version { get; set; } = string.Empty;
    }
}
