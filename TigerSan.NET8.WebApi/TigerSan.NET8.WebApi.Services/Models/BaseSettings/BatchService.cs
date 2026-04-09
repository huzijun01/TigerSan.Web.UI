using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class BatchService : IdServiceBase<BatchEntity>, IBatchService
    {
        #region 【Ctor】
        static BatchService()
        {
            SetDbSetConfig(nameof(BatchEntity.Company))
                .SetParent(typeof(CompanyEntity), nameof(_db.Companies));
        }

        public BatchService(AppDbContext db) : base(db, db.Batches)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(BatchEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entity.UpdateId();
                entity.ShipmentTime = DateTime.Now;
                _dbSet.Add(entity);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<BatchEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                entities.UpdateId();
                entities.ForEach(e => e.ShipmentTime = DateTime.Now);
                await _dbSet.AddRangeAsync(entities);

                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]
        #endregion 【Functions】
    }
}
