using System.Text.RegularExpressions;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    public static class Verify
    {
        #region 是否为“有效MAC地址”
        public static bool IsValidMacAddr(string? macAddress)
        {
            if (string.IsNullOrWhiteSpace(macAddress)) return false;

            string pattern = @"^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$|^[0-9A-Fa-f]{12}$";
            return Regex.IsMatch(macAddress, pattern);
        }
        #endregion
    }
}
