using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class StationRecordService : IdServiceBase<StationRecordEntity>, IStationRecordService
    {
        #region 【Ctor】
        static StationRecordService()
        {
            SetDbSetConfig(nameof(StationRecordEntity.Station))
                .SetParent(typeof(BaseStationEntity), nameof(_db.BaseStations), nameof(BaseStationEntity.Site))
                .SetParent(typeof(SiteEntity), nameof(_db.Sites), nameof(SiteEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public StationRecordService(AppDbContext db) : base(db, db.StationRecords)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [Private]
        #region 是否“移动”
        /// <summary>是否“移动”</summary>
        private bool IsMoved(StationRecordEntity oldRecord, StationRecordEntity newRecord)
        {
            if (newRecord.Longitude == null || newRecord.Latitude == null) return false;
            if (oldRecord.Longitude == null || oldRecord.Latitude == null) return true;
            var p1 = new Point2(oldRecord.Longitude.Value, oldRecord.Latitude.Value);
            var p2 = new Point2(newRecord.Longitude.Value, newRecord.Latitude.Value);
            return p1.Haversine(p2) > GlobalSettings.DistanceThresholdMeters;
        }
        #endregion
        #endregion [Private]

        #region [查]
        #region 获取“路径”
        /// <summary>获取“路径”</summary>
        public async Task<MyActionResult<List<StationRecordEntity>>> GetPath(
            long station,
            DateTime? start = null,
            DateTime? end = null,
            LocationModes? locationMode = null,
            FilterDto? filter = null)
        {
            try
            {
                var queryable = start != null && end != null
                    ? _dbSet.AsNoTracking().Where(i => i.Station == station
                    && i.OnlineState == OnlineStates.Online
                    && i.Longitude != null && i.Longitude.Value > 0
                    && i.Latitude != null && i.Latitude.Value > 0
                    && i.ReportTime >= start && i.ReportTime <= end)
                    : _dbSet.AsNoTracking().Where(i => i.Station == station
                    && i.OnlineState == OnlineStates.Online
                    && i.Longitude != null && i.Longitude.Value > 0
                    && i.Latitude != null && i.Latitude.Value > 0);

                if (locationMode != null)
                {
                    queryable = queryable.Where(i => i.LocationMode == locationMode);
                }

                var res = await GetFilter(queryable, filter);
                queryable = res.Data;
                if (queryable == null)
                {
                    return MyResults<List<StationRecordEntity>>.Error(res.Message);
                }

                var resSort = queryable.Sort(nameof(StationRecordEntity.ReportTime));
                queryable = resSort.Data;
                if (queryable == null)
                {
                    return MyResults<List<StationRecordEntity>>.Error(resSort.Message);
                }

                return MyResults<List<StationRecordEntity>>.Success(null, await queryable.ToListAsync());
            }
            catch (Exception e)
            {
                return MyResults<List<StationRecordEntity>>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        public new async Task<MyActionResult<StationRecordEntity>> Add(StationRecordEntity entity, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                #region 判断“是否改变”
                var lastRecord = await _db.StationRecords.OrderByDescending(i => i.ReportTime).FirstOrDefaultAsync();
                if (lastRecord != null && entity.Equals(lastRecord) && !IsMoved(lastRecord, entity))
                    return MyResults<StationRecordEntity>.Success(null, entity);
                #endregion

                entity.UpdateId();
                _dbSet.Add(entity);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务

                return MyResults<StationRecordEntity>.Success(null, entity);
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<StationRecordEntity>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 添加“多条数据”
        public new async Task<MyActionResult<object>> AddRange(List<StationRecordEntity> entities, bool isBeginTransaction = true)
        {
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                #region 判断“是否改变”
                var changes = new List<StationRecordEntity>();
                foreach (var entity in entities)
                {
                    var lastRecord = await _db.StationRecords.OrderByDescending(i => i.ReportTime).FirstOrDefaultAsync();
                    if (lastRecord != null && entity.Equals(lastRecord) && !IsMoved(lastRecord, entity)) continue;
                    changes.Add(entity);
                }
                #endregion

                changes.UpdateId();
                await _dbSet.AddRangeAsync(changes);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return MyResults<object>.OperationSuccess;
        }
        #endregion
        #endregion [增]

        #region [Others]
        #region 清理“过期数据”
        public async Task<MyActionResult<int>> ClearExpiredRecord()
        {
            try
            {
                var expirationThreshold = DateTimeHelper.GetUtcNow().AddDays(-GlobalSettings.StationRecordKeepDays);

                var deletedCount = await _dbSet
                    .Where(r => r.ReportTime < expirationThreshold)
                    .ExecuteDeleteAsync();

                return MyResults<int>.Success(null, deletedCount);
            }
            catch (Exception e)
            {
                return MyResults<int>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [Others]
        #endregion 【Functions】
    }
}
