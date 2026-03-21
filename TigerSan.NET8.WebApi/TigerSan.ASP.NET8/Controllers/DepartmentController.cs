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
    }
}
