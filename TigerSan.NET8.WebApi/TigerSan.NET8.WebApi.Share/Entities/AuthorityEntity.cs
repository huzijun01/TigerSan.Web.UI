using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;
using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("authority")]
    public class AuthorityEntity : RoleEntityBase
    {
        [SnakeColumn]
        public string Path { get; set; } = string.Empty;
        [SnakeColumn]
        public bool IsReadonly { get; set; } = false;
    }
}
