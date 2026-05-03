using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Extensions;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Controllers;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Filters
{
    public class CompanyFilter : Attribute, IAsyncActionFilter
    {
        #region 【Fields】
        private readonly string Filter = "filter";
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        #endregion 【Fields】

        #region 【Ctor】
        public CompanyFilter(IUserService userService, ICompanyService companyService)
        {
            _userService = userService;
            _companyService = companyService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region 执行时
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // 按公司分类:
            if (context.HasAttribute<ClassifyByCompanyAttribute>())
            {
                // 是否包含Authorization头:
                var authorize = context.GetAuthorization();
                if (string.IsNullOrEmpty(authorize))
                {
                    context.Result = new JsonResult(MyResults<object>.AuthorizationHeaderMissing);
                    return;
                }

                // 解析Token:
                var tokenInfo = TokenGenerator.GetTokenInfo(authorize, Constants.SecretKey);
                if (tokenInfo == null)
                {
                    context.Result = new JsonResult(MyResults<object>.InvalidOrExpiredToken);
                    return;
                }

                var resGetUserInfo = await _userService.GetUserInfo(tokenInfo.UserId);
                var userInfo = resGetUserInfo.Data;
                if (userInfo == null)
                {
                    context.Result = new JsonResult(MyResults<object>.UserNotExist);
                    return;
                }

                List<CompanyEntity>? accessibleCompanies;

                // 是否为“根管理员”:
                if (userInfo.IsRoot)
                {
                    var resGetList = await _companyService.GetList();
                    accessibleCompanies = resGetList.Data;
                    if (accessibleCompanies == null)
                    {
                        context.Result = new JsonResult(resGetList);
                        return;
                    }
                }
                else
                {
                    // 获取“可访问公司”集合:
                    var resGetAccessibleCompanies = await _companyService.GetAccessibleCompanies(userInfo.Company.Id);
                    accessibleCompanies = resGetAccessibleCompanies.Data;
                    if (accessibleCompanies == null)
                    {
                        context.Result = new JsonResult(resGetAccessibleCompanies);
                        return;
                    }
                }

                // 设置“可访问公司”集合:
                var propName = nameof(IdControllerBase<IdEntityBase, IdServiceBase<IdEntityBase>>.AccessibleCompanies);
                ObjectHelper.SetProperty(context.Controller, propName, accessibleCompanies);

                // 是否不为“根管理员”，且包含filter参数:
                if (!userInfo.IsRoot && context.ActionArguments.TryGetValue(Filter, out var filterArgument))
                {
                    var filter = filterArgument as FilterDto ?? new FilterDto();

                    // 是否为“公司”控制器:
                    if (context.IsController<CompanyController>())
                    {
                        filter.Filters = [new PropFilter(){
                                PropName = nameof(CompanyEntity.Id),
                                Values = accessibleCompanies.Select(c => c.Id as object).ToList()
                            }];

                        if (context.IsAction(nameof(ICompanyService.GetList)))
                        {
                            context.Result = new JsonResult(MyResults<List<CompanyEntity>>.Success(null, accessibleCompanies));
                            return; // 直接返回“可访问公司”集合
                        }
                    }
                    else
                    {
                        var propNameService = nameof(IdControllerBase<IdEntityBase, IdServiceBase<IdEntityBase>>._service);
                        var service = ObjectHelper.GetField(context.Controller, propNameService) as IDbSetConfig;
                        if (service == null)
                        {
                            context.Result = new JsonResult(MyResults<object>.IsNull(nameof(service)));
                            return;
                        }

                        FilterHelper.SetCompanyParentFilter(service.DbSetConfig, ref filter, accessibleCompanies);
                    }

                    context.ActionArguments.Remove(Filter);
                    context.ActionArguments.Add(Filter, filter);
                }
            }

            await next();
        }
        #endregion
        #endregion 【Functions】
    }
}
