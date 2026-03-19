using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Helpers;

namespace TigerSan.NET8.WebApi.Share
{
    public class AppDbContext : DbContext
    {
        #region 【Fields】
        private AppSettings _appSettings;
        #endregion 【Fields】

        #region 【Properties】
        public DbSet<AdminMgtEntity> AdminMgts { get; set; }
        public DbSet<AuthorityMgtEntity> AuthorityMgts { get; set; }
        public DbSet<BaseStationMgtEntity> BaseStationMgts { get; set; }
        public DbSet<CompanyMgtEntity> CompanyMgts { get; set; }
        public DbSet<PersonMgtEntity> PersonMgts { get; set; }
        public DbSet<RoleMgtEntity> RoleMgts { get; set; }
        #endregion 【Properties】

        #region 【Ctor】
        public AppDbContext(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region 配置时
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(_appSettings.ConnectionString, new MySqlServerVersion(new Version(8, 0, 45)));
        }
        #endregion

        #region 模型创建时
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 自动发现所有继承自IndexEntity的实体
            var entityTypes = modelBuilder.Model.GetEntityTypes()
                .Where(e => e.ClrType.IsSubclassOf(typeof(IdEntity)))
                .ToList();

            foreach (var entityType in entityTypes)
            {
                var idProperty = entityType.FindProperty(nameof(IdEntity.Id));
                if (idProperty == null) continue;

                // 注册雪花ID生成器
                idProperty.SetValueGeneratorFactory((p, t) =>
                        new SnowflakeIdGenerator(workerId: Environment.MachineName.GetHashCode() % 1024)); // 传入工作机器ID

                // 确保MySQL映射为BIGINT
                idProperty.SetColumnType("BIGINT");
            }
        }
        #endregion
        #endregion 【Functions】
    }
}
