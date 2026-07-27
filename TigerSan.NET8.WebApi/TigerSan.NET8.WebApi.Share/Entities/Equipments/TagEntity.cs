using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    /// <summary>设备类型</summary>
    public enum EqpTypes
    {
        /// <summary>标签</summary>
        Tag = 0,
        /// <summary>定位器</summary>
        Locator = 1,
    }

    /// <summary>定位模式</summary>
    public enum LocateModes
    {
        /// <summary>基站</summary>
        BaseStation = 0,
        /// <summary>移动基站</summary>
        CellTower = 1,
        /// <summary>卫星</summary>
        Satellite = 2,
        /// <summary>WiFi</summary>
        WiFi = 3,
        /// <summary>WiFi+蓝牙</summary>
        WiFi_Bluetooth = 4,
        /// <summary>移动基站+蓝牙</summary>
        CellTower_Bluetooth = 5,
    }

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
        public bool? IsFall { get; set; }
        [SnakeColumn]
        public bool IsEnable { get; set; } = false;
        [SnakeColumn]
        public EqpTypes EqpType { get; set; } = EqpTypes.Tag;
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; } = OnlineStates.Offline;
        [SnakeColumn]
        public LocationModes? LocationMode { get; set; }
        [SnakeColumn]
        public string TagId { get; set; } = string.Empty;
        [SnakeColumn]
        public long? Asset { get; set; }
        [SnakeColumn]
        public string? AssetId { get; set; }
        [SnakeColumn]
        public string? Rfid { get; set; }
        [SnakeColumn]
        public string? Imei { get; set; }
        [SnakeColumn]
        public string? Iccid { get; set; }
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
        public string? Comment { get; set; }
        [SnakeColumn]
        public DateTime? ReportTime { get; set; }
        [SnakeColumn]
        public string? Image { get; set; }
    }
}
