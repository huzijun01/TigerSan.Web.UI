using Microsoft.EntityFrameworkCore;
using System.Data;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;

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
        #region [查]
        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<List<RoleAuthorityEntity>> GetFullList(int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var list = new List<RoleAuthorityEntity>();
                var roles = await GetList(pageSize, pageNumber);

                foreach (var role in roles)
                {
                    var authorities = await _authorityService.FilterByRole(role.Id);
                    var entity = new RoleAuthorityEntity
                    {
                        Id = role.Id,
                        Name = role.Name,
                        Department = role.Department,
                        Authorities = authorities
                    };
                    entity.Company = _db.Departments.Where(d => d.Id == role.Department).Select(d => d.Company).FirstOrDefault();

                    list.Add(entity);
                }

                return list;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<RoleAuthorityEntity>();
            }
        }
        #endregion

        #region 根据“部门”筛选“单页数据”
        /// <summary>根据“部门”筛选“单页数据”</summary>
        public async Task<List<RoleEntity>> FilterByDepartment(long department, int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var query = _dbSet
                    .Where(r => r.Department == department)
                    .AsNoTracking();

                if (pageSize != null && pageNumber != null)
                {
                    query = query.GetPage(pageSize.Value, pageNumber.Value);
                }

                return await query.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<RoleEntity>();
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (await _dbSet.AnyAsync(r => r.Department == entity.Department && r.Name == entity.Name))
                {
                    return MyResults.NameRepeated;
                }

                // 更新“Id”：
                entity.UpdateId();
                entity.Authorities.UpdateId();
                entity.Authorities.ForEach(a => a.Role = entity.Id); // 设置“权限”的“角色ID”

                // 添加“数据”：
                _dbSet.Add(entity);
                // “保存更改”：
                await _db.SaveChangesAsync();

                // 添加“权限”：
                var resSub = await _authorityService.AddRange(entity.Authorities, false);
                if (resSub.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resSub;
                }

                // “提交事务”：
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

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 验证“资源是否存在”：
                var role = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                if (role == null)
                {
                    return MyResults.ResourceNotExist;
                }

                // 更新“数据”：
                if (await _dbSet.AnyAsync(r => r.Department == role.Department && r.Name == entity.Name))
                {
                    return MyResults.NameRepeated;
                }
                role.Name = entity.Name;

                // 删除“角色”相关的“权限”：
                await _db.Authoritys.Where(a => a.Role == entity.Id).ExecuteDeleteAsync();

                // 更新“权限”：
                foreach (var authority in entity.Authorities)
                {
                    authority.UpdateId();
                    authority.Role = entity.Id; // 设置“权限”的“角色ID”
                }

                // 添加“权限”：
                var resAuthority = await _authorityService.AddRange(entity.Authorities, false);
                if (resAuthority.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resAuthority;
                }

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
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public new async Task<MyActionResult> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 删除“角色”相关的“权限”：
                await _db.Authoritys.Where(a => a.Role == id).ExecuteDeleteAsync();

                // 删除“角色”相关的“人员”：
                await _db.Persons.Where(p => p.Role == id).ExecuteDeleteAsync();

                // 获取“单条数据”：
                var entity = _dbSet.FirstOrDefault(i => i.Id == id);

                // 验证“资源是否存在”：
                if (entity == null)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return MyResults.ResourceNotExist;
                }

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

                // 删除“角色”相关的“权限”：
                await _db.Authoritys.Where(a => ids.Contains(a.Role)).ExecuteDeleteAsync();

                // 删除与这些“角色”相关的“人员”：
                await _db.Persons.Where(p => ids.Contains(p.Role)).ExecuteDeleteAsync();

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
