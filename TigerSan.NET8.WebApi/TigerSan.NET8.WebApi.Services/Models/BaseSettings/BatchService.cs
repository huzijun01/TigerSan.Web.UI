using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;

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
        #region [查]
        #region 获取“公司”
        /// <summary>获取“公司”</summary>
        public async Task<CompanyEntity?> GetCompany(long id)
        {
            try
            {
                var batch = await _dbSet.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
                if (batch == null)
                {
                    LogHelper.Instance.IsNull(nameof(batch));
                    return null;
                }

                var company = await _db.Companies.AsNoTracking().FirstOrDefaultAsync(c => c.Id == batch.Company);
                if (company == null)
                {
                    LogHelper.Instance.IsNull(nameof(company));
                    return null;
                }

                return company;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return null;
            }
        }
        #endregion

        #region 获取“公司”字典
        /// <summary>获取“公司”字典</summary>
        public async Task<Dictionary<long, CompanyEntity>> GetCompanyDict(List<long> ids)
        {
            var dict = new Dictionary<long, CompanyEntity>();
            try
            {
                foreach (var id in ids)
                {
                    var batch = await _dbSet.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
                    if (batch == null)
                    {
                        LogHelper.Instance.IsNull(nameof(batch));
                        continue;
                    }

                    var company = await _db.Companies.AsNoTracking().FirstOrDefaultAsync(c => c.Id == batch.Company);
                    if (company == null)
                    {
                        LogHelper.Instance.IsNull(nameof(company));
                        continue;
                    }

                    dict.Add(id, company);
                }

                return dict;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return dict;
            }
        }
        #endregion
        #endregion [查]

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
