using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class MyControllerBase<T> : ControllerBase where T : IndexEntity
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
        [Route("{index}")]
        /// <summary>获取“单条数据”</summary>
        public async Task<MyActionResult> Get(int index)
        {
            var entity = await _service.Get(index);
            if (entity == null)
            {
                return MyResults.ResourceNotFound;
            }

            var res = MyResults.Success;
            res.Data = entity;
            return res;
        }

        [HttpGet]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult> GetCount()
        {
            var res = MyResults.Success;
            res.Data = await _service.GetCount();
            return res;
        }

        [HttpGet]
        /// <summary>获取“所有数据”</summary>
        public async Task<MyActionResult> GetList()
        {
            var res = MyResults.Success;
            res.Data = await _service.GetList();
            return res;
        }

        [HttpGet]
        [Route("{pageSize}/{pageNumber}")]
        /// <summary>获取“单页数据”</summary>
        public async Task<MyActionResult> GetList(int pageSize, int pageNumber)
        {
            var res = MyResults.Success;
            res.Data = await _service.GetList(pageSize, pageNumber);
            return res;
        }
        #endregion [查]

        #region [增]
        [HttpPost]
        [Route("{entity}")]
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add(T entity)
        {
            return await _service.Add(entity);
        }

        [HttpPost]
        [Route("Range/{entities}")]
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> Add(IList<T> entities)
        {
            return await _service.Add(entities);
        }
        #endregion [增]

        #region [改]
        [HttpPut]
        [Route("{entity}")]
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit(T entity)
        {
            return await _service.Edit(entity);
        }
        #endregion [改]

        #region [删]
        [HttpDelete]
        [Route("{index}")]
        /// <summary>删除“单条数据”</summary>
        public async Task<MyActionResult> Remove(int index)
        {
            return await _service.Remove(index);
        }

        [HttpDelete]
        [Route("Range/{indexes}")]
        /// <summary>删除“多条数据”</summary>
        public async Task<MyActionResult> Remove(IList<int> indexes)
        {
            return await _service.Remove(indexes);
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
