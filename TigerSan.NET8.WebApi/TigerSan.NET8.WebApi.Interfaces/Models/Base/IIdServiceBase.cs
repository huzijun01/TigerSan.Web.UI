using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities.Base;

namespace TigerSan.NET8.WebApi.Interfaces.Models.Base
{
    public interface IIdServiceBase<TEntity> where TEntity : IdEntityBase
    {
        // 查:
        public Task<TEntity?> Get(long id);
        public Task<int> GetCount();
        public Task<List<TEntity>> GetList(int? pageSize = null, int? pageNumber = null);
        public Task<List<TField>> Select<TField>(Func<TEntity, TField> selector, bool isDistinct = false);
        public Task<List<TEntity>> Where<TField>(List<FilterModel<TEntity, TField>> filters, int? pageSize = null, int? pageNumber = null);
        public Task<bool> IsExists(long id);
        public Task<bool> IsExistsRange(List<long> ids);

        // 增:
        public Task<MyActionResult<object>> Add(TEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<TEntity> entities, bool isBeginTransaction = true);

        // 改:
        public Task<MyActionResult<object>> Edit(TEntity entity, bool isBeginTransaction = true);

        // 删:
        public Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true);
        Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true);
    }
}
