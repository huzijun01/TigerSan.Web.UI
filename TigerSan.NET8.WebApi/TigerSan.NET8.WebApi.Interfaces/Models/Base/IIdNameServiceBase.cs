using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IIdNameServiceBase<TEntity> : IIdServiceBase<TEntity> where TEntity : IdName
    {
        // 查:
        /// <summary>获取“ID名称对”集合</summary>
        public Task<MyActionResult<List<IdName>>> SelectIdName(bool? isDistinct = null, FilterDto? filter = null);
    }
}
