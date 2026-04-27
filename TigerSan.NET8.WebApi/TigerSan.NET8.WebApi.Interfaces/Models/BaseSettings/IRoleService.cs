using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IRoleService : IIdNameServiceBase<RoleEntity>
    {
        public Task<MyActionResult<List<RoleAuthorityEntity>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<List<IdName>>> GetBelongCompanyList();
        public Task<MyActionResult<List<IdName>>> GetBelongDepartmentList(long? company = null);
        public Task<MyActionResult<object>> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<RoleAuthorityEntity> entities, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true);
    }
}
