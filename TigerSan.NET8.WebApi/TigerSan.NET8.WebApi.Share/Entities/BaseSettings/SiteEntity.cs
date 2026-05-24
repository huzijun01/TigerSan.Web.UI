using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.JsonConverter;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("site")]
    public class SiteEntity : IdNameEntityBase
    {
        [SnakeColumn]
        public long Company { get; set; }
        [SnakeColumn]
        public long Type { get; set; }
        [SnakeColumn]
        public string Addr { get; set; } = string.Empty;
        [SnakeColumn]
        public string AddrDetail { get; set; } = string.Empty;
        [SnakeColumn]
        public double Longitude { get; set; }
        [SnakeColumn]
        public double Latitude { get; set; }
        [SnakeColumn]
        public string? FencePath { get; set; }
        [NotMapped]
        public List<List<(double X, double Y)>>? Fence { get => GetFence(); }
        [SnakeColumn]
        public string? Manager { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Phone { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;

        #region 获取围栏
        /// <summary>获取围栏</summary>
        List<List<(double X, double Y)>>? GetFence()
        {
            if (FencePath == null) return null;
            return JsonHelper.Deserialize<List<List<(double X, double Y)>>>(FencePath);
        }
        #endregion
    }
}
