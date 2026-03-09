using Newtonsoft.Json;
using TigerSan.CsvLog;

namespace TigerSan.NET8.WebApi.Share.Packages
{
    /// <summary>“4G定位器”数据包</summary>
    public class Locator4gPackage : PackageBase
    {
        /// <summary>数据</summary>
        [JsonProperty("data")]
        public Locator4gData Data { get; set; } = new Locator4gData();

        #region 【Functions】
        #region 反序列化
        public static new Locator4gPackage? Deserialize(string str)
        {
            try
            {
                return JsonConvert.DeserializeObject<Locator4gPackage>(str);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
            }

            return null;
        }
        #endregion
        #endregion 【Functions】
    }

    #region “4G定位器”集合数据
    /// <summary>“4G定位器”数据</summary>
    public class Locator4gData : DataBase
    {
        /// <summary>设备类型</summary>
        [JsonProperty("deviceType")]
        public int DeviceType { get; set; }

        /// <summary>软件版本</summary>
        [JsonProperty("ver")]
        public string Version { get; set; } = string.Empty;

        /// <summary>电池电量</summary>
        [JsonProperty("batV")]
        public int Battery { get; set; }

        /// <summary>国际移动设备识别码</summary>
        [JsonProperty("IMEI")]
        public string IMEI { get; set; } = string.Empty;

        /// <summary>集成电路卡识别码</summary>
        [JsonProperty("ICCID")]
        public string ICCID { get; set; } = string.Empty;

        /// <summary>集中器心跳间隔（分钟）</summary>
        [JsonProperty("heartbeat")]
        public int Heartbeat { get; set; }

        /// <summary>辅小区</summary>
        [JsonProperty("scell")]
        public string SCell { get; set; } = string.Empty;

        /// <summary>邻小区</summary>
        [JsonProperty("ncell")]
        public List<string> NCell { get; set; } = new List<string>();

        /// <summary>标签数据集合</summary>
        [JsonProperty("wifiScan")]
        public List<WifiScanItem> TagDatas { get; set; } = new List<WifiScanItem>();
    }
    #endregion

    #region WiFi扫描项
    /// <summary>WiFi扫描项</summary>
    public class WifiScanItem
    {
        /// <summary>MAC地址</summary>
        [JsonProperty("M")]
        public string MacAddr { get; set; } = string.Empty;

        /// <summary>信号强度</summary>
        [JsonProperty("r")]
        public int SignalStrength { get; set; }
    }
    #endregion
}
