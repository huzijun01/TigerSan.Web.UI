using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBaseStationService : IIdNameServiceBase<BaseStationEntity>
    {
        public Task<int> GetCount(long? company = null, long? site = null, OnlineState? state = null, long? type = null);
        public Task<List<BaseStationEntity>> GetList(long? company = null, long? site = null, OnlineState? state = null, long? type = null, int? pageSize = null, int? pageNumber = null);
        public Task<List<BaseStationDto>> GetFullList(long? company = null, long? site = null, OnlineState? state = null, long? type = null, int? pageSize = null, int? pageNumber = null);
        public Task<List<IdName>> GetBelongCompanyList();
        public Task<List<IdName>> GetBelongSiteList(long? company = null);
        public Task<List<IdName>> GetBelongStationTypeList(long? company = null, long? site = null);
    }
}
