using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IRoleService : IIdNameServiceBase<RoleEntity>
    {
        public Task<List<RoleAuthorityEntity>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongDepartmentList(long? company = null);
        public Task<MyActionResult<object>> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<RoleAuthorityEntity> entities, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true);
    }
}
