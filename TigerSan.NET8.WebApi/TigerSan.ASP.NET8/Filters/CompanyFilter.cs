using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Extensions;
using TigerSan.NET8.WebApi.Controllers;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Services.Models;
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
                        context.Result = new JsonResult(accessibleCompanies);
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
                        context.Result = new JsonResult(accessibleCompanies);
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

                        if (service.GetType() == typeof(BaseStationService))
                        {

                        }
                        SetCompanyFilter(service.DbSetConfig, ref filter, accessibleCompanies);
                    }

                    context.ActionArguments.Remove(Filter);
                    context.ActionArguments.Add(Filter, filter);
                }
            }

            var res = await next();
        }
        #endregion

        #region [Filter]
        #region 获取“父表”过滤器
        /// <summary>获取“父表”过滤器</summary>
        private ParentFilter? GetParentFilter<TParentEntity>(
            DbSetConfig dbSetConfig,
            FilterDto? filter)
            where TParentEntity : IdEntityBase
        {
            if (filter == null) return null;

            var parentFilter = filter.Parent;
            var parentConfig = dbSetConfig.Parent;

            while (parentFilter != null && parentConfig != null)
            {
                if (parentConfig.EntityType == typeof(TParentEntity)) return parentFilter;
                parentFilter = parentFilter.Parent;
                parentConfig = parentConfig.Parent;
            }

            return null;
        }
        #endregion

        #region 设置“父表”过滤器
        /// <summary>设置“父表”过滤器</summary>
        private bool SetParentFilter<TParentEntity>(
            DbSetConfig dbSetConfig,
            ref FilterDto? filter,
            ParentFilter parentFilter)
            where TParentEntity : IdEntityBase
        {
            if (filter == null) filter = new FilterDto();

            var findParentFilter = filter.Parent;
            if (findParentFilter == null) findParentFilter = filter.Parent = new ParentFilter();
            var parentConfig = dbSetConfig.Parent;

            while (parentConfig != null && findParentFilter != null)
            {
                if (parentConfig.EntityType == typeof(TParentEntity))
                {
                    findParentFilter.Id = parentFilter.Id;
                    findParentFilter.Ids = parentFilter.Ids;
                    return true;
                }

                if (parentConfig.Parent != null && findParentFilter.Parent == null)
                {
                    findParentFilter.Parent = new ParentFilter();
                }

                findParentFilter = findParentFilter.Parent;
                parentConfig = parentConfig.Parent;
            }

            return false;
        }
        #endregion

        #region 设置“公司”过滤器
        /// <summary>设置“公司”过滤器</summary>
        private bool SetCompanyFilter(
            DbSetConfig dbSetConfig,
            ref FilterDto? filter,
            List<CompanyEntity> accessibleCompanyEntities)
        {
            if (accessibleCompanyEntities == null) return false;

            var accessibleCompanies = accessibleCompanyEntities.Select(i => i.Id).ToList();

            var companyFilter = GetParentFilter<CompanyEntity>(dbSetConfig, filter);
            if (companyFilter == null)
            {
                companyFilter = new ParentFilter() { Ids = accessibleCompanies };
            }
            else if (companyFilter.Ids != null || companyFilter.Id != null)
            {
                if (companyFilter.Id != null && !accessibleCompanies.Contains(companyFilter.Id.Value))
                    companyFilter.Id = null;
                if (companyFilter.Ids != null)
                    companyFilter.Ids = companyFilter.Ids.Where(i => accessibleCompanies.Contains(i)).ToList();

                if (companyFilter.Ids == null && companyFilter.Id == null)
                    companyFilter.Ids = accessibleCompanies;
            }
            else
            {
                companyFilter.Ids = accessibleCompanies;
            }

            SetParentFilter<CompanyEntity>(dbSetConfig, ref filter, companyFilter);

            return true;
        }
        #endregion
        #endregion [Filter]
        #endregion 【Functions】
    }
}
