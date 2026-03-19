using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("role_mgt")]
    public class RoleMgtEntity : IdEntity
    {
        [SnakeColumn]
        public long Company { get; set; }
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;
    }
}
