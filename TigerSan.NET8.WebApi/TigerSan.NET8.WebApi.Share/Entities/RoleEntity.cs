using TigerSan.NET8.WebApi.Share.Attributes;
using TigerSan.NET8.WebApi.Share.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("role")]
    public class RoleEntity : IdNameEntityBase
    {
        [SnakeColumn]
        public long Department { get; set; }
    }
}
