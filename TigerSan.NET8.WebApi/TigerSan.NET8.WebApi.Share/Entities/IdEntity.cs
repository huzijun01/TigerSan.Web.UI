using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share.Attributes;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [PrimaryKey(nameof(Id))]
    public abstract class IdEntity
    {
        [Key]
        [SnakeColumn]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
    }
}
