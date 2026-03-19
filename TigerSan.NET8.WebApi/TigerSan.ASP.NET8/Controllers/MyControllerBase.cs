using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class MyControllerBase<T> : ControllerBase where T : IdEntity
    {
        #region 【Fields】
        protected IServiceBase<T> _service;
        #endregion 【Fields】

        #region 【Ctor】
        public MyControllerBase(IServiceBase<T> service)
        {
            _service = service;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        [HttpGet]
        [Route("{id}")]
        /// <summary>获取“单条数据”</summary>
        public async Task<MyActionResult> Get(long id)
        {
            var entity = await _service.Get(id);
            if (entity == null)
            {
                return MyResults.ResourceNotFound;
            }

            var res = MyResults.OperationSuccess;
            res.Data = entity;
            return res;
        }

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult> GetCount()
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetCount();
            return res;
        }

        [HttpGet]
        /// <summary>获取“所有数据”</summary>
        public async Task<MyActionResult> GetAllList()
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetAllList();
            return res;
        }

        [HttpGet]
        [Route("{pageSize}/{pageNumber}")]
        /// <summary>获取“单页数据”</summary>
        public async Task<MyActionResult> GetList(int pageSize, int pageNumber)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.GetList(pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("Select/{field}/{isDistinct}")]
        /// <summary>获取“字段”集合</summary>
        public async Task<MyActionResult> Select(string field, bool isDistinct = false)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.Select(field, isDistinct);
            return res;
        }

        [HttpPost]
        [Route("Where")]
        /// <summary>筛选集合</summary>
        public async Task<MyActionResult> Where(
            [FromBody] List<FilterModel> filters,
            [FromQuery] int? pageSize,
            [FromQuery] int? pageNumber)
        {
            var res = MyResults.OperationSuccess;
            res.Data = await _service.Where(filters, pageSize, pageNumber);
            return res;
        }
        #endregion [查]

        #region [增]
        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add([FromBody] T entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> AddRange([FromBody] IList<T> entities)
        {
            return await _service.AddRange(entities);
        }
        #endregion [增]

        #region [改]
        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit([FromBody] T entity)
        {
            return await _service.Edit(entity);
        }
        #endregion [改]

        #region [删]
        [HttpDelete]
        [Route("{id}")]
        /// <summary>删除“单条数据”</summary>
        public async Task<MyActionResult> Remove(long id)
        {
            return await _service.Remove(id);
        }

        [HttpDelete]
        [Route("Range")]
        /// <summary>删除“多条数据”</summary>
        public async Task<MyActionResult> RemoveRange([FromBody] IList<long> ids)
        {
            return await _service.RemoveRange(ids);
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
