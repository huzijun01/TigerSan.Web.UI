using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAdminService : IIdNameServiceBase<AdminEntity>
    {
        public Task<MyActionResult<AdminEntity>> GetByName(string name, bool clearPassword = true);
    }
}
