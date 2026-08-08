using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Filters;
using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Services.Models;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Extensions
{
    public static class ServiceRegisterExtension
    {
        #region 添加“过滤器”
        public static void AddFilters(this WebApplicationBuilder builder)
        {
            var services = builder.Services;

            services.AddControllersWithViews(option =>
            {
                option.Filters.Add<ApiAuthorizeFilter>();
                option.Filters.Add<CompanyFilter>();

                if (builder.Environment.IsDevelopment())
                {
                    option.Filters.Add<LogFilterAttribute>();
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
            // BaseSettings:
            services.AddTransient<IAdminService, AdminService>();
            services.AddTransient<IAuthorityService, AuthorityService>();
            services.AddTransient<ICompanyService, CompanyService>();
            services.AddTransient<IFileService, FileService>();
            services.AddTransient<IDepartmentService, DepartmentService>();
            services.AddTransient<IPersonService, PersonService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<ISiteService, SiteService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IBatchService, BatchService>();
            // Business:
            services.AddTransient<IAssetService, AssetService>();
            services.AddTransient<IAssetRecordService, AssetRecordService>();
            services.AddTransient<IInventoryRecordService, InventoryRecordService>();
            services.AddTransient<IVehicleService, VehicleService>();
            services.AddTransient<ITransferService, TransferService>();
            // Dictionaries:
            services.AddTransient<IAssetTypeService, AssetTypeService>();
            services.AddTransient<IScenarioService, ScenarioService>();
            services.AddTransient<ISiteTypeService, SiteTypeService>();
            services.AddTransient<IStationTypeService, StationTypeService>();
            services.AddTransient<ITagTypeService, TagTypeService>();
            // Equipments:
            services.AddTransient<IBaseStationService, BaseStationService>();
            services.AddTransient<IBindingRecordService, BindingRecordService>();
            services.AddTransient<IStationRecordService, StationRecordService>();
            services.AddTransient<ITagService, TagService>();
        }
        #endregion
    }
}
