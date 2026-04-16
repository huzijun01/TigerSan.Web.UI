using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class BaseStationDto : BaseStationEntity
    {
        public long Company { get; set; }
        public string Addr { get; set; } = string.Empty;
    }
}
