using System.Data;
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
        #region 获取“总数”
        /// <summary>获取“总数”</summary>
        public async Task<int> GetCount(long? company = null, long? department = null)
        {
            try
            {
                var quaryable = _dbSet.AsNoTracking();

                // 筛选:
                if (department != null)
                {
                    quaryable = quaryable.Where(i => i.Department == department);
                }
                else if (company != null)
                {
                    var departments = await _db.Departments.Where(d => d.Company == company).Select(d => d.Id).ToListAsync();
                    quaryable = quaryable.Where(i => departments.Contains(i.Department));
                }

                return await quaryable.CountAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return 0;
            }
        }
        #endregion

        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<List<RoleAuthorityEntity>> GetFullList(long? company = null, long? department = null, int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var list = new List<RoleAuthorityEntity>();

                var quaryable = _dbSet.AsNoTracking();

                // 筛选:
                if (department != null)
                {
                    quaryable = quaryable.Where(i => i.Department == department);
                }
                else if (company != null)
                {
                    var departments = await _db.Departments.Where(d => d.Company == company).Select(d => d.Id).ToListAsync();
                    quaryable = quaryable.Where(i => departments.Contains(i.Department));
                }

                // 分页:
                if (pageSize != null && pageNumber != null)
                {
                    quaryable = quaryable.GetPage(pageSize.Value, pageNumber.Value);
                }

                var roles = await quaryable.ToListAsync();

                // 添加“权限”:
                foreach (var role in roles)
                {
                    var authorities = await _authorityService.GetList(role.Id);
                    var entity = new RoleAuthorityEntity();
                    entity.ShallowCopy(role);
                    entity.Authorities = authorities;
                    entity.Company = await _db.Departments.Where(d => d.Id == role.Department).Select(d => d.Company).FirstOrDefaultAsync();

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

        #region 获取“数据”集合
        /// <summary>获取“数据”集合</summary>
        public async Task<List<RoleEntity>> GetList(long? department, int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var quaryable = _dbSet.AsNoTracking();

                if (department != null)
                {
                    quaryable = quaryable.Where(i => i.Department == department);
                }

                if (pageSize != null && pageNumber != null)
                {
                    quaryable = quaryable.GetPage(pageSize.Value, pageNumber.Value);
                }

                return await quaryable.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<RoleEntity>();
            }
        }
        #endregion

        #region 获取“ID名称对”集合
        /// <summary>获取“ID名称对”集合</summary>
        public async Task<List<IdName>> SelectIdNameByDepartment(long? department = null)
        {
            var list = new List<IdName>();
            try
            {
                var queryable = _dbSet.AsNoTracking();

                if (department != null)
                {
                    queryable = queryable.Where(i => i.Department == department);
                }

                return await queryable.Select(i => new IdName(i)).ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return list;
            }
        }
        #endregion

        #region 获取“所属公司”集合
        /// <summary>获取“所属公司”集合</summary>
        public async Task<List<IdName>> GetBelongCompanyList()
        {
            var list = new List<IdName>();
            try
            {
                var departments = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Department)
                    .Distinct()
                    .ToListAsync();

                if (departments.Count < 1) return list;

                var companys = await _db.Departments
                    .AsNoTracking()
                    .Where(d => departments.Contains(d.Id))
                    .Select(d => d.Company)
                    .Distinct()
                    .ToListAsync();

                if (companys.Count < 1) return list;

                return await _db.Companies
                    .AsNoTracking()
                    .Where(i => companys.Contains(i.Id))
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return list;
            }
        }
        #endregion

        #region 获取“所属部门”集合
        /// <summary>获取“所属部门”集合</summary>
        public async Task<List<IdName>> BelongDepartmentList(long? company = null)
        {
            var list = new List<IdName>();
            try
            {
                var departments = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Department)
                    .Distinct()
                    .ToListAsync();

                if (departments.Count < 1) return list;

                var queryable = _db.Departments
                    .AsNoTracking()
                    .Where(i => departments.Contains(i.Id));

                if (company != null)
                {
                    queryable = queryable.Where(i => i.Company == company);
                }

                return await queryable
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return list;
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult<object>> Add(RoleAuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 验证“名称是否重复”：
                if (await _dbSet.AnyAsync(r => r.Department == entity.Department && r.Name == entity.Name))
                {
                    return MyResults<object>.NameRepeated;
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
                res = MyResults<object>.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public async Task<MyActionResult<object>> AddRange(List<RoleAuthorityEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 验证“名称是否重复”：
                foreach (var entity in entities)
                {
                    if (await _dbSet.AnyAsync(i => i.Department == entity.Department && i.Name == entity.Name))
                    {
                        return MyResults<object>.NameRepeated;
                    }
                }

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
                res = MyResults<object>.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult<object>> Edit(RoleAuthorityEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 验证“资源是否存在”：
                var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                if (find == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                // 验证“名称是否重复”：
                if (await _dbSet.AnyAsync(r => r.Department == find.Department && r.Name == entity.Name && r.Id != find.Id))
                {
                    return MyResults<object>.NameRepeated;
                }

                // 更新“数据”：
                find.Name = entity.Name;

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
                res = MyResults<object>.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public override async Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 删除“角色”相关的“权限”：
                await _db.Authoritys.Where(a => a.Role == id).ExecuteDeleteAsync();

                // 删除“角色”相关的“人员”：
                await _db.Persons.Where(p => p.Role == id).ExecuteDeleteAsync();

                // 获取“单条数据”：
                var entity = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);

                // 验证“资源是否存在”：
                if (entity == null)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return MyResults<object>.ResourceNotExist;
                }

                // 删除“数据”：
                _dbSet.Remove(entity);

                // “保存更改”并“提交事务”：
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync(); // 显式提交事务
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public override async Task<MyActionResult<object>> RemoveRange(List<long> ids, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
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
                    return MyResults<object>.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    res = MyResults<object>.SomeResourceNotExist;
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
                res = MyResults<object>.Error(e);
                if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
            }

            return res;
        }
        #endregion
        #endregion [删]
        #endregion 【Functions】
    }
}
