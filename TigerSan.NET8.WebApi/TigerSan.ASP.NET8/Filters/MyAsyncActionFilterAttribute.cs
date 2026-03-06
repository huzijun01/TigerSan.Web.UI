using System.Text;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Filters
{
    public class MyAsyncActionFilterAttribute : Attribute, IAsyncActionFilter
    {
        #region 获取“结果字符串”
        public static string GetResultString(ActionExecutedContext context)
        {
            string strRes;
            try
            {
                var objResult = context.Result as ObjectResult;
                if (objResult == null)
                {
                    strRes = $"The {nameof(objResult)} is null!";
                }
                else
                {
                    var actionResult = objResult.Value as MyActionResult;
                    if (actionResult == null)
                    {
                        strRes = JsonConvert.SerializeObject(objResult.Value, Formatting.Indented);
                    }
                    else
                    {
                        strRes = JsonConvert.SerializeObject(actionResult, Formatting.Indented);
                    }
                }
            }
            catch (Exception e)
            {
                strRes = e.Message;
            }
            return strRes;
        }
        #endregion

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"[Begin]");
            sb.AppendLine($"Controller: {context.RouteData.Values["controller"]}");
            sb.AppendLine($"Action: {context.RouteData.Values["action"]}");
            Console.WriteLine(sb.ToString());

            var res = await next();
            string strRes = GetResultString(res);

            sb.Clear();
            sb.AppendLine($"[End]");
            sb.AppendLine($"Controller: {context.RouteData.Values["controller"]}");
            sb.AppendLine($"Action: {context.RouteData.Values["action"]}");
            sb.AppendLine($"Result: ");
            sb.AppendLine(strRes);
            Console.WriteLine(sb.ToString());
        }
    }
}
