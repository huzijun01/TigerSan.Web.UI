using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Attributes;
using TigerSan.NET8.WebApi.Extensions;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Filters
{
    public class CompanyClassifyFilter : Attribute, IAsyncActionFilter
    {
        #region 【Fields】
        private readonly string Filter = "filter";
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        #endregion 【Fields】

        #region 【Ctor】
        public CompanyClassifyFilter(IUserService userService, ICompanyService companyService)
        {
            _userService = userService;
            _companyService = companyService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [Private]
        #region 获取“后代公司”集合
        /// <summary>获取“后代公司”集合</summary>
        /// <param name="companies">“公司”集合</param>
        /// <param name="rootCompany">根公司</param>
        /// <returns>“后代公司”集合</returns>
        private List<CompanyEntity> GetSubCompanies(List<CompanyEntity> companies, CompanyEntity rootCompany)
        {
            var nodes = Companies2TreeNodes(companies);
            if (nodes == null)
            {
                LogHelper.Instance.IsNull(nameof(nodes));
                return [];
            }

            var subs = TreeHelper.GetSubs(nodes, rootCompany.Id);
            if (subs == null) return [];

            return subs.Select(n => n.Data).ToList();
        }
        #endregion

        #region “公司集合”转“树节点集合”
        private List<TreeNode<CompanyEntity>>? Companies2TreeNodes(List<CompanyEntity> companies)
        {
            return TreeHelper.List2TreeNodes(
                companies,
                item => item.Id,
                item => item.Parent);
        }
        #endregion
        #endregion [Private]

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

                if (context.ActionArguments.TryGetValue(Filter, out var filterArgument))
                {
                    var filter = filterArgument as FilterDto ?? new FilterDto();

                    if (context.IsController("Company"))
                    {
                        var resGetUserInfo = await _userService.GetUserInfo(tokenInfo.UserId);
                        var userInfo = resGetUserInfo.Data;
                        if (userInfo == null)
                        {
                            context.Result = new JsonResult(MyResults<object>.UserNotExist);
                            return;
                        }

                        if (!userInfo.IsAdmin && !userInfo.IsRoot)
                        {
                            var resCompanies = await _companyService.GetList();
                            var companies = resCompanies.Data;
                            if (companies == null)
                            {
                                context.Result = new JsonResult(resCompanies);
                                return;
                            }

                            var company = companies.FirstOrDefault(c => c.Id == userInfo.Company.Id);
                            if (company == null)
                            {
                                context.Result = new JsonResult(MyResults<object>.Error(LogHelper.Instance.IsNull(nameof(company))));
                                return;
                            }

                            var subCompanies = GetSubCompanies(companies, company);
                            subCompanies.Add(company);

                            filter.Filters = [new PropFilter(){
                                PropName = nameof(CompanyEntity.Id),
                                Values = subCompanies.Select(c => c.Id as object).ToList()
                            }];

                            context.ActionArguments.Remove(Filter);
                            context.ActionArguments.Add(Filter, filter);
                        }
                    }
                }
            }

            var res = await next();
        }
        #endregion 【Functions】
    }
}
