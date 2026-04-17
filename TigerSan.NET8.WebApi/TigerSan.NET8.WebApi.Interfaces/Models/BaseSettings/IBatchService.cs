using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBatchService : IIdServiceBase<BatchEntity>
    {
        public Task<CompanyEntity?> GetCompany(long id);
        public Task<Dictionary<long, CompanyEntity>> GetCompanyDict(List<long> ids);
    }
}
