using Newtonsoft.Json;
using TigerSan.CsvLog;

namespace TigerSan.NET8.WebApi.Share.Packages
{
    /// <summary>“蓝牙标签”数据包</summary>
    public class BluetoothTagPackage
    {
        /// <summary>类型</summary>
        [JsonProperty("type")]
        public string Type { get; set; } = string.Empty;

        /// <summary>上报时间</summary>
        [JsonProperty("timestamp")]
        public string ReportTime { get; set; } = string.Empty;

        /// <summary>“蓝牙标签”集合数据</summary>
        [JsonProperty("data")]
        public BluetoothTagGroupData GroupData { get; set; } = new BluetoothTagGroupData();

        #region 反序列化
        public static BluetoothTagPackage? Deserialize(string str)
        {
            try
            {
                return JsonConvert.DeserializeObject<BluetoothTagPackage>(str);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
            }

            return null;
        }
        #endregion

        #region 序列化
        public string Serialize()
        {
            try
            {
                return JsonConvert.SerializeObject(this, Formatting.Indented);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
            }

            return string.Empty;
        }
        #endregion
    }

    #region “蓝牙标签”集合数据
    /// <summary>“蓝牙标签”集合数据</summary>
    public class BluetoothTagGroupData
    {
        /// <summary>命令</summary>
        [JsonProperty("cmd")]
        public int Command { get; set; }

        /// <summary>上报ID</summary>
        [JsonProperty("rId")]
        public int ReportId { get; set; }

        /// <summary>经度</summary>
        [JsonProperty("j")]
        public double Longitude { get; set; }

        /// <summary>状态</summary>
        [JsonProperty("w")]
        public int Status { get; set; }

        /// <summary>上报类型</summary>
        [JsonProperty("h")]
        public int ReportType { get; set; }

        /// <summary>主题</summary>
        [JsonProperty("topic")]
        public string Topic { get; set; } = string.Empty;

        /// <summary>采集器ID</summary>
        public string CollectorId { get => Topic.Split('/').Last(); }

        /// <summary>标签数据集合</summary>
        [JsonProperty("nodes0")]
        public List<BluetoothTagData> TagDatas { get; set; } = new List<BluetoothTagData>();
    }
    #endregion

    #region “蓝牙标签”数据
    /// <summary>“蓝牙标签”数据</summary>
    public class BluetoothTagData
    {
        /// <summary>标签ID</summary>
        [JsonProperty("M")]
        public string TagId { get; set; } = string.Empty;

        /// <summary>电压</summary>
        [JsonProperty("b")]
        public int Voltage { get; set; }

        /// <summary>温度</summary>
        [JsonProperty("t")]
        public int Temperature { get; set; }

        /// <summary>信号强度</summary>
        [JsonProperty("r")]
        public int Signal { get; set; }

        /// <summary>纬度</summary>
        [JsonProperty("w")]
        public double Latitude { get; set; }
    }
    #endregion
}
