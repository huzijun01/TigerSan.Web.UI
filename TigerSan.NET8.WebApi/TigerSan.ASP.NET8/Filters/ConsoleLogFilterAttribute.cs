using System.Text;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Filters
{
    public class ConsoleLogFilterAttribute : Attribute, IAsyncActionFilter
    {
        #region [Private]
        #region 获取“请求体”字符串
        private static async Task<string> GetRequestBodyAsync(HttpRequest request)
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

        #region 获取“请求体”字符串
        private static string GetBodyString(ActionExecutingContext? context)
        {
            if (context == null)
            {
                LogHelper.Instance.IsNull(nameof(context));
                return string.Empty;
            }

            string strRes;

            try
            {
                var body = context.ActionArguments.FirstOrDefault().Value;
                if (body == null) return string.Empty;

                strRes = JsonConvert.SerializeObject(body, Formatting.Indented);
            }
            catch (Exception e)
            {
                strRes = e.GetMessage();
            }

            return string.IsNullOrEmpty(strRes) ? string.Empty : $"Body: {Environment.NewLine}{strRes}";
        }
        #endregion

        #region 获取“结果”字符串
        private static string GetResultString(ActionExecutedContext? context)
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
                strRes = e.GetMessage();
            }
            return strRes;
        }
        #endregion
        #endregion [Private]

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"[Begin]");
            sb.AppendLine($"Controller: {context.RouteData.Values["controller"]}");
            sb.AppendLine($"Action: {context.RouteData.Values["action"]}");
            sb.AppendLine(GetBodyString(context));
            LogHelper.Instance.ColorWriteLine(sb.ToString(), ConsoleColor.Green);

            var res = await next();
            string strRes = GetResultString(res);

            sb.Clear();
            sb.AppendLine($"[End]");
            sb.AppendLine($"Controller: {context.RouteData.Values["controller"]}");
            sb.AppendLine($"Action: {context.RouteData.Values["action"]}");
            sb.AppendLine($"Result: ");
            sb.AppendLine(strRes);
            LogHelper.Instance.ColorWriteLine(sb.ToString(), ConsoleColor.Cyan);
        }
    }
}
