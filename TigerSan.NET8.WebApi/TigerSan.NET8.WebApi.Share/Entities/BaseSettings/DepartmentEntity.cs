using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [Table("department")]
    public class DepartmentEntity : IdName
    {
        [SnakeColumn]
        public long Company { get; set; }
    }
}
