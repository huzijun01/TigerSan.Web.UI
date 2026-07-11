using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IDepartmentService : IIdNameServiceBase<DepartmentEntity>
    {
        public Task<MyActionResult<List<IdName>>> GetBelongCompanyList(List<CompanyEntity>? AccessibleCompanies);
        public Task<Dictionary<long, DepartmentInfo>> GetDepartmentInfoDict(List<long> ids);
    }
}
