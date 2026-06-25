using Newtonsoft.Json;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Share.Packages
{
    /// <summary>“蓝牙标签”数据包</summary>
    public class BluetoothTagPackage : PackageBase
    {
        /// <summary>数据</summary>
        [JsonProperty("data")]
        public BluetoothTagGroupData Data { get; set; } = new BluetoothTagGroupData();

        #region 【Functions】
        #region 反序列化
        public static new BluetoothTagPackage? Deserialize(string str)
        {
            try
            {
                return JsonConvert.DeserializeObject<BluetoothTagPackage>(str);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
            }

            return null;
        }
        #endregion
        #endregion 【Functions】
    }

    #region “蓝牙标签”集合数据
    /// <summary>“蓝牙标签”集合数据</summary>
    public class BluetoothTagGroupData : DataBase
    {
        /// <summary>经度</summary>
        [JsonProperty("j")]
        public double Longitude { get; set; }

        /// <summary>纬度</summary>
        [JsonProperty("w")]
        public double Latitude { get; set; }

        /// <summary>上报类型</summary>
        [JsonProperty("h")]
        public int ReportType { get; set; }

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

        /// <summary>电量</summary>
        [JsonProperty("b")]
        public int Battery { get; set; }

        /// <summary>温度</summary>
        [JsonProperty("t")]
        public double Temperature { get; set; }

        /// <summary>信号强度（原始数据）</summary>
        [JsonProperty("r")]
        public int SignalRaw { get; set; }

        /// <summary>状态</summary>
        [JsonProperty("w")]
        public int Status { get; set; }

        /// <summary>信号强度</summary>
        [JsonIgnore]
        public int Signal { get => 256 - SignalRaw; }

        /// <summary>是否“脱落”</summary>
        [JsonIgnore]
        public bool? IsFall { get => (Status & (1 << 2)) != 0 ? (Status & (1 << 3)) != 0 : null; }
    }
    #endregion
}
