using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("person")]
    public class PersonEntity : RoleEntityBase
    {
        [SnakeColumn]
        public string Username { get; set; } = string.Empty;
        [SnakeColumn]
        public string Nickname { get; set; } = string.Empty;
        [SnakeColumn]
        public string Password { get; set; } = string.Empty;
        [SnakeColumn]
        public string? Photo { get; set; }
    }
}
