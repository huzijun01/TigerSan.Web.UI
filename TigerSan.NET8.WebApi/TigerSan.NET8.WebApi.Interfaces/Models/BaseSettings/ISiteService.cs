using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ISiteService : IIdNameServiceBase<SiteEntity>
    {
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongSiteTypeList(long? company = null);
    }
}
