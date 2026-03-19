using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("admin_mgt")]
    public class AdminMgtEntity : IdEntity
    {
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string Password { get; set; } = string.Empty;
        [SnakeColumn]
        public bool IsRoot { get; set; } = false;
        [SnakeColumn]
        public long? Company { get; set; }
    }
}
