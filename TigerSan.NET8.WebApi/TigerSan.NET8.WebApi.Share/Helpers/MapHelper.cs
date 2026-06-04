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

    public static class MapHelper
    {
        #region 根据“移动基站”获取“位置”
        /// <summary>根据“移动基站”获取“位置”</summary>
        public static async Task<MyActionResult<Location>> GetLocationByCellTowersAsync(
            string? scell,
            List<string>? ncells,
            string? imei,
            string amapKey)
        {
            HttpClient httpClient = new HttpClient();
            const string apiUrl = "http://apilocate.amap.com/position";

            List<string> validCells = new List<string>();

            void AddBaseStation(string cellStr)
            {
                var parts = cellStr.Split(',');
                if (parts.Length >= 5)
                {
                    if (!int.TryParse(parts[0], out int mcc)) return;
                    if (!int.TryParse(parts[1], out int mnc)) return;
                    if (!int.TryParse(parts[2], out int lac)) return;
                    if (!int.TryParse(parts[3], out int cellid)) return;
                    if (!int.TryParse(parts[4], out int rawSignal)) return;

                    int signal = rawSignal / 10;
                    if (signal < -100 || signal > -20)
                    {
                        //Console.WriteLine($"【基站定位】忽略信号过弱的基站: 原始={rawSignal}, 转换后={signal} dBm");
                        return;
                    }

                    string bts = $"{mcc},{mnc},{lac},{cellid},{signal}";
                    validCells.Add(bts);
                }
            }

            if (!string.IsNullOrEmpty(scell)) AddBaseStation(scell);
            if (ncells != null)
            {
                foreach (var ncell in ncells)
                    AddBaseStation(ncell);
            }

            if (validCells.Count == 0)
            {
                return MyResults<Location>.Warning(LogHelper.Instance.Warning("无有效基站数据"));
            }

            var sortedCells = validCells
                .Select(cell => new { Cell = cell, Signal = int.Parse(cell.Split(',').Last()) })
                .OrderByDescending(x => x.Signal)
                .ToList();

            string btsParam = sortedCells.First().Cell;
            string nearbtsParam = string.Join("|", sortedCells.Skip(1).Take(7).Select(x => x.Cell));

            //Console.WriteLine($"【基站定位】bts参数: {btsParam}");
            //Console.WriteLine($"【基站定位】nearbts参数: {nearbtsParam}");

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

            string requestUrl = urlBuilder.ToString();
            //Console.WriteLine($"【基站定位】请求URL: {requestUrl}");

            var response = await httpClient.GetAsync(requestUrl);
            var responseStr = await response.Content.ReadAsStringAsync();
            //Console.WriteLine($"【高德基站定位响应】{responseStr}");

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
                    else if (root.TryGetProperty("desc", out var descProp2))
                        address = descProp2.GetString();

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

            var response = await new HttpClient().GetAsync(url);
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
}
