using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IUserService
    {
        public Task<MyActionResult<UserInfo>> Login(string search, string password);
    }
}
