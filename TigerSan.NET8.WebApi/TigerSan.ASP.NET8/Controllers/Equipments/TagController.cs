using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class TagController : IdControllerBase<TagEntity, ITagService>
    {
        #region 【Ctor】
        public TagController(ITagService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        [HttpPost]
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add([FromBody] TagEntity entity)
        {
            var res = await _service.Add(entity);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }

        [HttpPost]
        [Route("Range")]
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange([FromBody] List<TagEntity> entities)
        {
            var res = await _service.AddRange(entities);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }
        #endregion [增]

        #region [改]
        [HttpPut]
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit([FromBody] TagEntity entity)
        {
            var res = await _service.Edit(entity);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }

        [HttpPut]
        [Route("Range")]
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange([FromBody] List<TagEntity> entities)
        {
            var res = await _service.EditRange(entities);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }
        #endregion [改]

        #region [删]
        [HttpDelete]
        [Route("{id}")]
        /// <summary>删除“单条数据”</summary>
        public override async Task<MyActionResult<object>> Remove(long id)
        {
            var res = await _service.Remove(id);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }

        [HttpDelete]
        [Route("Range")]
        /// <summary>删除“多条数据”</summary>
        public override async Task<MyActionResult<object>> RemoveRange([FromBody] List<long> ids)
        {
            var res = await _service.RemoveRange(ids);
            await SseInstance.UpdateTagCachesAsync();
            return res;
        }
        #endregion [删]
        #endregion 【Functions】
    }
}
