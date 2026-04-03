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
    public class PersonService : IdServiceBase<PersonEntity>, IPersonService
    {
        #region 【Ctor】
        public PersonService(AppDbContext db) : base(db, db.Persons)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [private]
        /// <summary>获取“完整数据”</summary>
        private async Task<PersonFullEntity> GetPersonFullEntity(PersonEntity person)
        {
            var entity = new PersonFullEntity();

            entity.ShallowCopy(person);
            entity.Password = "";
            entity.Department = await _db.Roles.Where(r => r.Id == person.Role).Select(r => r.Department).FirstOrDefaultAsync();
            entity.Company = await _db.Departments.Where(d => d.Id == entity.Department).Select(d => d.Company).FirstOrDefaultAsync();

            return entity;
        }
        #endregion [private]

        #region [查]
        #region 获取“总数”
        /// <summary>获取“总数”</summary>
        public async Task<int> GetCount(long? company = null, long? department = null, long? role = null)
        {
            try
            {
                var queryable = _dbSet.AsNoTracking();

                // 筛选:
                if (role != null)
                {
                    queryable = queryable.Where(i => i.Role == role);
                }
                else if (department != null)
                {
                    var roleIds = await _db.Roles.Where(r => r.Department == department).Select(r => r.Id).ToListAsync();
                    queryable = queryable.Where(i => roleIds.Contains(i.Role));
                }
                else if (company != null)
                {
                    var departmentIds = await _db.Departments.Where(d => d.Company == company).Select(d => d.Id).ToListAsync();
                    var roleIds = await _db.Roles.Where(r => departmentIds.Contains(r.Department)).Select(r => r.Id).ToListAsync();
                    queryable = queryable.Where(i => roleIds.Contains(i.Role));
                }

                return await queryable.CountAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return 0;
            }
        }
        #endregion

        #region 获取“完整数据”
        /// <summary>
        /// 获取“完整数据”
        /// </summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <param name="password">密码</param>
        /// <returns></returns>
        public async Task<MyActionResult<PersonFullEntity>> GetFull(string search, string password)
        {
            var res = MyResults<PersonFullEntity>.OperationSuccess;

            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Username == search || i.Phone != null && i.Phone == search || i.Mail != null && i.Mail == search);
                if (entity == null)
                {
                    return MyResults<PersonFullEntity>.UserNotExist;
                }
                else if (entity.Password != password)
                {
                    return MyResults<PersonFullEntity>.PasswordIncorrect;
                }

                res.Data = await GetPersonFullEntity(entity);
            }
            catch (Exception e)
            {
                res = MyResults<PersonFullEntity>.Error(e.GetMessage());
            }

            return res;
        }
        #endregion

        #region 获取“完整数据”集合
        /// <summary>获取“完整数据”集合</summary>
        public async Task<List<PersonFullEntity>> GetFullList(long? company = null, long? department = null, long? role = null, string? name = null, int? pageSize = null, int? pageNumber = null)
        {
            try
            {
                var list = new List<PersonFullEntity>();

                var queryable = _dbSet.AsNoTracking();

                // 筛选:
                if (role != null)
                {
                    queryable = queryable.Where(i => i.Role == role);
                }
                else if (department != null)
                {
                    var roleIds = await _db.Roles.Where(r => r.Department == department).Select(r => r.Id).ToListAsync();
                    queryable = queryable.Where(i => roleIds.Contains(i.Role));
                }
                else if (company != null)
                {
                    var departmentIds = await _db.Departments.Where(d => d.Company == company).Select(d => d.Id).ToListAsync();
                    var roleIds = await _db.Roles.Where(r => departmentIds.Contains(r.Department)).Select(r => r.Id).ToListAsync();
                    queryable = queryable.Where(i => roleIds.Contains(i.Role));
                }

                if (name != null && name.Trim() != "")
                {
                    queryable = queryable.Where(i => i.Username.Contains(name) || i.Nickname.Contains(name));
                }

                // 分页:
                if (pageSize != null && pageNumber != null)
                {
                    queryable = queryable.GetPage(pageSize.Value, pageNumber.Value);
                }

                var persons = await queryable.ToListAsync();

                // 添加“权限”:
                foreach (var person in persons)
                {
                    var entity = await GetPersonFullEntity(person);
                    list.Add(entity);
                }

                return list;
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return new List<PersonFullEntity>();
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
                var roles = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Role)
                    .Distinct()
                    .ToListAsync();

                if (roles.Count < 1) return list;

                var departments = await _db.Roles
                    .AsNoTracking()
                    .Where(i => roles.Contains(i.Id))
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
                LogHelper.Instance.Error(e.GetMessage());
                return list;
            }
        }
        #endregion

        #region 获取“所属部门”集合
        /// <summary>获取“所属部门”集合</summary>
        public async Task<List<IdName>> GetBelongDepartmentList(long? company = null)
        {
            var list = new List<IdName>();
            try
            {
                var roles = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Role)
                    .Distinct()
                    .ToListAsync();

                if (roles.Count < 1) return list;

                var departments = await _db.Roles
                    .AsNoTracking()
                    .Where(i => roles.Contains(i.Id))
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
                LogHelper.Instance.Error(e.GetMessage());
                return list;
            }
        }
        #endregion

        #region 获取“所属角色”集合
        /// <summary>获取“所属角色”集合</summary>
        public async Task<List<IdName>> GetBelongRoleList(long? department = null)
        {
            var list = new List<IdName>();
            try
            {
                var roles = await _dbSet
                    .AsNoTracking()
                    .Select(i => i.Role)
                    .Distinct()
                    .ToListAsync();

                if (roles.Count < 1) return list;

                var queryable = _db.Roles
                    .AsNoTracking()
                    .Where(i => roles.Contains(i.Id));

                if (department != null)
                {
                    queryable = queryable.Where(i => i.Department == department);
                }

                return await queryable
                    .Select(i => new IdName(i.Id, i.Name))
                    .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
                return list;
            }
        }
        #endregion
        #endregion [查]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(PersonEntity entity, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                // 检验“资源”是否存在:
                var find = await _dbSet.FirstOrDefaultAsync(i => i.Id == entity.Id);
                if (find == null)
                {
                    return MyResults<object>.ResourceNotExist;
                }

                if (entity.Password.Trim() == "")
                {
                    entity.Password = find.Password; // 保持原密码不变
                }

                find.ShallowCopy(entity);

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
        #endregion [改]
        #endregion 【Functions】
    }
}
