using System.Runtime.CompilerServices;
using TigerSan.NET8.WebApi.Share.Extensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace TigerSan.NET8.WebApi.Share.Attributes
{
    /// <summary>
    /// 自动获取“属性名称”，并转换为“蛇形命名”的“列特性”
    /// </summary>
    public class SnakeColumnAttribute : ColumnAttribute
    {
        public SnakeColumnAttribute([CallerMemberName] string name = "") : base(name.ToSnakeCase()) { }
    }
}
