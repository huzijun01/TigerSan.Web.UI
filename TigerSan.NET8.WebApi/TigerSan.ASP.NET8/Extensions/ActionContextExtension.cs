using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace TigerSan.NET8.WebApi.Extensions
{
    public static class ActionContextExtension
    {
        #region 是否包含指定特性
        /// <summary>是否包含指定特性</summary>
        public static bool HasAttribute<TAttribute>(this ActionContext context, bool isControllerHas = true)
        where TAttribute : Attribute
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            var actionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;
            return actionDescriptor?.MethodInfo != null && actionDescriptor.MethodInfo.GetCustomAttributes(typeof(TAttribute), inherit: true).Any()
                || isControllerHas && actionDescriptor != null && actionDescriptor.ControllerTypeInfo.GetCustomAttributes(typeof(TAttribute), inherit: true).Any();
        }
        #endregion

        #region 是否为指定控制器
        /// <summary>是否为指定控制器</summary>
        public static bool IsController(this ActionContext context, string controllerName)
        {
            context.RouteData.Values.TryGetValue("controller", out var value);
            var controller = value as string;
            return controller != null && string.Equals(controller, controllerName);
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
