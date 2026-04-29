using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Share;
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
            var authorize = context.GetAuthorization();
            if (string.IsNullOrEmpty(authorize))
            {
                context.Result = new JsonResult(MyResults<object>.AuthorizationHeaderMissing);
                return;
            }

            // 解析Token:
            var tokenInfo = TokenGenerator.GetTokenInfo(authorize, Constants.SecretKey);
            if (tokenInfo == null)
            {
                context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                return;
            }

            // 获取Token记录:
            var tokenRecord = MemoryCacheHelper.Get<string>(tokenInfo.UserId);

            // Token是否存在:
            if (!string.Equals(tokenRecord, authorize))
            {
                context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                return;
            }
        }
    }
}
