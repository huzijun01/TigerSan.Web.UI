using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    public class IdNameCompany : IdName
    {
        [SnakeColumn]
        public long Company { get; set; }
        [NotMapped]
        public string CompanyName { get; set; } = string.Empty;
    }
}
