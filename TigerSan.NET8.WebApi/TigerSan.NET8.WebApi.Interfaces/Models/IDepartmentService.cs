using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IDepartmentService : IIdNameServiceBase<DepartmentEntity>
    {
        public Task<int> GetCount(long? company = null);
        public Task<List<DepartmentEntity>> GetList(long? company = null, int? pageSize = null, int? pageNumber = null);
        public Task<List<IdName>> SelectIdNameByCompany(long? company = null);
        public Task<List<IdName>> GetBelongCompanyList();
    }
}
