using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IRoleService : IIdNameServiceBase<RoleEntity>
    {
        public Task<MyActionResult> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult> AddRange(IList<RoleAuthorityEntity> entities, bool isBeginTransaction = true);
    }
}
