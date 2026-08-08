using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("station_record")]
    public class StationRecordEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Station { get; set; }
        [SnakeColumn]
        public DateTime ReportTime { get; set; } = DateTimeHelper.GetUtcNow();
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; } = OnlineStates.Offline;
        [SnakeColumn]
        public LocationModes? LocationMode { get; set; }
        [SnakeColumn]
        public double? Longitude { get; set; }
        [SnakeColumn]
        public double? Latitude { get; set; }
        [SnakeColumn]
        public string? Address { get; set; }

        #region 是否相等
        public bool Equals(StationRecordEntity? other)
        {
            if (other == null) return false;
            return OnlineState == other.OnlineState
                && LocationMode == other.LocationMode
                && Longitude == other.Longitude
                && Latitude == other.Latitude
                && ReportTime.Equals(other.ReportTime);
        }
        #endregion

        #region 复制“基站”状态
        public StationRecordEntity Copy(BaseStationEntity baseStation, string? address)
        {
            Station = baseStation.Id;
            ReportTime = baseStation.ReportTime ?? DateTimeHelper.GetUtcNow();
            OnlineState = baseStation.OnlineState;
            LocationMode = baseStation.LocationMode;
            Longitude = baseStation.Longitude;
            Latitude = baseStation.Latitude;
            Address = address;
            return this;
        }
        #endregion
    }
}
