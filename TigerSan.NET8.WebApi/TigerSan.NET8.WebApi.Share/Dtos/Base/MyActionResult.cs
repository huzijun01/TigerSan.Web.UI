using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    #region 结果码
    public enum ActionResultCode
    {
        Success = 0,
        Warning = 1,
        Error = 2,
        InvalidToken = 3,
        InvalidCaptcha = 4,
    }
    #endregion

    #region 结果类
    public class MyResults<TData>
    {
        public static MyActionResult<List<IdName>> EmptyIdNameList { get => MyResults<List<IdName>>.Success(null, new List<IdName>()); }
        public static MyActionResult<TData> OperationSuccess { get => MyResults<TData>.Success("Operation successful!"); }
        public static MyActionResult<TData> RecordAlreadyExists { get => MyResults<TData>.Warning("Record already exists!"); }
        public static MyActionResult<TData> SomeAuthoritiesUnavailable { get => MyResults<TData>.Warning("Some authorities are unavailable!"); }
        public static MyActionResult<TData> CannotModifyOwnRole { get => MyResults<TData>.Error("User cannot modify their own role!"); }
        public static MyActionResult<TData> ApiUnavailable { get => MyResults<TData>.Error("This API is unavailable!"); }
        public static MyActionResult<TData> ResourceNotExist { get => MyResults<TData>.Error("The resource do not exist!"); }
        public static MyActionResult<TData> SomeResourceNotExist { get => MyResults<TData>.Error("Some resources do not exist!"); }
        public static MyActionResult<TData> ResourceExists { get => MyResults<TData>.Error("The resource already exist!"); }
        public static MyActionResult<TData> ResourceBeenOccupied { get => MyResults<TData>.Error("The resource have been occupied!"); }
        public static MyActionResult<TData> NameRepeated { get => MyResults<TData>.Error("The name cannot be repeated!"); }
        public static MyActionResult<TData> AssetIdRepeated { get => MyResults<TData>.Error("The AssetId cannot be repeated!"); }
        public static MyActionResult<TData> TagIdRepeated { get => MyResults<TData>.Error("The TagId cannot be repeated!"); }
        public static MyActionResult<TData> RfidRepeated { get => MyResults<TData>.Error("The RFID cannot be repeated!"); }
        public static MyActionResult<TData> TagRepeated { get => MyResults<TData>.Error("The Tag cannot be repeated!"); }
        public static MyActionResult<TData> MacAddrRepeated { get => MyResults<TData>.Error("The MacAddr cannot be repeated!"); }
        public static MyActionResult<TData> InvalidMacAddr { get => MyResults<TData>.Error("The MacAddr is invalid!"); }
        public static MyActionResult<TData> UserNotExist { get => MyResults<TData>.Error("User does not exist!"); }
        public static MyActionResult<TData> PasswordIncorrect { get => MyResults<TData>.Error("The password is incorrect!"); }
        public static MyActionResult<TData> TraceIdentifierIsNullOrEmpty { get => MyResults<TData>.Error("The id is null or empty!"); }
        public static MyActionResult<TData> CaptchaGenerationFailed { get => MyResults<TData>.Error("Captcha generation failed!"); }
        public static MyActionResult<TData> CaptchaVerificationFailed { get => new MyActionResult<TData>(ActionResultCode.InvalidCaptcha, "Captcha verification failed!"); }
        public static MyActionResult<TData> SiteNotExist { get => MyResults<TData>.Error("The site do not exist!"); }
        public static MyActionResult<TData> CompanyNotExist { get => MyResults<TData>.Error("The company do not exist!"); }
        public static MyActionResult<TData> AssetNotBoundTag { get => MyResults<TData>.Error("The asset is not bound to a tag!"); }
        public static MyActionResult<TData> AssetNotExist { get => MyResults<TData>.Error("The asset do not exist!"); }
        public static MyActionResult<TData> TagNotExist { get => MyResults<TData>.Error("The tag do not exist!"); }
        public static MyActionResult<TData> TagNotBoundAsset { get => MyResults<TData>.Error("The tag is not bound to a asset!"); }
        public static MyActionResult<TData> IncorrectTagType { get => MyResults<TData>.Error("Incorrect tag type!"); }
        public static MyActionResult<TData> AccessibleCompaniesCannotBeNull { get => MyResults<TData>.Error("The AccessibleCompanies cannot be null!"); }
        public static MyActionResult<TData> UnsupportedFileType { get => MyResults<TData>.Error("Unsupported file type!"); }
        public static MyActionResult<TData> DirAlreadyExists { get => MyResults<TData>.Error($"The directory already exists!"); }
        public static MyActionResult<TData> FileAlreadyExists { get => MyResults<TData>.Error($"The file already exists!"); }
        public static MyActionResult<TData> NameCannotBeEmpty { get => MyResults<TData>.Error($"The name cannot be empty!"); }
        public static MyActionResult<TData> FileIsNullOrEmpty { get => MyResults<TData>.Error($"The file is null or empty!"); }
        public static MyActionResult<TData> AuthorizationHeaderMissing { get => new MyActionResult<TData>(ActionResultCode.InvalidToken, "Authorization header is missing!"); }
        public static MyActionResult<TData> InvalidOrExpiredToken { get => new MyActionResult<TData>(ActionResultCode.InvalidToken, "Invalid or expired token!"); }
        public static MyActionResult<TData> LoggedInByAnotherUser { get => new MyActionResult<TData>(ActionResultCode.InvalidToken, "Account logged in by others!"); }

        #region 【Functions】
        public static MyActionResult<TData> Success(string? msg = null, TData? data = default) { return new MyActionResult<TData>(ActionResultCode.Success, msg ?? OperationSuccess.Message, data); }
        public static MyActionResult<TData> Warning(string? msg = null, TData? data = default) { return new MyActionResult<TData>(ActionResultCode.Warning, msg ?? nameof(Warning), data); }
        public static MyActionResult<TData> Error(string msg) { return new MyActionResult<TData>(ActionResultCode.Error, msg); }
        public static MyActionResult<TData> ParentCompanyNotExist(long id, long parent) { return MyResults<TData>.Error($"The parent company does not exist! ({id}, {parent})"); }
        public static MyActionResult<TData> InvalidToken(string msg) { return new MyActionResult<TData>(ActionResultCode.InvalidToken, msg); }
        public static MyActionResult<TData> IsNull(string name) { return MyResults<TData>.Error($"The {name} is null!"); }
        public static MyActionResult<TData> Error(Exception e) { return MyResults<TData>.Error(e.Message); }
        public static Func<long, MyActionResult<TData>> FileSizeExceedsLimit = size => MyResults<TData>.Error($"File size exceeds the limit! ({size}MB)");
        public static Func<string?, MyActionResult<TData>> DirIsNotEmpty = path => MyResults<TData>.Error($"The directory is not empty!({path})");
        public static Func<string?, MyActionResult<TData>> InvalidPath = path => MyResults<TData>.Error($"The path is invalid!({path})");
        public static Func<string?, MyActionResult<TData>> PathDoesNotExist = path => MyResults<TData>.Error($"The path does not exist!({path})");
        public static Func<string, MyActionResult<TData>> TagNotFound = tagId => MyResults<TData>.Error($"The tag not found! ({tagId})");
        public static Func<string, MyActionResult<TData>> EqpTypeNotMatch = tagId => MyResults<TData>.Error($"EqpType does not match! ({tagId})");
        public static Func<string, MyActionResult<TData>> StationNotFound = stationId => MyResults<TData>.Error($"The station not found! ({stationId})");
        public static Func<string, MyActionResult<TData>> AssetNoSite = assetId => MyResults<TData>.Error($"The asset have no site! ({assetId})");
        public static Func<string, MyActionResult<TData>> TargetSameToSite = assetId => MyResults<TData>.Error($"The target cannot be the same as the site! ({assetId})");
        public static Func<string, MyActionResult<TData>> AssetNotFound = assetId => MyResults<TData>.Error($"The asset not found! ({assetId})");
        public static Func<string, MyActionResult<TData>> CodeCannotBeEmpty = assetId => MyResults<TData>.Error($"The code cannot be empty! ({assetId})");
        public static Func<string, MyActionResult<TData>> AssetsHaveBeenAllocated = assetId => MyResults<TData>.Error($"The assets have been allocated! ({assetId})");
        public static Func<string, MyActionResult<TData>> CannotModify = code => MyResults<TData>.Error($"Cannot modify!({code})");
        public static Func<string, MyActionResult<TData>> NoAssetRecord = assetId => MyResults<TData>.Error($"No asset record! ({assetId})");
        public static Func<string, MyActionResult<TData>> NotInbound = assetId => MyResults<TData>.Error($"The asset is not in the Inbound state! ({assetId})");
        public static Func<string, MyActionResult<TData>> NotInStoreOrStolid = assetId => MyResults<TData>.Error($"The asset is not in the InStore or Stolid state! ({assetId})");
        public static Func<string, MyActionResult<TData>> TargetSiteSameAsCurrent = assetId => MyResults<TData>.Error($"The target site cannot be the same as the current site! ({assetId})");
        public static Func<string, MyActionResult<TData>> NoCaptchaRecord = id => new MyActionResult<TData>(ActionResultCode.InvalidCaptcha, $"No Captcha record!({id})");
        #endregion 【Functions】
    }
    #endregion

    public class MyActionResult<TData>
    {
        #region 【Properties】
        /// <summary>结果码</summary>
        public ActionResultCode Code { get; set; } = ActionResultCode.Success;
        /// <summary>信息</summary>
        public string Message { get; set; } = string.Empty;
        /// <summary>数据</summary>
        public TData? Data { get; set; }

        #region [引用]
        public bool IsSuccess { get => Code == ActionResultCode.Success; }
        public bool IsWarning { get => Code == ActionResultCode.Warning; }
        public bool IsError { get => Code == ActionResultCode.Error; }
        #endregion [引用]
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

        #region 【Functions】
        #region 转换
        public MyActionResult<TData1> Convert<TData1>()
        {
            var res = new MyActionResult<TData1>();
            res.ShallowCopy(this);
            return res;
        }
        #endregion
        #endregion 【Functions】
    }
}
