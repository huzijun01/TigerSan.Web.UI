using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("person_mgt")]
    public class PersonMgtEntity : IndexEntity
    {
        [SnakeColumn]
        public int Role { get; set; }
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
