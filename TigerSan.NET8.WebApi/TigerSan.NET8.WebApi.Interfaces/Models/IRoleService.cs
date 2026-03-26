using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IRoleService : IIdNameServiceBase<RoleEntity>
    {
        public Task<int> GetCount(long? company = null, long? department = null);
        public Task<List<RoleAuthorityEntity>> GetFullList(long? company = null, long? department = null, int? pageSize = null, int? pageNumber = null);
        public Task<IList<IdName>> GetCompanyList();
        public Task<IList<IdName>> GetDepartmentList(long? company = null);
        public Task<MyActionResult> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult> AddRange(IList<RoleAuthorityEntity> entities, bool isBeginTransaction = true);
        public Task<MyActionResult> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true);
    }
}
