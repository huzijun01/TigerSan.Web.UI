using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Extensions;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Filters
{
    public class ApiAuthorizeFilter : IAuthorizationFilter
    {
        public static readonly string Token_Info = nameof(Token_Info);

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.HasAttribute<NoNeedAuthorizeAttribute>()) return;

            // 是否包含“Authorization头”:
            var authorize = context.GetAuthorization();
            if (string.IsNullOrEmpty(authorize))
            {
                context.Result = new JsonResult(MyResults<object>.AuthorizationHeaderMissing);
                return;
            }

            // 获取“Token信息”:
            var tokenInfo = TokenGenerator.GetTokenInfo(authorize, Constants.SecretKey);
            if (tokenInfo == null)
            {
                context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                return;
            }

            // 获取“Token记录”:
            var tokenRecord = MemoryCacheHelper.Get<string>(tokenInfo.UserId);

            // “Token”是否可用:
            if (!string.Equals(tokenRecord, authorize))
            {
                context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                return;
            }

            context.HttpContext.Items.Add(Token_Info, tokenInfo);
        }
    }
}
