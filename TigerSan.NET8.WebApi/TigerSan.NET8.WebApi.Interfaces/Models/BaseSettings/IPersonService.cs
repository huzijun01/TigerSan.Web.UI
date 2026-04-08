using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IPersonService : IIdServiceBase<PersonEntity>
    {
        public Task<MyActionResult<PersonFullEntity>> GetLoginFull(string search, string password);
        public Task<List<PersonFullEntity>> GetFullList(
            string? name = null,
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongDepartmentList(long? company = null);
        public Task<List<IdName>> GetBelongRoleList(long? department = null);
    }
}
