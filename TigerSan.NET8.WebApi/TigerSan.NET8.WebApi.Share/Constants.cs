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
        /// <summary>密钥</summary>
        public readonly static string SecretKey = "SecretKey";
        /// <summary>Token有效期</summary>
        public readonly static TimeSpan Token_Validity_Period = TimeSpan.FromDays(7);
    }
}
