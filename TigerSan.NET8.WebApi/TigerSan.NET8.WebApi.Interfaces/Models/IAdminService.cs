using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IAdminService : IIdNameServiceBase<AdminEntity>
    {
        public Task<MyActionResult<AdminEntity>> GetByName(string name, string password);
    }
}
