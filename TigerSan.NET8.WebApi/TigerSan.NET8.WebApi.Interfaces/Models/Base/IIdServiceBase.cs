using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IDbSetConfig
    {
        /// <summary>“当前表”配置</summary>
        public DbSetConfig DbSetConfig { get; }
    }

    public interface IIdServiceBase<TEntity> : IDbSetConfig where TEntity : IdEntityBase
    {
        // 查:
        /// <summary>获取“单条数据”</summary>
        public Task<MyActionResult<TEntity>> Get(long id);

        /// <summary>获取“总数”</summary>
        public Task<MyActionResult<int>> GetCount(FilterDto? filter = null);

        /// <summary>获取“数据”集合（ids）</summary>
        public Task<MyActionResult<List<TEntity>>> GetList(List<long> ids);

        /// <summary>获取“数据”集合</summary>
        public Task<MyActionResult<List<TEntity>>> GetList(
            int? pageSize = null,
            int? pageNumber = null,
            string? propName = null,
            bool? ascending = null,
            FilterDto? filter = null);

        /// <summary>获取“字段”集合</summary>
        public Task<MyActionResult<List<TField>>> Select<TField>(Func<TEntity, TField> selector, bool isDistinct = false, FilterDto? filter = null);
        /// <summary>获取“ID值对”集合</summary>
        public Task<MyActionResult<List<IdValue<TField>>>> SelectIdValue<TField>(
            Func<TEntity, TField> selector,
            bool? isDistinct = null,
            FilterDto? filter = null);

        /// <summary>“单条数据”是否存在</summary>
        public Task<MyActionResult<bool>> IsExists(long id);

        /// <summary>“多条数据”是否存在</summary>
        public Task<MyActionResult<bool>> IsExistsRange(List<long> ids);

        // 增:
        /// <summary>添加“单条数据”</summary>
        public Task<MyActionResult<TEntity>> Add(TEntity entity, bool isBeginTransaction = true);
        /// <summary>添加“多条数据”</summary>
        public Task<MyActionResult<object>> AddRange(List<TEntity> entities, bool isBeginTransaction = true);

        // 改:
        /// <summary>修改“单条数据”</summary>
        public Task<MyActionResult<object>> Edit(TEntity entity, bool isBeginTransaction = true);
        /// <summary>修改“多条数据”</summary>
        public Task<MyActionResult<object>> EditRange(List<TEntity> entities, bool isBeginTransaction = true);

        // 删:
        /// <summary>删除“单条数据”</summary>
        public Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true);
        /// <summary>删除“多条数据”</summary>
        Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true);
    }
}
