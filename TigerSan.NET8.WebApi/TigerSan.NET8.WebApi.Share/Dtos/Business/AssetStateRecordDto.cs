using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class AssetStateRecordDto : AssetStateRecordEntity
    {
        public string CompanyName { get; set; } = string.Empty;
        public double NoRecordPerc { get => Math.Round((double)NoRecord / Count * 100, 2); }
        public double InboundPerc { get => Math.Round((double)Inbound / Count * 100, 2); }
        public double InStorePerc { get => Math.Round((double)InStore / Count * 100, 2); }
        public double StolidPerc { get => Math.Round((double)Stolid / Count * 100, 2); }
        public double OutboundPerc { get => Math.Round((double)Outbound / Count * 100, 2); }
        public double InTransitPerc { get => Math.Round((double)InTransit / Count * 100, 2); }
        public double TimeoutPerc { get => Math.Round((double)Timeout / Count * 100, 2); }
    }
}
