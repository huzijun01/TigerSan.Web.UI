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
    public class MyResults<TData>
    {
        public static MyActionResult<TData> OperationSuccess { get => new MyActionResult<TData>(ActionResultCode.Success, "Operation successful!"); }
        public static MyActionResult<TData> ApiUnavailable { get => new MyActionResult<TData>(ActionResultCode.Warning, "This API is unavailable!"); }
        public static MyActionResult<TData> SomeResourceNotExist { get => new MyActionResult<TData>(ActionResultCode.Warning, "Some resources do not exist!"); }
        public static MyActionResult<TData> ResourceNotFound { get => new MyActionResult<TData>(ActionResultCode.Error, "The resource not found!"); }
        public static MyActionResult<TData> ResourceExists { get => new MyActionResult<TData>(ActionResultCode.Error, "The resource already exist!"); }
        public static MyActionResult<TData> ResourceNotExist { get => new MyActionResult<TData>(ActionResultCode.Error, "The resource do not exist!"); }
        public static MyActionResult<TData> ResourceBeenOccupied { get => new MyActionResult<TData>(ActionResultCode.Error, "The resource have been occupied!"); }
        public static MyActionResult<TData> NameRepeated { get => new MyActionResult<TData>(ActionResultCode.Error, "The name cannot be repeated!"); }
        public static MyActionResult<TData> UserNotExist { get => new MyActionResult<TData>(ActionResultCode.Error, "User does not exist!"); }
        public static MyActionResult<TData> PasswordIncorrect { get => new MyActionResult<TData>(ActionResultCode.Error, "The password is incorrect!"); }

        #region 【Functions】
        public static MyActionResult<TData> Success(string msg) { return new MyActionResult<TData>(ActionResultCode.Success, msg); }
        public static MyActionResult<TData> Warning(string msg) { return new MyActionResult<TData>(ActionResultCode.Warning, msg); }
        public static MyActionResult<TData> Error(string msg) { return new MyActionResult<TData>(ActionResultCode.Error, msg); }
        public static MyActionResult<TData> Error(Exception e) { return new MyActionResult<TData>(ActionResultCode.Error, e.Message); }
        #endregion 【Functions】
    }
    #endregion

    public class MyActionResult<TData>
    {
        #region 【Functions】
        public bool IsSuccess { get => Code == ActionResultCode.Success; }
        public bool IsWarning { get => Code == ActionResultCode.Warning; }
        public bool IsError { get => Code == ActionResultCode.Error; }
        #endregion 【Functions】

        #region 【Properties】
        /// <summary>结果码</summary>
        public ActionResultCode Code { get; set; } = ActionResultCode.Success;
        /// <summary>信息</summary>
        public string Message { get; set; } = string.Empty;
        /// <summary>数据</summary>
        public TData? Data { get; set; }
        #endregion 【Properties】

        #region 【Ctor】
        public MyActionResult()
        {
        }

        public MyActionResult(string message = "", TData? data = default)
        {
            Message = message;
            Data = data;
        }

        public MyActionResult(ActionResultCode code = ActionResultCode.Success, string message = "", TData? data = default)
        {
            Code = code;
            Message = message;
            Data = data;
        }
        #endregion 【Ctor】
    }
}
