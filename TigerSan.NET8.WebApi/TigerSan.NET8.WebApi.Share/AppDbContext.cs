using System.Reflection;
using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share
{
    public class AppDbContext : DbContext
    {
        #region 【Fields】
        private AppSettings _appSettings;
        /// <summary>“DbSet属性”缓存</summary>
        private static Dictionary<string, PropertyInfo>? _dbSetPropCaches;
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
            InitializeDbSetPropCaches();
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
        #region [Private]
        #region 初始化“DbSet属性”缓存
        /// <summary>初始化“DbSet属性”缓存</summary>
        private void InitializeDbSetPropCaches()
        {
            if (_dbSetPropCaches != null) return;
            _dbSetPropCaches = new Dictionary<string, PropertyInfo>();

            var properties = typeof(AppDbContext).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (var property in properties)
            {
                if (property.PropertyType.IsGenericType &&
                    property.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>))
                {
                    var entityType = property.PropertyType.GetGenericArguments()[0];
                    if (typeof(IdEntityBase).IsAssignableFrom(entityType))
                    {
                        _dbSetPropCaches[property.Name] = property;
                    }
                }
            }
        }
        #endregion
        #endregion [Private]

        #region 获取“DbSet”
        /// <summary>获取“DbSet”</summary>
        public IQueryable? GetDbSet(string dbSetName)
        {
            if (_dbSetPropCaches == null)
            {
                LogHelper.Instance.IsNull(nameof(_dbSetPropCaches));
                return null;
            }

            // 查找匹配的DbSet属性:
            _dbSetPropCaches.TryGetValue(dbSetName, out var property);

            // 验证属性存在:
            if (property == null)
            {
                LogHelper.Instance.Warning($"The attribute named '{dbSetName}' of DbSet was not found!");
                return null;
            }

            var dbSet = (IQueryable)property.GetValue(this)!;
            return dbSet.AsQueryable();
        }
        #endregion
        #endregion 【Functions】
    }
}
