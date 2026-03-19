using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IServiceBase<T> where T : IdEntity
    {
        // 查:
        public Task<T?> Get(long id);
        public Task<int> GetCount();
        public Task<List<T>> GetAllList();
        public Task<List<T>> GetList(int pageSize, int pageNumber);
        public Task<List<object>> Select(string field, bool isDistinct = false);
        public Task<List<object>> Where(List<FilterModel> filters, int? pageSize = null, int? pageNumber = null);
        public Task<bool> IsExists(long id);

        // 增:
        public Task<MyActionResult> Add(T entity);
        public Task<MyActionResult> AddRange(IList<T> entities);

        // 改:
        public Task<MyActionResult> Edit(T entity);

        // 删:
        public Task<MyActionResult> Remove(long id);
        Task<MyActionResult> RemoveRange(IList<long> ids);
    }
}
