using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ICompanyService : IIdNameServiceBase<CompanyEntity>
    {
        public Task<List<long>> GetSubCompanyIds(long id);
    }
}
