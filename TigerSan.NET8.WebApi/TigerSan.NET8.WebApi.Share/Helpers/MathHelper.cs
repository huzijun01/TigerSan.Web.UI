using TigerSan.CsvLog;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    #region 二维点
    /// <summary>二维点</summary>
    public class Point2
    {
        public double X { get; set; }
        public double Y { get; set; }

        public Point2() { }
        public Point2(Point2 p) { X = p.X; Y = p.Y; }
        public Point2(double x, double y) { X = x; Y = y; }
    }
    #endregion

    #region “二维点”拓展方法
    /// <summary>“二维点”拓展方法</summary>
    public static class Point2Extension
    {
        /// <summary>加</summary>
        public static Point2 Add(this Point2 p1, Point2 p2)
        {
            p1.X += p2.X;
            p1.Y += p2.Y;
            return p1;
        }

        /// <summary>减</summary>
        public static Point2 Sub(this Point2 p1, Point2 p2)
        {
            p1.X -= p2.X;
            p1.Y -= p2.Y;
            return p1;
        }

        /// <summary>欧氏距离</summary>
        public static double Distance(this Point2 p1, Point2 p2)
        {
            double dx = p1.X - p2.X;
            double dy = p1.Y - p2.Y;
            return Math.Sqrt(dx * dx + dy * dy);
        }

        /// <summary>Haversine距离（考虑地球曲率，返回米）</summary>
        public static double Haversine(this Point2 p1, Point2 p2)
        {
            const double R = 6371000; // 地球半径（米）
            double lat1 = p1.Y * Math.PI / 180;
            double lon1 = p1.X * Math.PI / 180;
            double lat2 = p2.Y * Math.PI / 180;
            double lon2 = p2.X * Math.PI / 180;

            double dLat = lat2 - lat1;
            double dLon = lon2 - lon1;

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1) * Math.Cos(lat2) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
    }
    #endregion

    public static class MathHelper
    {
        #region 获取“二维点”集合
        /// <summary>获取“二维点”集合</summary>
        public static List<Point2>? GetPoint2s(string? strPath)
        {
            if (strPath == null) return null;
            var points = new List<Point2>();

            var strPoints = strPath.Split(';');
            foreach (var strPoint in strPoints)
            {
                var values = strPoint.Split(',');
                if (values.Length != 2)
                {
                    LogHelper.Instance.Warning($"The length of the {nameof(values)} is not equal to 2!");
                    return null;
                }

                if (double.TryParse(values[0], out var x)
                    && double.TryParse(values[1], out var y))
                {
                    points.Add(new Point2(x, y));
                }
                else
                {
                    LogHelper.Instance.Warning("Cannot parse the string to a number!");
                    return null;
                }
            }

            return points;
        }
        #endregion

        #region 获取“路径”字符串
        /// <summary>获取“路径”字符串</summary>
        public static string? GetPathString(List<Point2> points)
        {
            var strPoints = points.Select(i => $"{i.X},{i.Y}").ToList();
            return string.Join(';', strPoints);
        }
        #endregion
    }
}
