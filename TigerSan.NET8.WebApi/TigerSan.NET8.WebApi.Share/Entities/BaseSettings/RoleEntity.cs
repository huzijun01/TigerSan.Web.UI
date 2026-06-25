using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("role")]
    public class RoleEntity : IdNameEntityBase
    {
        [SnakeColumn]
        public long Department { get; set; }
    }
}
