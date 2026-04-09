using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAuthorityService : IIdServiceBase<AuthorityEntity>
    {
        public Task<List<AuthorityEntity>> GetListByRole(long? role = null, int? pageSize = null, int? pageNumber = null);
    }
}
