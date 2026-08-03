using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("binding_record")]
    public class BindingRecordEntity : IdEntityBase
    {
        [SnakeColumn]
        public bool IsBinding { get; set; }
        [SnakeColumn]
        public long Asset { get; set; }
        [SnakeColumn]
        public long? Tag { get; set; }
        [SnakeColumn]
        public long? Station { get; set; }
        [SnakeColumn]
        public DateTime Time { get; set; } = DateTimeHelper.GetUtcNow();

        #region 【Ctor】
        public BindingRecordEntity() { }

        public BindingRecordEntity(bool isBinding, long asset, long? tag = null, long? station = null, DateTime? time = null)
        {
            IsBinding = isBinding;
            Asset = asset;
            Tag = tag;
            Station = station;
            if (time != null) Time = time.Value;
        }
        #endregion 【Ctor】

        #region 【Functions】
        public bool Equals(BindingRecordEntity entity)
        {
            return IsBinding == entity.IsBinding
                && Asset == entity.Asset 
                && Tag == entity.Tag
                && Station == entity.Station;
        }
        #endregion 【Functions】
    }
}
