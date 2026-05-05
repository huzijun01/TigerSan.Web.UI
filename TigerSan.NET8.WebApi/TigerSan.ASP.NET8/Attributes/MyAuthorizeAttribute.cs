using Microsoft.AspNetCore.Mvc.Filters;

namespace TigerSan.NET8.WebApi.Attributes
{
    /// <summary>需要授权</summary>
    public class NeedAuthorizeAttribute : Attribute, IFilterMetadata
    {
    }

    /// <summary>无需授权</summary>
    public class NoNeedAuthorizeAttribute : Attribute, IFilterMetadata
    {
    }

    /// <summary>按公司过滤</summary>
    public class FilterByCompanyAttribute : Attribute, IFilterMetadata
    {
    }
}
