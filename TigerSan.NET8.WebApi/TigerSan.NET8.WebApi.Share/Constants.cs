namespace TigerSan.NET8.WebApi.Share
{
    public static class Constants
    {
        /// <summary>滞留阈值（时）</summary>
        public readonly static double Stolid_Threshold_Hours = 24;
        /// <summary>上报间隔（秒）</summary>
        public readonly static double Report_Interval_Seconds = 3600;
        /// <summary>计算间隔（秒）</summary>
        public readonly static double Calculation_Interval_Seconds = 600;
        /// <summary>在线状态更新间隔（秒）</summary>
        public readonly static double OnlineStateUpdater_Interval_Seconds = 60;
        /// <summary>密钥</summary>
        public readonly static string SecretKey = TokenGenerator.GetSecretKey();
        /// <summary>地图秘钥</summary>
        public readonly static string AMapKey = "10f335d7f69a5534a4b19a30282d896e";
        /// <summary>Token有效期</summary>
        public readonly static TimeSpan Token_Validity_Period = TimeSpan.FromDays(7);
    }
}
