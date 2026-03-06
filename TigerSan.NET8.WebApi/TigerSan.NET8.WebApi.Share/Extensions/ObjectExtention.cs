using System.Reflection;

namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class ObjectExtention
    {
        #region 浅复制
        public static void ShallowCopy<T>(this T target, T source) where T : class
        {
            // 获取所有公共实例属性:
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var prop in properties)
            {
                // 检查属性是否可写:
                if (prop.CanWrite)
                {
                    // 获取源属性值:
                    var value = prop.GetValue(source);
                    // 赋值到目标对象:
                    prop.SetValue(target, value);
                }
            }
        }
        #endregion
    }
}
