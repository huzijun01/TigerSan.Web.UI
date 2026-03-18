using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("authority_mgt")]
    public class AuthorityMgtEntity : IndexEntity
    {
        [SnakeColumn]
        public int Role { get; set; }
        [SnakeColumn]
        public string Path { get; set; } = string.Empty;
        [SnakeColumn]
        public bool IsReadonly { get; set; } = false;
    }
}
