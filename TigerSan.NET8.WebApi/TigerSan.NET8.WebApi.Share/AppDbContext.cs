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
        /// <summary>“DbSet属性”字典</summary>
        public static readonly Dictionary<string, PropertyInfo> _dbSetProps = GetDbSetProps();
        #endregion 【Fields】

        #region 【Properties】
        // BaseSettings:
        public DbSet<AdminEntity> Admins { get; set; }
        public DbSet<AuthorityEntity> Authoritys { get; set; }
        public DbSet<CompanyEntity> Companies { get; set; }
        public DbSet<DepartmentEntity> Departments { get; set; }
        public DbSet<PersonEntity> Persons { get; set; }
        public DbSet<RoleEntity> Roles { get; set; }
        public DbSet<SiteEntity> Sites { get; set; }
        public DbSet<BatchEntity> Batches { get; set; }
        // Business:
        public DbSet<AssetEntity> Assets { get; set; }
        // Dictionaries:
        public DbSet<AssetStateEntity> AssetStates { get; set; }
        public DbSet<AssetTypeEntity> AssetTypes { get; set; }
        public DbSet<ScenarioEntity> Scenarios { get; set; }
        public DbSet<SiteTypeEntity> SiteTypes { get; set; }
        public DbSet<StationTypeEntity> StationTypes { get; set; }
        public DbSet<TagTypeEntity> TagTypes { get; set; }
        // Equipments:
        public DbSet<BaseStationEntity> BaseStations { get; set; }
        public DbSet<TagEntity> Tags { get; set; }
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
        #region [Private]
        #region 获取“DbSet属性”字典
        /// <summary>获取“DbSet属性”字典</summary>
        private static Dictionary<string, PropertyInfo> GetDbSetProps()
        {
            var dbSetProps = new Dictionary<string, PropertyInfo>();
            var properties = typeof(AppDbContext).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var property in properties)
            {
                if (property.PropertyType.IsGenericType &&
                    property.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>))
                {
                    var entityType = property.PropertyType.GetGenericArguments()[0];
                    if (typeof(IdEntityBase).IsAssignableFrom(entityType))
                    {
                        dbSetProps[property.Name] = property;
                    }
                }
            }

            return dbSetProps;
        }
        #endregion
        #endregion [Private]

        #region [Static]
        #region 获取“DbSet名称”
        /// <summary>获取“DbSet名称”</summary>
        public static string GetDbSetName(Type dbSetType)
        {
            var dbSetProp = _dbSetProps.Values.FirstOrDefault(p => p.PropertyType == dbSetType);
            if (dbSetProp == null)
            {
                LogHelper.Instance.Warning($"The DbSet property for type '{dbSetType.Name}' was not found!");
                return string.Empty;
            }
            return dbSetProp.Name;
        }
        #endregion
        #endregion [Static]

        #region 获取“DbSet”
        /// <summary>获取“DbSet”</summary>
        public IQueryable? GetDbSet(string dbSetName)
        {
            if (_dbSetProps == null)
            {
                LogHelper.Instance.IsNull(nameof(_dbSetProps));
                return null;
            }

            // 查找匹配的DbSet属性:
            _dbSetProps.TryGetValue(dbSetName, out var property);

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
