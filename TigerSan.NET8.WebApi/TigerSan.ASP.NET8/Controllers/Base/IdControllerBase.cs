using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class IdControllerBase<TEntity, TIIdService> : ControllerBase where TEntity : IdEntityBase where TIIdService : IIdServiceBase<TEntity>
    {
        #region 【Fields】
        public TIIdService _service;
        #endregion 【Fields】

        #region 【Properties】
        /// <summary>用户信息</summary>
        public UserInfo? UserInfo { get; set; }
        /// <summary>可访问公司</summary>
        public List<CompanyEntity>? AccessibleCompanies { get; set; }
        #endregion 【Properties】

        #region 【Ctor】
        public IdControllerBase(TIIdService service)
        {
            _service = service;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpGet]
        [Route("{id}")]
        /// <summary>获取“单条数据”</summary>
        public virtual async Task<MyActionResult<TEntity>> Get(long id)
        {
            return await _service.Get(id);
        }

        [HttpPost]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public virtual async Task<MyActionResult<int>> GetCount([FromBody] FilterDto? filter = null)
        {
            return await _service.GetCount(filter);
        }

        [HttpPost]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public virtual async Task<MyActionResult<List<TEntity>>> GetList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            [FromBody] FilterDto? filter = null)
        {
            return await _service.GetList(pageSize, pageNumber, sort, ascending, filter);
        }
        #endregion [查]

        #region [增]
        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public virtual async Task<MyActionResult<TEntity>> Add([FromBody] TEntity entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public virtual async Task<MyActionResult<object>> AddRange([FromBody] List<TEntity> entities)
        {
            return await _service.AddRange(entities);
        }
        #endregion [增]

        #region [改]
        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public virtual async Task<MyActionResult<object>> Edit([FromBody] TEntity entity)
        {
            return await _service.Edit(entity);
        }

        [HttpPut]
        [Route("Range")]
        /// <summary>修改“多条数据”</summary>
        public virtual async Task<MyActionResult<object>> EditRange([FromBody] List<TEntity> entities)
        {
            return await _service.EditRange(entities);
        }
        #endregion [改]

        #region [删]
        [HttpDelete]
        [Route("{id}")]
        /// <summary>删除“单条数据”</summary>
        public virtual async Task<MyActionResult<object>> Remove(long id)
        {
            return await _service.Remove(id);
        }

        [HttpDelete]
        [Route("Range")]
        /// <summary>删除“多条数据”</summary>
        public virtual async Task<MyActionResult<object>> RemoveRange([FromBody] List<long> ids)
        {
            return await _service.RemoveRange(ids);
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
