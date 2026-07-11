using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("binding_record")]
    public class BindingRecordEntity : IdEntityBase
    {
        [SnakeColumn]
        public long Tag { get; set; }
        [SnakeColumn]
        public long Asset { get; set; }
        [SnakeColumn]
        public bool IsBinding { get; set; }
        [SnakeColumn]
        public DateTime Time { get; set; } = DateTimeHelper.GetUtcNow();

        #region 【Ctor】
        public BindingRecordEntity() { }

        public BindingRecordEntity(long tag, long asset, bool isBinding, DateTime? time)
        {
            Tag = tag;
            Asset = asset;
            IsBinding = isBinding;
            if (time != null) Time = time.Value;
        }
        #endregion 【Ctor】

        #region 【Functions】
        public bool Equals(BindingRecordEntity entity)
        {
            return Tag == entity.Tag && Asset == entity.Asset && IsBinding == entity.IsBinding;
        }
        #endregion 【Functions】
    }
}
