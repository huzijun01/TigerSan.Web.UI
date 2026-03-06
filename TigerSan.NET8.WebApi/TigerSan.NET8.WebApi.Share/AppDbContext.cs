using Microsoft.EntityFrameworkCore;
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
        public DbSet<BaseStationMgtEntity> BaseStationMgts { get; set; }
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
        }
        #endregion
        #endregion 【Functions】
    }
}
