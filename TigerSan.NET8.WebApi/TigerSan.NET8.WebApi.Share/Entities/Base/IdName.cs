using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share.Attributes;

namespace TigerSan.NET8.WebApi.Share.Entities
{
    [PrimaryKey(nameof(Id))]
    public class IdName : IdEntityBase
    {
        [SnakeColumn]
        public string Name { get; set; } = string.Empty;

        #region 【Ctor】
        public IdName()
        {
        }

        public IdName(long id, string name)
        {
            Id = id;
            Name = name;
        }

        public IdName(IdName idName)
        {
            Id = idName.Id;
            Name = idName.Name;
        }
        #endregion 【Ctor】
    }
}
