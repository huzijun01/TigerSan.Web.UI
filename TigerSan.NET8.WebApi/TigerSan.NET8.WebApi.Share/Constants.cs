namespace TigerSan.NET8.WebApi.Share
{
    public static class Constants
    {
        /// <summary>“距离”阈值（米）</summary>
        public static double DistanceThresholdMeters = 500;
        /// <summary>“滞留”阈值（时）</summary>
        public static double StolidThresholdHours = 24;
        /// <summary>“超时”阈值（时）</summary>
        public static double TimeoutThresholdHours = 24 * 3;
        /// <summary>“标签”上报间隔（秒）</summary>
        public static double TagReportIntervalSeconds = 3600;
        /// <summary>“定位器”上报间隔（秒）</summary>
        public static double LocatorReportIntervalSeconds = 86400;
        /// <summary>“MQTT”上报间隔（秒）</summary>
        public static double MqttReportIntervalSeconds = 600;
        /// <summary>“计算”间隔（秒）</summary>
        public static double CalculationIntervalSeconds = 600;
        /// <summary>“在线状态”更新间隔（秒）</summary>
        public static double OnlineStateUpdater_IntervalSeconds = 60;
        /// <summary>“Token”密钥</summary>
        public static string SecretKey = TokenGenerator.GetSecretKey();
        /// <summary>“地图”秘钥</summary>
        public static string AMapKey = "10f335d7f69a5534a4b19a30282d896e";
        /// <summary>“Token”有效期</summary>
        public static TimeSpan TokenValidityPeriod = TimeSpan.FromDays(7);
        /// <summary>“验证码”有效期</summary>
        public static TimeSpan CaptchaValidityPeriod = TimeSpan.FromMinutes(3);
    }
}
