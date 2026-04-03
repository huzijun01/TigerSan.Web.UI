using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface ISiteService : IIdNameServiceBase<SiteEntity>
    {
        public Task<int> GetCount(long? company = null, long? type = null);
        public Task<List<SiteEntity>> GetList(long? company = null, long? type = null, int? pageSize = null, int? pageNumber = null);
        public Task<List<IdName>> SelectIdNameByCompany(long? company = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongSiteTypeList(long? company = null);
    }
}
