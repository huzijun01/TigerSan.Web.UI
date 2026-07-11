using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [PrimaryKey(nameof(Id))]
    public abstract class IdEntityBase
    {
        [Key]
        [SnakeColumn]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public void UpdateId()
        {
            Id = Uuid7Generator.GenerateLong();
        }
    }
}
