using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;
using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("base_station")]
    public class BaseStationEntity : IdEntityBase
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
