using System.Text;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Filters
{
    public class MyAsyncActionFilterAttribute : Attribute, IAsyncActionFilter
    {
        #region 获取“请求体”字符串
        public static async Task<string> GetRequestBodyAsync(HttpRequest request)
        {
            // 重要：启用缓冲区重用
            request.EnableBuffering();

            using var reader = new StreamReader(
                request.Body,
                encoding: Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                bufferSize: 1024,
                leaveOpen: true);

            var body = await reader.ReadToEndAsync();

            // 重置请求流位置，确保后续中间件可读取
            request.Body.Position = 0;

            return body;
        }
        #endregion

        #region 获取“结果”字符串
        public static string GetResultString(ActionExecutedContext? context)
        {
            if (context == null)
            {
                LogHelper.Instance.IsNull(nameof(context));
                return string.Empty;
            }

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
                    var actionResult = objResult.Value as MyActionResult<object>;
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
            var body = await GetRequestBodyAsync(context.HttpContext.Request);

            var sb = new StringBuilder();
            sb.AppendLine($"[Begin]");
            sb.AppendLine($"Controller: {context.RouteData.Values["controller"]}");
            sb.AppendLine($"Action: {context.RouteData.Values["action"]}");
            sb.AppendLine($"Body: ");
            sb.AppendLine(body);
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
