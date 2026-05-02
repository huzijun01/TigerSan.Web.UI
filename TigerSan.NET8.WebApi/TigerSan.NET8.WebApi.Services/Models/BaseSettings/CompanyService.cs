using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class CompanyService : IdNameServiceBase<CompanyEntity>, ICompanyService
    {
        #region 【Fields】
        private IDepartmentService _departmentService;
        #endregion 【Fields】

        #region 【Ctor】
        public CompanyService(AppDbContext db, IDepartmentService departmentService) : base(db, db.Companies)
        {
            _departmentService = departmentService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 获取“后代公司ID”集合
        /// <summary>获取“后代公司ID”集合</summary>
        public async Task<List<long>> GetSubCompanyIds(long id)
        {
            var subIds = await _dbSet.AsNoTracking().Where(i => i.Parent == id).Select(i => i.Id).ToListAsync();
            var rootIds = new List<long>(subIds);
            var newRootIds = new List<long>();

            // 添加“后代公司”:
            while (rootIds.Count() > 0)
            {
                newRootIds.Clear();

                // 添加“根公司”:
                foreach (var rootId in rootIds)
                {
                    // “孙公司”集合:
                    var subSubIds = await _dbSet.AsNoTracking().Where(i => i.Parent == rootId).Select(i => i.Id).ToListAsync();
                    newRootIds.AddRange(subSubIds);
                }

                rootIds.Clear();
                rootIds.AddRange(newRootIds);
                subIds.AddRange(rootIds);
            }

            return subIds;
        }
        #endregion

        #region 获取“可访问公司”集合
        /// <summary>获取“可访问公司”集合</summary>
        public async Task<MyActionResult<List<CompanyEntity>>> GetAccessibleCompanies(long rootCompany)
        {
            var resGetList = await GetList();
            var companies = resGetList.Data;
            if (companies == null)
            {
                return resGetList;
            }

            var find = companies.FirstOrDefault(c => c.Id == rootCompany);
            if (find == null)
            {
                return MyResults<List<CompanyEntity>>.ResourceNotExist;
            }

            find.Parent = null; // 设置为“根公司”
            var accessibleCompanies = CompanyHelper.GetSubCompanies(companies, find);
            accessibleCompanies.Add(find);

            return MyResults<List<CompanyEntity>>.Success(null, accessibleCompanies);
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(CompanyEntity entity, bool isBeginTransaction = true)
        {
            if (entity.Parent != null && !await _dbSet.AnyAsync(i => i.Id == entity.Parent))
            {
                return MyResults<object>.Error($"父公司不存在：{entity.Id}，{entity.Parent}");
            }

            return await base.Add(entity, isBeginTransaction);
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<CompanyEntity> entities, bool isBeginTransaction = true)
        {
            foreach (var entity in entities)
            {
                if (entity.Parent != null && !await _dbSet.AnyAsync(i => i.Id == entity.Parent))
                {
                    return MyResults<object>.Error($"父公司不存在：{entity.Id}，{entity.Parent}");
                }
            }

            return await base.AddRange(entities, isBeginTransaction);
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(CompanyEntity entity, bool isBeginTransaction = true)
        {
            if (entity.Parent != null)
            {
                if (!await _dbSet.AnyAsync(i => i.Id == entity.Parent))
                {
                    return MyResults<object>.Error($"父公司不存在：{entity.Name}，{entity.Parent}");
                }

                var subIds = await GetSubCompanyIds(entity.Id);
                subIds.Add(entity.Id); // 包含自身
                if (subIds.Contains(entity.Parent.Value))
                {
                    return MyResults<object>.Error($"父公司不能是后代公司：{entity.Name}，{entity.Parent}");
                }
            }

            return await base.Edit(entity, isBeginTransaction);
        }
        #endregion
        #endregion [改]

        #region [删]
        #region 删除“相关部门”
        private async Task<MyActionResult<object>> RemoveDepartment(long id)
        {
            var res = MyResults<object>.OperationSuccess;

            try
            {
                // 获取“相关部门”：
                var departments = await _db.Departments.AsNoTracking().Where(i => i.Company == id).Select(i => i.Id).ToListAsync();

                // 删除“相关部门”：
                var resDepartment = await _departmentService.RemoveRange(departments, false);
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
            }

            return res;
        }
        #endregion

        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public override async Task<MyActionResult<object>> Remove(long id, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 获取“公司”：
                var entity = await _dbSet.FirstOrDefaultAsync(i => i.Id == id);

                // 验证“资源是否存在”：
                if (entity == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                // 删除“相关部门”：
                var resDepartment = await RemoveDepartment(id);
                if (resDepartment.IsError)
                {
                    if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                    return resDepartment;
                }

                // 删除“后代数据”：
                var subIds = await GetSubCompanyIds(id);
                foreach (var subId in subIds)
                {
                    // 删除“相关部门”：
                    var resDepartment1 = await RemoveDepartment(id);
                    if (resDepartment1.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return resDepartment1;
                    }
                }

                // 删除“后代公司”:
                _dbSet.RemoveRange(_dbSet.Where(i => subIds.Contains(i.Id)));

                // 删除“公司”：
                _dbSet.Remove(entity);

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

                // 删除“后代数据”：
                var subs = _dbSet.AsNoTracking().Where(i => i.Parent != null && ids.Contains(i.Parent.Value)).Select(i => i.Id);
                foreach (var sub in subs)
                {
                    var resSub = await Remove(sub, false); // 递归删除子公司
                    if (resSub.IsError)
                    {
                        if (transaction != null) await transaction.RollbackAsync(); // 回滚所有操作
                        return resSub;
                    }
                }

                // 删除“多条数据”：
                _dbSet.RemoveRange(entities);

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
        #endregion [删]
        #endregion 【Functions】
    }
}
