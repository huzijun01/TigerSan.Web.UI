using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.CaptchaGenerator;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
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
                    userInfo.CompanyIdName = new IdName { Id = company.Id, Name = company.Name };
                }

                var department = await _db.Departments.FirstOrDefaultAsync(d => d.Id == person.Department);
                if (department == null)
                {
                    LogHelper.Instance.Error($"The department with id {person.Department} is not found");
                }
                else
                {
                    userInfo.DepartmentIdName = new IdName { Id = department.Id, Name = department.Name };
                }

                var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == person.Role);
                if (role == null)
                {
                    LogHelper.Instance.Error($"The role with id {person.Role} is not found");
                }
                else
                {
                    userInfo.RoleIdName = new IdName { Id = role.Id, Name = role.Name };
                    userInfo.Authorities = await _db.Authorities.Where(a => a.Role == role.Id).ToListAsync();
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
                IsRoot = true,
            };
            userInfo.RoleIdName.Name = "Admin";

            return userInfo;
        }
        #endregion
        #endregion [private]

        #region [查]
        #region 获取“用户信息”
        /// <summary>获取“用户信息”</summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <returns>用户信息</returns>
        public async Task<MyActionResult<UserInfo>> GetUserInfo(string search)
        {
            var res = MyResults<UserInfo>.OperationSuccess;

            try
            {
                var resPerson = await _personService.GetLoginFull(search, false);
                if (resPerson.IsSuccess)
                {
                    var person = resPerson.Data;
                    if (person == null)
                    {
                        return MyResults<UserInfo>.Error("The person is null");
                    }

                    res.Data = await GetUserInfoAsync(person);
                    return res;
                }

                var resAdmin = await _adminService.GetByName(search, false);
                if (!resAdmin.IsSuccess)
                {
                    return MyResults<UserInfo>.UserNotExist;
                }
                else
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
                return MyResults<UserInfo>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
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
                    var hasher = new PasswordHasher<AdminEntity>();
                    if (hasher.VerifyHashedPassword(admin, admin.PasswordHash, edit.OldPassword)
                        == PasswordVerificationResult.Failed)
                    {
                        return MyResults<object>.PasswordIncorrect;
                    }

                    admin.PasswordHash = hasher.HashPassword(admin, edit.Password);
                }
                else if (person != null)
                {
                    var hasher = new PasswordHasher<PersonEntity>();
                    if (hasher.VerifyHashedPassword(person, person.PasswordHash, edit.OldPassword)
                        == PasswordVerificationResult.Failed)
                    {
                        return MyResults<object>.PasswordIncorrect;
                    }

                    person.PasswordHash = hasher.HashPassword(person, edit.Password);
                }
                else
                {
                    return MyResults<object>.UserNotExist;
                }

                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [登录]
        #region 登录
        /// <summary>登录</summary>
        /// <param name="search">用户名/电话/邮箱</param>
        /// <param name="password">密码</param>
        /// <returns>用户信息</returns>
        public async Task<MyActionResult<UserInfo>> Login(
            string? id,
            string captcha,
            string search,
            string password)
        {
            var res = MyResults<UserInfo>.OperationSuccess;

            try
            {
                var resVerifyCaptcha = VerifyCaptcha(id, captcha);
                if (!resVerifyCaptcha.IsSuccess) return resVerifyCaptcha.Convert<UserInfo>();

                var resPerson = await _personService.GetLoginFull(search, false);
                if (resPerson.IsSuccess)
                {
                    var person = resPerson.Data;
                    if (person == null)
                    {
                        return MyResults<UserInfo>.Error("The person is null");
                    }
                    else if (new PasswordHasher<PersonEntity>().VerifyHashedPassword(person, person.PasswordHash, password)
                        == PasswordVerificationResult.Failed)
                    {
                        return MyResults<UserInfo>.PasswordIncorrect;
                    }

                    res.Data = await GetUserInfoAsync(person);
                    TokenHelper.InitToken(res.Data);
                    return res;
                }

                var resAdmin = await _adminService.GetByName(search, false);
                if (!resAdmin.IsSuccess)
                {
                    return MyResults<UserInfo>.UserNotExist;
                }
                else
                {
                    var admin = resAdmin.Data;
                    if (admin == null)
                    {
                        return MyResults<UserInfo>.Error("The admin is null");
                    }
                    else if (new PasswordHasher<AdminEntity>().VerifyHashedPassword(admin, admin.PasswordHash, password)
                        == PasswordVerificationResult.Failed)
                    {
                        return MyResults<UserInfo>.PasswordIncorrect;
                    }

                    res.Data = await GetUserInfoAsync(admin);
                    TokenHelper.InitToken(res.Data);
                    return res;
                }
            }
            catch (Exception e)
            {
                return MyResults<UserInfo>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region Token登录
        public async Task<MyActionResult<UserInfo>> LoginByToken(string token)
        {
            try
            {
                var res = TokenHelper.GetTokenInfo(token);
                var tokenInfo = res.Data;
                if (tokenInfo == null)
                    return MyResults<UserInfo>.InvalidToken(res.Message);

                var resGetUserInfo = await GetUserInfo(tokenInfo.Username);
                var userInfo = resGetUserInfo.Data;
                if (userInfo == null)
                    return MyResults<UserInfo>.UserNotExist;
                userInfo.Token = token;

                return MyResults<UserInfo>.Success(null, userInfo);
            }
            catch (Exception e)
            {
                return MyResults<UserInfo>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 登出
        /// <summary>登出</summary>
        public async Task<MyActionResult<object>> Logout(string username)
        {
            try
            {
                MemoryCacheHelper.Remove(username);
                return MyResults<object>.OperationSuccess;
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [登录]

        #region [验证码]
        #region 获取“验证码”
        public MyActionResult<byte[]> GetCaptcha(string? id)
        {
            try
            {
                if (string.IsNullOrEmpty(id)) return MyResults<byte[]>.TraceIdentifierIsNullOrEmpty;
                var code = CaptchaHelper.GenerateCode();
                var bytes = CaptchaHelper.GenerateImageBytes(code);
                if (bytes == null) return MyResults<byte[]>.CaptchaGenerationFailed;
                CaptchaCache.InitCaptcha(id, code);
                return MyResults<byte[]>.Success(null, bytes);
            }
            catch (Exception e)
            {
                return MyResults<byte[]>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion

        #region 验证“验证码”
        public MyActionResult<object> VerifyCaptcha(string? id, string code)
        {
            try
            {
                return CaptchaCache.Verify(id, code);
            }
            catch (Exception e)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(e.GetMessage()));
            }
        }
        #endregion
        #endregion [验证码]
        #endregion 【Functions】
    }
}
