using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class UserService : IUserService
    {
        #region 【Fields】
        public AppDbContext _db;
        private readonly IPersonService _personService;
        private readonly IAdminService _adminService;
        #endregion 【Fields】

        #region 【Ctor】
        public UserService(AppDbContext db, IAdminService adminService, IPersonService personService)
        {
            _db = db;
            _adminService = adminService;
            _personService = personService;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [private]
        #region 获取“用户信息”（普通人员）
        /// <summary>获取“用户信息”（普通人员）</summary>
        private async Task<UserInfo> GetUserInfoAsync(PersonFullEntity person)
        {
            var userInfo = new UserInfo();
            userInfo.ShallowCopy(person);

            try
            {
                var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == person.Company);
                if (company == null)
                {
                    LogHelper.Instance.Error($"The company with id {person.Company} is not found");
                }
                else
                {
                    userInfo.Company = new IdName { Id = company.Id, Name = company.Name };
                }

                var department = await _db.Departments.FirstOrDefaultAsync(d => d.Id == person.Department);
                if (department == null)
                {
                    LogHelper.Instance.Error($"The department with id {person.Department} is not found");
                }
                else
                {
                    userInfo.Department = new IdName { Id = department.Id, Name = department.Name };
                }

                var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == person.Role);
                if (role == null)
                {
                    LogHelper.Instance.Error($"The role with id {person.Role} is not found");
                }
                else
                {
                    userInfo.Role = new IdName { Id = role.Id, Name = role.Name };
                    userInfo.Authorities = await _db.Authoritys.Where(a => a.Role == role.Id).ToListAsync();
                }
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
            }

            return userInfo;
        }
        #endregion

        #region 获取“用户信息”（管理员）
        /// <summary>获取“用户信息”（管理员）</summary>
        private async Task<UserInfo> GetUserInfoAsync(AdminEntity admin)
        {
            var userInfo = new UserInfo
            {
                Id = admin.Id,
                Username = admin.Name,
                Nickname = "Admin",
                IsAdmin = true,
                IsRoot = admin.IsRoot,
            };
            userInfo.Role.Name = "Admin";

            try
            {
                if (admin.Company != null)
                {
                    var company = await _db.Companies.FirstOrDefaultAsync(c => c.Id == admin.Company);
                    if (company == null)
                    {
                        LogHelper.Instance.Error($"The company with id {admin.Company} is not found");
                    }
                    else
                    {
                        userInfo.Company = new IdName { Id = company.Id, Name = company.Name };
                    }
                }
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.GetMessage());
            }

            return userInfo;
        }
        #endregion
        #endregion [private]

        #region [查]
        #region 登录
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <param name="password">密码</param>
        /// <returns></returns>
        public async Task<MyActionResult<UserInfo>> Login(string search, string password)
        {
            var res = MyResults<UserInfo>.OperationSuccess;

            try
            {
                var resPerson = await _personService.GetLoginFull(search, password);
                if (Equals(resPerson.Message, MyResults<UserInfo>.PasswordIncorrect.Message))
                {
                    return MyResults<UserInfo>.PasswordIncorrect;
                }
                else if (resPerson.IsSuccess)
                {
                    var person = resPerson.Data;
                    if (person == null)
                    {
                        return MyResults<UserInfo>.Error("The person is null");
                    }

                    res.Data = await GetUserInfoAsync(person);
                    return res;
                }

                var resAdmin = await _adminService.GetByName(search, password);
                if (Equals(resAdmin.Message, MyResults<UserInfo>.PasswordIncorrect.Message))
                {
                    return MyResults<UserInfo>.PasswordIncorrect;
                }
                else if (resAdmin.IsSuccess)
                {
                    var admin = resAdmin.Data;
                    if (admin == null)
                    {
                        return MyResults<UserInfo>.Error("The admin is null");
                    }

                    res.Data = await GetUserInfoAsync(admin);
                    return res;
                }
            }
            catch (Exception e)
            {
                res = MyResults<UserInfo>.Error(e.GetMessage());
            }

            res = MyResults<UserInfo>.UserNotExist;
            return res;
        }
        #endregion
        #endregion [查]

        #region [改]
        #region 修改“密码”
        /// <summary>修改“密码”</summary>
        public async Task<MyActionResult<object>> EditPassword(PasswordEdit edit)
        {
            var res = MyResults<object>.OperationSuccess;

            try
            {
                var admin = await _db.Admins.FirstOrDefaultAsync(i => i.Id == edit.Id);
                var person = admin == null ? await _db.Persons.FirstOrDefaultAsync(i => i.Id == edit.Id) : null;

                if (admin != null)
                {
                    if (!Equals(admin.Password, edit.OldPassword))
                    {
                        return MyResults<object>.PasswordIncorrect;
                    }

                    admin.Password = edit.Password;
                }
                else if (person != null)
                {
                    if (!Equals(person.Password, edit.OldPassword))
                    {
                        return MyResults<object>.PasswordIncorrect;
                    }

                    person.Password = edit.Password;
                }
                else
                {
                    return MyResults<object>.UserNotExist;
                }

                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(e.GetMessage());
            }

            return res;
        }
        #endregion
        #endregion [改]
        #endregion 【Functions】
    }
}
