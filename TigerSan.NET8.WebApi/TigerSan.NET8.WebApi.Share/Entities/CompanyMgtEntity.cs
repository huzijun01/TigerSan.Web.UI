using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("company_mgt")]
    public class CompanyMgtEntity : IdEntity
    {
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string Addr { get; set; } = string.Empty;
        [SnakeColumn]
        public long? Parent { get; set; }
    }
}
