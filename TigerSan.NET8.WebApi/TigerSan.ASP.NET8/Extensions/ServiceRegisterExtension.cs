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

        #region 注册“服务”
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddTransient<IBaseStationMgtService, BaseStationMgtService>();
        }
        #endregion
    }
}
