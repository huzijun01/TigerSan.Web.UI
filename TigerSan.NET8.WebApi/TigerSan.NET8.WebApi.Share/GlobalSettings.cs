namespace TigerSan.NET8.WebApi.Share
{
    public static class GlobalSettings
    {
        /// <summary>最大“文件”大小（MB）</summary>
        public const long MaxFileSize = 200;
        /// <summary>最大“图片”大小（MB）</summary>
        public const long MaxImageSize = 2;
        /// <summary>“文件”文件夹</summary>
        public static readonly string DirFiles = Path.Combine(AppContext.BaseDirectory, "Files");
        /// <summary>“图片”文件夹名称</summary>
        public static readonly string DirImagesName = "Images";
        /// <summary>“图片”文件夹</summary>
        public static readonly string DirImages = Path.Combine(DirFiles, DirImagesName);
        /// <summary>“距离”阈值（米）</summary>
        public static double DistanceThresholdMeters = 50;
        /// <summary>“滞留”阈值（时）</summary>
        public static double StolidThresholdHours = 24;
        /// <summary>“超时”阈值（时）</summary>
        public static double TimeoutThresholdHours = 24 * 3;
        /// <summary>“标签”上报间隔（秒）</summary>
        public static double TagReportIntervalSeconds = 3600;
        /// <summary>“定位器”上报间隔（秒）</summary>
        public static double LocatorReportIntervalSeconds = 86400 + 3600;
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
