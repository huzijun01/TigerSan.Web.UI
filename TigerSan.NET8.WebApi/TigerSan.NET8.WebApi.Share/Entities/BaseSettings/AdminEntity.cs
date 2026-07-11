using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("admin")]
    public class AdminEntity : IdNameEntityBase
    {
        [NotMapped]
        public string Password { get; set; } = string.Empty;
        [Column("password")]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
