using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace TigerSan.NET8.WebApi.Helpers
{
    public static class ActionContextHelper
    {
        #region 是否包含指定特性
        /// <summary>是否包含指定特性</summary>
        public static bool HasAttribute<TAttribute>(this ActionContext context)
        where TAttribute : Attribute
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            var actionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;
            return actionDescriptor?.MethodInfo != null &&
                   actionDescriptor.MethodInfo.GetCustomAttributes(typeof(TAttribute), inherit: true).Any();
        }
        #endregion

        #region 获取“Authorization头”
        /// <summary>获取“Authorization头”</summary>
        public static string? GetAuthorization(this ActionContext context)
        {
            return context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        }
        #endregion
    }
}
