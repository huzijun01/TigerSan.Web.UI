using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("company")]
    public class CompanyEntity : IdName
    {
        [SnakeColumn]
        public string Addr { get; set; } = string.Empty;
        [SnakeColumn]
        public long? Parent { get; set; } = null;
    }
}
