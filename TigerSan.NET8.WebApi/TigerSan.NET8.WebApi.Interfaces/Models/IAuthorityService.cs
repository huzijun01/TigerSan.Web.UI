using TigerSan.NET8.WebApi.Interfaces.Models.Base;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAuthorityService : IIdServiceBase<AuthorityEntity>
    {
        public Task<List<AuthorityEntity>> FilterByRole(long role, int? pageSize = null, int? pageNumber = null);
    }
}
