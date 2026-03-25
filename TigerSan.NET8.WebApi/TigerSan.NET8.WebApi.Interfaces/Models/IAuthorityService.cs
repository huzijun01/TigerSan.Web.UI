using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAuthorityService : IIdServiceBase<AuthorityEntity>
    {
        public Task<List<AuthorityEntity>> GetList(long? role = null, int? pageSize = null, int? pageNumber = null);
    }
}
