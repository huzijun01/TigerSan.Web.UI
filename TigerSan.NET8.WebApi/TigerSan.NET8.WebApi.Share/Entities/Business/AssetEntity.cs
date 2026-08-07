using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("asset")]
    public class AssetEntity : IdEntityBase
    {
        [SnakeColumn]
        public string AssetId { get; set; } = string.Empty;
        [SnakeColumn]
        public long Department { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public long? Tag { get; set; }
        [SnakeColumn]
        public string? TagId { get; set; }
        [SnakeColumn]
        public long? Vehicle { get; set; }
        [SnakeColumn]
        public long? Transfer { get; set; }
        [SnakeColumn]
        public bool IsAuto { get; set; } = true;
        [SnakeColumn]
        public string? Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;
        [SnakeColumn]
        public ErrorTypes? ErrorType { get; set; }
        [SnakeColumn]
        public DateTime? BindingTime { get; set; }
        // Tag:
        [SnakeColumn]
        public OnlineStates OnlineState { get; set; }
        [SnakeColumn]
        public bool? IsFall { get; set; } = false;
        [SnakeColumn]
        public long? TagType { get; set; }
        [SnakeColumn]
        public long? Station { get; set; }
        [SnakeColumn]
        public string? StationId { get; set; }
        // 记录:
        [SnakeColumn]
        public long? LastRecord { get; set; } // 计算时才更新，建议使用GetLast获取最新记录
        [SnakeColumn]
        public AssetStates State { get; set; }
        // 计算:
        [SnakeColumn]
        public DateTime? CalculationTime { get; set; }
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

        #region 复制（标签）
        public void Copy(TagEntity? tag, string? stationId)
        {
            if (tag == null)
            {
                Tag = null;
                TagId = null;
                TagType = null;
                Station = null;
                StationId = null;
            }
            else
            {
                OnlineState = tag.OnlineState;
                IsFall = tag.IsFall;
                TagType = tag.Type;
                Station = tag.Station;
                StationId = stationId;
            }
        }
        #endregion

        #region 复制（记录）
        public void Copy(AssetRecordEntity? record)
        {
            if (record == null)
            {
                LastRecord = null;
                State = AssetStates.NoRecord;
            }
            else
            {
                LastRecord = record.Id;
                State = record.State;
            }
        }
        #endregion
    }
}
