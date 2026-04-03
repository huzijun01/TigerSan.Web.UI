using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models.Base
{
    public interface IIdNameServiceBase<TEntity> : IIdServiceBase<TEntity> where TEntity : IdNameEntityBase
    {
        // 查:
        public Task<List<IdName>> SelectIdName(bool? isDistinct);
    }
}
