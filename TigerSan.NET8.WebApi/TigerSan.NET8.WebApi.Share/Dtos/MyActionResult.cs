namespace TigerSan.NET8.WebApi.Share.Dtos
{
    #region 结果码
    public enum ActionResultCode
    {
        Success = 0,
        Warning = 1,
        Error = 2,
    }
    #endregion

    #region 结果类
    public class MyResults
    {
        public static MyActionResult Error(Exception e) { return new MyActionResult(ActionResultCode.Error, e.Message); }
        public static MyActionResult Success { get => new MyActionResult(ActionResultCode.Success, "Operation successful!"); }
        public static MyActionResult ResourceNotFound { get => new MyActionResult(ActionResultCode.Warning, "The resource not found!"); }
        public static MyActionResult ResourceExists { get => new MyActionResult(ActionResultCode.Warning, "The resource already exist!"); }
        public static MyActionResult ResourceNotExist { get => new MyActionResult(ActionResultCode.Warning, "The resources do not exist!"); }
        public static MyActionResult SomeResourceNotExist { get => new MyActionResult(ActionResultCode.Warning, "Some resources do not exist!"); }
    }
    #endregion

    public class MyActionResult
    {
        #region 【Properties】
        /// <summary>结果码</summary>
        public ActionResultCode Code { get; set; } = ActionResultCode.Success;
        /// <summary>信息</summary>
        public string Message { get; set; } = string.Empty;
        /// <summary>数据</summary>
        public object? Data { get; set; }
        #endregion 【Properties】

        #region 【Ctor】
        public MyActionResult()
        {
        }

        public MyActionResult(string message = "", object? data = null)
        {
            Message = message;
            Data = data;
        }

        public MyActionResult(ActionResultCode code = ActionResultCode.Success, string message = "", object? data = null)
        {
            Code = code;
            Message = message;
            Data = data;
        }
        #endregion 【Ctor】
    }
}
