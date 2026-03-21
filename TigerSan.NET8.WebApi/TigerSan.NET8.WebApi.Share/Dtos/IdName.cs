using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    /// <summary>ID名称对</summary>
    public class IdName
    {
        public long Id { get; set; }
        public string Name { get; set; }

        public IdName(long id, string name)
        {
            Id = id;
            Name = name;
        }

        public IdName(IdNameEntityBase idName)
        {
            Id = idName.Id;
            Name = idName.Name;
        }
    }
}
