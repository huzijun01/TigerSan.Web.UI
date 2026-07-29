using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class IdNameRepeatableControllerBase<TEntity, TIIdNameRepeatableService> : IdControllerBase<TEntity, TIIdNameRepeatableService> where TEntity : IdName where TIIdNameRepeatableService : IIdNameServiceBase<TEntity>
    {
        #region 【Ctor】
        public IdNameRepeatableControllerBase(TIIdNameRepeatableService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        [HttpPost]
        [Route("SelectIdName")]
        /// <summary>获取“ID名称对”集合</summary>
        public virtual async Task<MyActionResult<List<IdName>>> SelectIdName(bool? isDistinct, [FromBody] FilterDto? filter = null)
        {
            return await _service.SelectIdName(isDistinct, filter);
        }
        #endregion 【Functions】
    }
}
