using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IIdServiceBase<TEntity> where TEntity : IdEntityBase
    {
        // 查:
        public Task<MyActionResult<TEntity>> Get(long id);

        public Task<MyActionResult<int>> GetCount(FilterDto? filter = null);

        public Task<MyActionResult<List<TEntity>>> GetList(List<long> ids);

        public Task<MyActionResult<List<TEntity>>> GetList(
            int? pageSize = null,
            int? pageNumber = null,
            string? propName = null,
            bool? ascending = null,
            FilterDto? filter = null);

        public Task<MyActionResult<List<TField>>> Select<TField>(Func<TEntity, TField> selector, bool isDistinct = false, FilterDto? filter = null);
        public Task<MyActionResult<List<IdValue<TField>>>> SelectIdValue<TField>(
            Func<TEntity, TField> selector,
            bool? isDistinct = null,
            FilterDto? filter = null);

        public Task<MyActionResult<bool>> IsExists(long id);

        public Task<MyActionResult<bool>> IsExistsRange(List<long> ids);

        // 增:
        public Task<MyActionResult<object>> Add(TEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> AddRange(List<TEntity> entities, bool isBeginTransaction = true);

        // 改:
        public Task<MyActionResult<object>> Edit(TEntity entity, bool isBeginTransaction = true);
        public Task<MyActionResult<object>> EditRange(List<TEntity> entities, bool isBeginTransaction = true);

        // 删:
        public Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true);
        Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true);
    }
}
