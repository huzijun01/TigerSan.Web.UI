using Microsoft.AspNetCore.Mvc;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Controllers.Base;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Controllers
{
    public class DepartmentController : IdNameControllerBase<DepartmentEntity, IDepartmentService>
    {
        #region 【Ctor】
        public DepartmentController(IDepartmentService service) : base(service)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region Override
        [HttpPost]
        [Route("Unused/Count")]
        /// <summary>获取“总数”</summary>
        public override async Task<MyActionResult<int>> GetCount([FromBody] FilterDto? filter = null)
        {
            return MyResults<int>.ApiUnavailable;
        }

        [HttpPost]
        [Route("Unused/List")]
        /// <summary>获取“数据”集合</summary>
        public override async Task<MyActionResult<List<DepartmentEntity>>> GetList(
            [FromQuery] int? pageSize,
            [FromQuery] int? pageNumber,
            [FromBody] FilterDto? filter = null)
        {
            return MyResults<List<DepartmentEntity>>.ApiUnavailable;
        }
        #endregion Override

        [HttpPost]
        [Route("Count")]
        /// <summary>获取“总数”</summary>
        public async Task<MyActionResult<int>> GetCount([FromQuery] long? company = null)
        {
            var res = MyResults<int>.OperationSuccess;
            res.Data = await _service.GetCount(company);
            return res;
        }

        [HttpPost]
        [Route("List")]
        /// <summary>获取“数据”集合</summary>
        public async Task<MyActionResult<List<DepartmentEntity>>> GetList([FromQuery] long? company = null, [FromQuery] int? pageSize = null, [FromQuery] int? pageNumber = null)
        {
            var res = MyResults<List<DepartmentEntity>>.OperationSuccess;
            res.Data = await _service.GetList(company, pageSize, pageNumber);
            return res;
        }

        [HttpGet]
        [Route("SelectIdNameByCompany")]
        /// <summary>获取“ID名称对”集合/summary>
        public async Task<MyActionResult<List<IdName>>> SelectIdNameByCompany([FromQuery] long? company = null)
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.SelectIdNameByCompany(company);
            return res;
        }

        [HttpGet]
        [Route("BelongCompanyList")]
        /// <summary>获取“所属公司”集合</summary>
        public async Task<MyActionResult<List<IdName>>> GetBelongCompanyList()
        {
            var res = MyResults<List<IdName>>.OperationSuccess;
            res.Data = await _service.GetBelongCompanyList();
            return res;
        }
        #endregion [查]
        #endregion 【Functions】
    }
}
