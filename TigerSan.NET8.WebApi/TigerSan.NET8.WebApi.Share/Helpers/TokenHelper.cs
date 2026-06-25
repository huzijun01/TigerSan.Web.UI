using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    public static class TokenHelper
    {
        #region 初始化“Token”
        /// <summary>初始化“Token”</summary>
        public static bool InitToken(UserInfo userInfo)
        {
            userInfo.Token = TokenGenerator.GetToken(userInfo.Username, Constants.Token_Validity_Period, Constants.SecretKey);
            if (userInfo.Token == null)
            {
                LogHelper.Instance.Error($"Failed to generate token for user {userInfo.Username}");
                return false;
            }

            MemoryCacheHelper.SetRelative(userInfo.Username, userInfo.Token, Constants.Token_Validity_Period);

            return true;
        }
        #endregion

        #region 获取“Token信息”
        /// <summary>获取“Token信息”</summary>
        public static MyActionResult<TokenInfo> GetTokenInfo(string token)
        {
            // 获取“Token信息”:
            var tokenInfo = TokenGenerator.GetTokenInfo(token, Constants.SecretKey);
            if (tokenInfo == null)
                return MyResults<TokenInfo>.InvalidOrExpiredToken;

            // 获取“Token记录”:
            var tokenRecord = MemoryCacheHelper.Get<string>(tokenInfo.Username);

            // “Token”是否可用:
            if (string.IsNullOrEmpty(tokenRecord) || !string.Equals(tokenRecord, token))
                return MyResults<TokenInfo>.LoggedInByAnotherUser;

            return MyResults<TokenInfo>.Success(null, tokenInfo);
        }
        #endregion
    }
}
