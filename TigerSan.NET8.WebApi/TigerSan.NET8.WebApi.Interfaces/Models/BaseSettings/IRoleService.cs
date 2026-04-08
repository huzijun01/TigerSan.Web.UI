using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IRoleService : IIdNameServiceBase<RoleEntity>
    {
        public Task<int> GetCount(long? company = null, long? department = null);
        public Task<List<RoleEntity>> GetList(long? department, int? pageSize = null, int? pageNumber = null);
        public Task<List<RoleAuthorityEntity>> GetFullList(long? company = null, long? department = null, int? pageSize = null, int? pageNumber = null);
        public Task<List<IdName>> SelectIdNameByDepartment(long? department = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> BelongDepartmentList(long? company = null);
        public Task<MyActionResult<object>> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<RoleAuthorityEntity> entities, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true);
    }
}
