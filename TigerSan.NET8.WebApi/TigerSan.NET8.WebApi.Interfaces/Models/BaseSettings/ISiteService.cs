using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ISiteService : IIdNameServiceBase<SiteEntity>
    {
        public Task<MyActionResult<List<IdName>>> GetBelongCompanyList(List<CompanyEntity>? accessibleCompanies);
        public Task<MyActionResult<List<IdName>>> GetBelongSiteTypeList(long? company = null);
    }
}
