using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    public abstract class IndexEntity
    {
        [SnakeColumn]
        public int Index { get; set; }
    }
}
