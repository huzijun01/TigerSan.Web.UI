using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Helpers;
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
        public string Code { get; set; } = string.Empty;
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
        public List<Point2>? FencePoints { get => MathHelper.GetPoint2s(FencePath); }
        [SnakeColumn]
        public string? Manager { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Phone { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Comment { get; set; } = string.Empty;
        [NotMapped]
        public string FullAddr { get => $"{Addr} {AddrDetail}".Trim(); }
    }
}
