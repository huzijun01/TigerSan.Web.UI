using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("role_mgt")]
    public class RoleMgtEntity : IndexEntity
    {
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;
        [SnakeColumn]
        public string? NavFolders { get; set; }
        [SnakeColumn]
        public string? NavButtons { get; set; }
        [SnakeColumn]
        public string? ReadonlyButtons { get; set; }
    }
}
