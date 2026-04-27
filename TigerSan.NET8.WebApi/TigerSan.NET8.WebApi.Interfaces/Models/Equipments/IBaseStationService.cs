using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBaseStationService : IIdNameServiceBase<BaseStationEntity>
    {
        public Task<MyActionResult<List<BaseStationDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
        public Task<MyActionResult<List<IdName>>> GetBelongCompanyList();
        public Task<MyActionResult<List<IdName>>> GetBelongSiteList(long? company = null);
        public Task<MyActionResult<List<IdName>>> GetBelongStationTypeList(long? company = null, long? site = null);
        public Task<MyActionResult<SiteEntity>> GetSite(long id);
        public Task<MyActionResult<Dictionary<long, SiteEntity>>> GetSiteDict(List<long> ids);
    }
}
