using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities.Base
{
    [PrimaryKey(nameof(Id))]
    public abstract class IdNameEntityBase : IdEntityBase
    {
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;

        #region 【Ctor】
        public IdNameEntityBase()
        {
        }

        public IdNameEntityBase(long id, string name)
        {
            Id = id;
            Name = name;
        }
        #endregion 【Ctor】
    }
}
