using TigerSan.CsvLog;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    public static class ObjectHelper
    {
        public static object? GetField<T>(T obj, string propName) where T : class
        {
            var fieldInfo = obj.GetType().GetField(propName);
            if (fieldInfo == null)
            {
                LogHelper.Instance.IsNull(nameof(fieldInfo));
                return null;
            }

            return fieldInfo.GetValue(obj);
        }

        public static bool SetField<T>(T obj, string propName, object? value) where T : class
        {
            var fieldInfo = obj.GetType().GetField(propName);
            if (fieldInfo == null)
            {
                LogHelper.Instance.IsNull(nameof(fieldInfo));
                return false;
            }

            fieldInfo.SetValue(obj, value);

            return true;
        }

        public static object? GetProperty<T>(T obj, string propName) where T : class
        {
            var propInfo = obj.GetType().GetProperty(propName);
            if (propInfo == null)
            {
                LogHelper.Instance.IsNull(nameof(propInfo));
                return null;
            }

            return propInfo.GetValue(obj);
        }

        public static bool SetProperty<T>(T obj, string propName, object? value) where T : class
        {
            var propInfo = obj.GetType().GetProperty(propName);
            if (propInfo == null)
            {
                LogHelper.Instance.IsNull(nameof(propInfo));
                return false;
            }

            propInfo.SetValue(obj, value);

            return true;
        }
    }
}
