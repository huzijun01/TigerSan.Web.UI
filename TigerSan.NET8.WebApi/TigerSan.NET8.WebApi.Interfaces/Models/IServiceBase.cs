using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IServiceBase<T> where T : IndexEntity
    {
        // 查:
        public Task<T?> Get(int index);
        public Task<int> GetCount();
        public Task<List<T>> GetList();
        public Task<List<T>> GetList(int pageSize, int pageNumber);

        // 增:
        public Task<MyActionResult> Add(T entity);
        public Task<MyActionResult> Add(IList<T> entities);

        // 改:
        public Task<MyActionResult> Edit(T entity);

        // 删:
        public Task<MyActionResult> Remove(int index);
        Task<MyActionResult> Remove(IList<int> indexes);
    }
}
