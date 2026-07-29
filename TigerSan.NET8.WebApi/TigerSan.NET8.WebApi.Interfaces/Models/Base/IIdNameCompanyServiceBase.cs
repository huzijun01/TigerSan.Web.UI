using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IIdNameCompanyServiceBase<TEntity> : IIdNameServiceBase<TEntity> where TEntity : IdNameCompany
    {
    }
}
