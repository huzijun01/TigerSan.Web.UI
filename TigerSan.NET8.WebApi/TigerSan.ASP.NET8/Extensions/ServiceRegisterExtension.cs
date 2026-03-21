using TigerSan.NET8.WebApi.Filters;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models;
using TigerSan.NET8.WebApi.Share;

namespace TigerSan.NET8.WebApi.Extensions
{
    static class ServiceRegisterExtension
    {
        #region 添加“过滤器”
        public static void AddFilters(this WebApplicationBuilder builder)
        {
            var services = builder.Services;

            services.AddControllersWithViews(option =>
            {
                if (builder.Environment.IsDevelopment())
                {
                    option.Filters.Add<MyAsyncActionFilterAttribute>();
                }
            });
        }
        #endregion

        #region 添加“数据库上下文”
        public static void AddDbContext(this IServiceCollection services)
        {
            services.RegisterAppSettings();
            services.AddDbContext<AppDbContext>();
        }
        #endregion

        #region 添加“CORS服务”
        public static void AddAllowAllCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy
                        .AllowAnyOrigin()       // 允许任何来源
                        .AllowAnyMethod()       // 允许任何HTTP方法
                        .AllowAnyHeader();      // 允许任何头信息
                });
            });
        }
        #endregion

        #region 使用“CORS服务”
        public static void UseAllowAllCors(this WebApplication app)
        {
            app.UseCors("AllowAll");
        }
        #endregion

        #region 注册“服务”
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddTransient<IAdminService, AdminService>();
            services.AddTransient<IAuthorityService, AuthorityService>();
            services.AddTransient<IBaseStationService, BaseStationService>();
            services.AddTransient<ICompanyService, CompanyService>();
            services.AddTransient<IDepartmentService, DepartmentService>();
            services.AddTransient<IPersonService, PersonService>();
            services.AddTransient<IRoleService, RoleService>();
        }
        #endregion
    }
}
