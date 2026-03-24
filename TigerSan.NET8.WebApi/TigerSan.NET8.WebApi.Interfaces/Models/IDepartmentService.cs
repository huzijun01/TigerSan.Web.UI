using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IDepartmentService : IIdNameServiceBase<DepartmentEntity>
    {
        public Task<CompanyEntity?> GetCompany(long department);
        public Task<IList<CompanyEntity>> GetCompanyList(IList<long> departments);
    }
}
