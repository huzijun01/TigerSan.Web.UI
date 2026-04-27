using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBatchService : IIdServiceBase<BatchEntity>
    {
        public Task<MyActionResult<CompanyEntity>> GetCompany(long id);
        public Task<MyActionResult<Dictionary<long, CompanyEntity>>> GetCompanyDict(List<long> ids);
    }
}
