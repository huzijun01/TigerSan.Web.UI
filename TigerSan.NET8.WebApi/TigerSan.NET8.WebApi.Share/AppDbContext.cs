using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share
{
    public class AppDbContext : DbContext
    {
        #region 【Fields】
        private AppSettings _appSettings;
        #endregion 【Fields】

        #region 【Properties】
        public DbSet<AdminEntity> Admins { get; set; }
        public DbSet<AuthorityEntity> Authoritys { get; set; }
        public DbSet<BaseStationEntity> BaseStations { get; set; }
        public DbSet<CompanyEntity> Companies { get; set; }
        public DbSet<DepartmentEntity> Departments { get; set; }
        public DbSet<PersonEntity> Persons { get; set; }
        public DbSet<RoleEntity> Roles { get; set; }
        public DbSet<SiteEntity> Sites { get; set; }
        public DbSet<SiteTypeEntity> SiteTypes { get; set; }
        public DbSet<StationTypeEntity> StationTypes { get; set; }
        #endregion 【Properties】

        #region 【Ctor】
        public AppDbContext(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }
        #endregion 【Ctor】

        #region 【Override】
        #region 配置时
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(_appSettings.ConnectionString, new MySqlServerVersion(new Version(8, 0, 45)));
        }
        #endregion

        #region 模型创建时
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
        #endregion
        #endregion 【Override】

        #region 【Functions】
        /// <summary>根据“DbSet名称”获取“Queryable”</summary>
        public IQueryable? GetQueryable(string dbSetName)
        {
            // 获取所有公共实例属性
            var properties = typeof(AppDbContext).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // 查找匹配的DbSet属性
            var dbSetProperty = properties.FirstOrDefault(p =>
                p.Name.Equals(dbSetName, StringComparison.OrdinalIgnoreCase) &&
                p.PropertyType.IsGenericType &&
                p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

            // 验证属性存在
            if (dbSetProperty == null)
            {
                LogHelper.Instance.Warning($"未找到名为 '{dbSetName}' 的DbSet属性");
                return null;
            }

            // 获取DbSet元素类型
            var entityType = dbSetProperty.PropertyType.GetGenericArguments()[0];

            // 验证类型继承关系
            if (!typeof(IdEntityBase).IsAssignableFrom(entityType))
            {
                LogHelper.Instance.Warning($"DbSet '{dbSetName}' 的实体类型必须继承自 IdEntityBase");
                return null;
            }

            // 获取DbSet实例并转换为基类型
            var dbSet = (IQueryable)dbSetProperty.GetValue(this)!;
            return dbSet.AsQueryable();
        }
        #endregion 【Functions】
    }
}
