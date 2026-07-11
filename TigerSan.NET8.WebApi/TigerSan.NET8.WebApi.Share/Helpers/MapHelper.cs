using System.Text;
using System.Text.Json;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    #region 位置
    /// <summary>位置</summary>
    public class Location
    {
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string? Address { get; set; }

        public Location(
            double? longitude,
            double? latitude,
            string? address)
        {
            this.Longitude = longitude;
            this.Latitude = latitude;
            this.Address = address;
        }
    }
    #endregion

    #region 基站
    public class Cell
    {
        public int MCC { get; set; }
        public int MNC { get; set; }
        public int LAC { get; set; }
        public int CellId { get; set; }
        public int Signal { get; set; }
        public string CellString { get => $"{MCC},{MNC},{LAC},{CellId},{Signal}"; }

        public static Cell? Get(string cellStr)
        {
            var cell = new Cell();
            var parts = cellStr.Split(',');
            if (parts.Length < 5) return null;

            if (!int.TryParse(parts[0], out int mcc)) return null;
            if (!int.TryParse(parts[1], out int mnc)) return null;
            if (!int.TryParse(parts[2], out int lac)) return null;
            if (!int.TryParse(parts[3], out int cellid)) return null;
            if (!int.TryParse(parts[4], out int rawSignal)) return null;

            cell.MCC = mcc;
            cell.MNC = mnc;
            cell.LAC = lac;
            cell.CellId = cellid;
            cell.Signal = rawSignal / 10;

            if (cell.Signal < -100 || cell.Signal > -20)
            {
                //Console.WriteLine($"【基站定位】忽略信号过弱的基站: 原始={rawSignal}, 转换后={signal} dBm");
                return null;
            }

            return cell;
        }
    }
    #endregion

    #region WiFi信息
    public class WifiInfo
    {
        public string Mac { get; set; } = string.Empty;
        public int Signal { get; set; }
        public string? Ssid { get; set; }
        public string ToApiString()
        {
            // 将无分隔符的12位MAC自动转为高德可识别的冒号分隔标准格式
            if (Mac.Length == 12)
            {
                Mac = string.Join(":", Enumerable.Range(0, 6).Select(i => Mac.Substring(i * 2, 2)));
            }
            return $"{Mac},{Signal}";
        }

        public WifiInfo() { }

        public WifiInfo(string mac, int signal, string? ssid = null)
        {
            Mac = mac;
            Signal = signal;
            Ssid = ssid;
        }
    }
    #endregion

    public static class MapHelper
    {
        #region 根据“WiFi”获取“位置”
        /// <summary>
        /// 通过 WiFi 列表获取地理位置（高德智能硬件定位接口）
        /// </summary>
        /// <param name="wifiList">扫描到的周边 WiFi 列表（需至少2个有效热点）</param>
        /// <param name="connectedWifiMac">当前连接热点的 MAC（可选，提升精度）</param>
        /// <param name="connectedWifiSignal">当前连接热点的信号强度（可选）</param>
        /// <param name="connectedWifiSsid">当前连接热点的 SSID（可选）</param>
        /// <param name="amapKey">高德 Web 服务 Key</param>
        public static async Task<MyActionResult<Location>> GetLocationByWifiAsync(
            string amapKey,
            IList<WifiInfo> wifiList,
            string? connectedWifiMac = null,
            int? connectedWifiSignal = null,
            string? connectedWifiSsid = null)
        {
            // 1. 基础参数校验
            if (string.IsNullOrEmpty(amapKey))
                return MyResults<Location>.Warning(LogHelper.Instance.Warning("高德 Key 不能为空"));

            if (wifiList == null || !wifiList.Any())
                return MyResults<Location>.Warning(LogHelper.Instance.Warning("无有效 WiFi 数据"));

            // 2. 过滤无效数据并限制数量（高德要求2-30个）
            var validWifis = wifiList
                .Where(w => !string.IsNullOrEmpty(w.Mac) && w.Signal != 0)
                .Take(30)
                .ToList();

            if (validWifis.Count < 2)
                return MyResults<Location>.Warning(LogHelper.Instance.Warning("WiFi 数量不足2个，无法精准定位"));

            // 3. 构建请求 URL
            var httpClient = new HttpClient() { Timeout = TimeSpan.FromSeconds(15) };
            const string apiUrl = "https://apilocate.amap.com/position";

            var urlBuilder = new StringBuilder();
            urlBuilder.Append($"{apiUrl}?accesstype=1"); // 1: WiFi定位
            urlBuilder.Append($"&key={Uri.EscapeDataString(amapKey)}");
            urlBuilder.Append("&output=json");

            // 4. 组装 macs 参数 (格式: mac1,signal1|mac2,signal2...)
            string macsParam = string.Join("|", validWifis.Select(w => w.ToApiString()));
            urlBuilder.Append($"&macs={Uri.EscapeDataString(macsParam)}");

            // 5. 组装 mmac 参数 (当前连接热点，格式: mac,signal,ssid)
            if (!string.IsNullOrEmpty(connectedWifiMac))
            {
                string mmacVal = $"{connectedWifiMac},{connectedWifiSignal ?? 0},{connectedWifiSsid ?? ""}";
                urlBuilder.Append($"&mmac={Uri.EscapeDataString(mmacVal)}");
            }

            try
            {
                // 6. 发送请求
                var response = await httpClient.GetAsync(urlBuilder.ToString());
                if (!response.IsSuccessStatusCode)
                    return MyResults<Location>.Warning(LogHelper.Instance.Warning($"HTTP请求失败: {response.StatusCode}"));

                var jsonStr = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(jsonStr);
                var root = doc.RootElement;

                // 7. 检查业务状态码
                if (root.TryGetProperty("status", out var statusProp) && statusProp.GetString() == "1")
                {
                    if (root.TryGetProperty("result", out var resultProp))
                    {
                        double? lng = null, lat = null;
                        string? address = null;

                        // 解析坐标 location: "经度,纬度"
                        if (resultProp.TryGetProperty("location", out var locProp))
                        {
                            var coords = locProp.GetString()?.Split(',');
                            if (coords != null && coords.Length == 2)
                            {
                                if (double.TryParse(coords[0], out var parsedLng) &&
                                    double.TryParse(coords[1], out var parsedLat))
                                {
                                    lng = parsedLng;
                                    lat = parsedLat;
                                }
                            }
                        }

                        // 解析地址描述 desc
                        if (resultProp.TryGetProperty("desc", out var descProp))
                            address = descProp.GetString();

                        if (lng.HasValue && lat.HasValue)
                            return MyResults<Location>.Success(null, new Location(lng, lat, address));

                        return MyResults<Location>.Warning(LogHelper.Instance.Warning("定位成功但缺少坐标数据"));
                    }

                    // 获取错误信息 info
                    string info = root.TryGetProperty("info", out var infoProp) ? infoProp.GetString() ?? "未知错误" : "未知错误";
                    return MyResults<Location>.Warning(LogHelper.Instance.Warning($"高德API错误: {info}"));
                }
                else
                {
                    // 处理 status != 1 的情况 (如 Key 无效)
                    string info = root.TryGetProperty("info", out var infoProp) ? infoProp.GetString() ?? "未知错误" : "未知错误";
                    string code = root.TryGetProperty("infocode", out var codeProp) ? codeProp.GetString() ?? "" : "";
                    return MyResults<Location>.Warning(LogHelper.Instance.Warning($"高德API异常 [{code}]: {info}"));
                }
            }
            catch (Exception ex)
            {
                return MyResults<Location>.Warning(LogHelper.Instance.Warning($"定位请求异常: {ex.Message}"));
            }
            finally
            {
                httpClient.Dispose();
            }
        }
        #endregion

        #region 根据“移动基站”获取“位置”
        /// <summary>根据“移动基站”获取“位置”</summary>
        public static async Task<MyActionResult<Location>> GetLocationByCellTowersAsync(
            string amapKey,
            string? scell,
            List<string>? ncells,
            string? imei = null)
        {
            var httpClient = new HttpClient() { Timeout = TimeSpan.FromSeconds(30) };
            const string apiUrl = "http://apilocate.amap.com/position";

            List<Cell> cells = new List<Cell>();

            void AddBaseStation(string cellStr)
            {
                var cell = Cell.Get(cellStr);
                if (cell == null) return;
                cells.Add(cell);
            }

            if (!string.IsNullOrEmpty(scell)) AddBaseStation(scell);
            if (ncells != null)
            {
                foreach (var ncell in ncells) AddBaseStation(ncell);
            }

            var sortedCells = cells.OrderByDescending(i => i.Signal).ToList();

            if (cells.Count < 1)
            {
                return MyResults<Location>.Warning(LogHelper.Instance.Warning("无有效基站数据"));
            }

            /** bts参数 */
            string btsParam = sortedCells.First().CellString;
            /** nearbts参数 */
            string nearbtsParam = string.Join("|", sortedCells.Skip(1).Take(3).Select(x => x.CellString));

            var urlBuilder = new StringBuilder($"{apiUrl}?accesstype=0&key={Uri.EscapeDataString(amapKey)}&cdma=0&network=GPRS&output=json");
            if (!string.IsNullOrEmpty(imei))
            {
                urlBuilder.Append($"&imei={Uri.EscapeDataString(imei)}");
            }

            urlBuilder.Append($"&bts={Uri.EscapeDataString(btsParam)}");

            if (!string.IsNullOrEmpty(nearbtsParam))
            {
                urlBuilder.Append($"&nearbts={Uri.EscapeDataString(nearbtsParam)}");
            }

            /** 请求URL */
            string requestUrl = urlBuilder.ToString();

            /** 响应 */
            var response = await httpClient.GetAsync(requestUrl);
            var responseStr = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseStr);
            var root = doc.RootElement;

            if (root.TryGetProperty("status", out var status) && status.GetString() == "1")
            {
                if (root.TryGetProperty("result", out var result))
                {
                    double? lng = null, lat = null;
                    string? address = null;

                    if (result.TryGetProperty("location", out var locProp))
                    {
                        var locStr = locProp.GetString()?.Split(',');
                        if (locStr?.Length == 2)
                        {
                            double.TryParse(locStr[0], out var parsedLng);
                            double.TryParse(locStr[1], out var parsedLat);
                            lng = parsedLng;
                            lat = parsedLat;
                        }
                    }
                    else if (root.TryGetProperty("location", out var locProp2))
                    {
                        var locStr = locProp2.GetString()?.Split(',');
                        if (locStr?.Length == 2)
                        {
                            double.TryParse(locStr[0], out var parsedLng);
                            double.TryParse(locStr[1], out var parsedLat);
                            lng = parsedLng;
                            lat = parsedLat;
                        }
                    }

                    if (result.TryGetProperty("desc", out var descProp))
                        address = descProp.GetString();
                    else if (root.TryGetProperty("desc", out var descProp2)) address = descProp2.GetString();

                    if (lng.HasValue && lat.HasValue)
                    {
                        return MyResults<Location>.Success(null, new Location(lng, lat, address));
                    }
                    else
                    {
                        return MyResults<Location>.Warning(LogHelper.Instance.Warning("高德定位失败: 响应中缺少 location 字段"));
                    }
                }
                else
                {
                    return MyResults<Location>.Warning(LogHelper.Instance.Warning("高德定位失败: 响应缺少 result 字段"));
                }
            }

            var info = root.TryGetProperty("info", out var infoProp) ? infoProp.GetString() : "未知错误";
            return MyResults<Location>.Warning(LogHelper.Instance.Warning($"高德定位失败: {info}"));
        }
        #endregion

        #region 根据“位置”获取“地址”
        /// <summary>根据“位置”获取“地址”</summary>
        public static async Task<MyActionResult<string>> GetAddressByLocation(
            double lng,
            double lat,
            string amapKey)
        {
            string location = $"{lng},{lat}";
            string url = $"https://restapi.amap.com/v3/geocode/regeo?key={amapKey}&location={location}&extensions=base";

            var response = await new HttpClient() { Timeout = TimeSpan.FromSeconds(30) }.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.GetProperty("status").GetString() != "1")
            {
                return MyResults<string>.Warning(LogHelper.Instance.Warning($"查询失败：{root.GetProperty("info").GetString()}"));
            }

            var regeocode = root.GetProperty("regeocode");
            var formattedAddress = regeocode.GetProperty("formatted_address").GetString();

            return MyResults<string>.Success(null, formattedAddress);
        }
        #endregion
    }

    #region 坐标转换
    public class CoordTransform
    {
        // GCJ02地球椭球参数
        private const double a = 6378245.0;           // 长半轴
        private const double ee = 0.00669342162296594323; // 第一偏心率平方

        // 角度转弧度
        private static double Rad(double d) => d * Math.PI / 180.0;

        // 判断是否在中国境外（直接返回原坐标）
        private static bool OutOfChina(double lng, double lat)
        {
            // 中国大陆大致范围（含南海）
            if (lng < 72.004 || lng > 137.8347) return true;
            if (lat < 0.8293 || lat > 55.8271) return true;
            return false;
        }

        // 纬度偏移计算
        private static double TransformLat(double lng, double lat)
        {
            double ret = -100.0 + 2.0 * lng + 3.0 * lat
                       + 0.2 * lat * lat + 0.1 * lng * lat
                       + 0.2 * Math.Sqrt(Math.Abs(lng));

            ret += (20.0 * Math.Sin(6.0 * lng * Math.PI) + 20.0 * Math.Sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.Sin(lat * Math.PI) + 40.0 * Math.Sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.Sin(lat / 12.0 * Math.PI) + 320 * Math.Sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;

            return ret;
        }

        // 经度偏移计算
        private static double TransformLng(double lng, double lat)
        {
            double ret = 300.0 + lng + 2.0 * lat
                       + 0.1 * lng * lng + 0.1 * lng * lat
                       + 0.1 * Math.Sqrt(Math.Abs(lng));

            ret += (20.0 * Math.Sin(6.0 * lng * Math.PI) + 20.0 * Math.Sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.Sin(lng * Math.PI) + 40.0 * Math.Sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.Sin(lng / 12.0 * Math.PI) + 300.0 * Math.Sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;

            return ret;
        }

        /// <summary>
        /// WGS84转GCJ02（火星坐标）
        /// </summary>
        /// <param name="wgsLng">WGS84经度</param>
        /// <param name="wgsLat">WGS84纬度</param>
        /// <returns>GCJ02坐标 (经度, 纬度)</returns>
        public static (double GcjLng, double GcjLat) WGS84ToGCJ02(double wgsLng, double wgsLat)
        {
            if (OutOfChina(wgsLng, wgsLat))
                return (wgsLng, wgsLat); // 境外直接返回

            double dlat = TransformLat(wgsLng - 105.0, wgsLat - 35.0);
            double dlng = TransformLng(wgsLng - 105.0, wgsLat - 35.0);

            double radLat = Rad(wgsLat);
            double magic = Math.Sin(radLat);
            magic = 1 - ee * magic * magic;
            double sqrtMagic = Math.Sqrt(magic);

            // 纬度偏移
            dlat = (dlat * 180.0) / (a / (sqrtMagic * sqrtMagic) * Math.PI);
            // 经度偏移
            dlng = (dlng * 180.0) / (a / sqrtMagic * Math.Cos(radLat) * Math.PI);

            return (wgsLng + dlng, wgsLat + dlat);
        }
    }
    #endregion
}
