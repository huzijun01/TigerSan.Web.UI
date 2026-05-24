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
        public Point2(double x, double y) { X = x; Y = y; }
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
