using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [PrimaryKey(nameof(Id))]
    public abstract class CompanyEntityBase : IdNameEntityBase
    {
        [SnakeColumn]
        public long Company { get; set; }
    }
}
