using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBaseStationService : IIdNameServiceBase<BaseStationEntity>
    {
        public Task<List<BaseStationDto>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            FilterDto? filter = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongSiteList(long? company = null);
        public Task<List<IdName>> GetBelongStationTypeList(long? company = null, long? site = null);
        public Task<SiteEntity?> GetSite(long id);
        public Task<Dictionary<long, SiteEntity>> GetSiteDict(List<long> ids);
    }
}
