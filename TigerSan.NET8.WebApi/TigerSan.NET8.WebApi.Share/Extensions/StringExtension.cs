using System.Text;
namespace TigerSan.NET8.WebApi.Share.Extensions
{
    public static class StringExtension
    {
        public static string ToSnakeCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            var sb = new StringBuilder();
            for (int i = 0; i < input.Length; i++)
            {
                if (i > 0 && char.IsUpper(input[i]) && input[i - 1] != '_')
                    sb.Append('_');
                sb.Append(char.ToLower(input[i]));
            }
            return sb.ToString();
        }
    }
}
