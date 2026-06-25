using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IPersonService : IIdServiceBase<PersonEntity>
    {
        public Task<MyActionResult<PersonFullEntity>> GetLoginFull(string search, bool clearPassword = true);
        public Task<MyActionResult<List<PersonFullEntity>>> GetFullList(
            string? name = null,
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<List<IdName>>> GetBelongCompanyList(List<CompanyEntity>? accessibleCompanies);
        public Task<MyActionResult<List<IdName>>> GetBelongDepartmentList(long? company = null);
        public Task<MyActionResult<List<IdName>>> GetBelongRoleList(long? department = null);
    }
}
