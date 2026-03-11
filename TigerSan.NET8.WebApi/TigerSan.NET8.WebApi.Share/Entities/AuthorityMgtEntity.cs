using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("authority_mgt")]
    public class AuthorityMgtEntity : IndexEntity
    {
        [SnakeColumn]
        public string NavFolder { get; set; } = string.Empty;
        [SnakeColumn]
        public string? NavButtons { get; set; }
    }
}
