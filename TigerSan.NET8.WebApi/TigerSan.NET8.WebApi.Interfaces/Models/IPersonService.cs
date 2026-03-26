using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IPersonService : IIdServiceBase<PersonEntity>
    {
        public Task<int> GetCount(long? company = null, long? department = null, long? role = null);
        public Task<List<PersonFullEntity>> GetFullList(long? company = null, long? department = null, long? role = null, int? pageSize = null, int? pageNumber = null);
        public Task<IList<IdName>> GetBelongCompanyList();
        public Task<IList<IdName>> GetBelongDepartmentList(long? company = null);
        public Task<IList<IdName>> GetBelongRoleList(long? department = null);
    }
}
