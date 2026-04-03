using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models.Base;

namespace TigerSan.NET8.WebApi.Controllers.Base
{
    [ApiController]
    [Route("[controller]")]
    public abstract class IdNameControllerBase<TEntity, TIIdNameService> : IdControllerBase<TEntity, TIIdNameService> where TEntity : IdNameEntityBase where TIIdNameService : IIdNameServiceBase<TEntity>
    {
        #region 【Ctor】
        public IdNameControllerBase(TIIdNameService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        [HttpGet]
        [Route("SelectIdName")]
        /// <summary>获取“ID名称对”集合</summary>
        public virtual async Task<MyActionResult<List<IdName>>> SelectIdName([FromQuery] bool? isDistinct)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.SelectIdName(isDistinct);
            return res;
        }
        #endregion 【Functions】
    }
}
