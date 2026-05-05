using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AuthorityService : IdServiceBase<AuthorityEntity>, IAuthorityService
    {
        #region 【Ctor】
        static AuthorityService()
        {
            SetDbSetConfig(nameof(AuthorityEntity.Role))
                .SetParent(typeof(RoleEntity), nameof(_db.Roles));
        }

        public AuthorityService(AppDbContext db) : base(db, db.Authorities)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 根据“角色”获取“数据”集合
        /// <summary>根据“角色”获取“数据”集合</summary>
        public async Task<List<AuthorityEntity>> GetListByRole(long? role = null, int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                if (role != null)
                {
                    queryable = queryable.Where(i => i.Role == role);
                }

                return await queryable.GetPage(pageSize, pageNumber).ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<AuthorityEntity>();
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(AuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 删除“旧权限”：
                await _db.Authorities.Where(a => a.Role == entity.Role).ExecuteDeleteAsync();

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                return await base.Add(entity, false);
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<AuthorityEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 删除“旧权限”：
                entities.Select(e => e.Role).Distinct().ToList().ForEach(async r =>
                {
                    await _db.Authorities.Where(a => a.Role == r).ExecuteDeleteAsync();
                });

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
                return await base.AddRange(entities, false);
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]
        #endregion 【Functions】
    }
}
