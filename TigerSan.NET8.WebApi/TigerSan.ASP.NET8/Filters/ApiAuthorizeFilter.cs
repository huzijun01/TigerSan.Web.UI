using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Filters
{
    public class ApiAuthorizeFilter : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.HasAttribute<NoNeedAuthorizeAttribute>()) return;

            // 是否包含Authorization头:
            var authorize = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authorize))
            {
                context.Result = new JsonResult(MyResults<object>.AuthorizationHeaderMissing);
                return;
            }

            // Token是否存在:
            if (!MemoryCacheHelper.Exists(authorize))
            {
                context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                return;
            }
        }
    }
}
