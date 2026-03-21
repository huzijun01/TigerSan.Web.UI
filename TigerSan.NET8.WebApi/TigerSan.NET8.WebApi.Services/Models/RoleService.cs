using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class RoleService : IdNameServiceBase<RoleEntity>, IRoleService
    {
        #region 【Fields】
        private IAuthorityService _authorityService;
        #endregion 【Fields】

        #region 【Ctor】
        public RoleService(AppDbContext db, IAuthorityService authorityService) : base(db, db.Roles)
        {
            _authorityService = authorityService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 更新“Id”：
                entity.UpdateId();
                entity.Authorities.UpdateId();

                // 添加“权限”：
                var resSub = await _authorityService.AddRange(entity.Authorities, false);
                if (resSub.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resSub;
                }

                // 添加“数据”：
                _dbSet.Add(entity);

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult> AddRange(IList<RoleAuthorityEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 更新“Id”：
                entities.UpdateId();

                foreach (var entity in entities)
                {
                    // 更新“Id”：
                    entity.Authorities.UpdateId();

                    // 添加“权限”：
                    var resSub = await _authorityService.AddRange(entity.Authorities, false);
                    if (resSub.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return resSub;
                    }
                }

                // 添加“数据”：
                await _dbSet.AddRangeAsync(entities);

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public new async Task<MyActionResult> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 获取“单条数据”：
                var entity = _dbSet.FirstOrDefault(i => i.Id == id);

                // 验证“资源是否存在”：
                if (entity == null)
                {
                    return MyResults.ResourceNotExist;
                }

                // 删除“角色”相关的“人员”：
                _db.Persons.Where(p => p.Role == id).ExecuteDelete();

                // 删除“数据”：
                _dbSet.Remove(entity);

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public new async Task<MyActionResult> RemoveRange(IList<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (ids.Count < 1) return res;

                // 获取“多条数据”：
                var entities = _dbSet.Where(i => ids.Contains(i.Id));

                // 验证“资源是否存在”：
                var count = await entities.CountAsync();
                if (count < 1)
                {
                    return MyResults.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    res = MyResults.SomeResourceNotExist;
                }

                // 删除与这些“角色”相关的“人员”：
                _db.Persons.Where(p => ids.Contains(p.Role)).ExecuteDelete();

                // 删除“多条数据”：
                _dbSet.RemoveRange(entities);

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [删]
        #endregion 【Functions】
    }
}
