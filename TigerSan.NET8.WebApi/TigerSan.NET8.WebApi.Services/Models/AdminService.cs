using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AdminService : IdNameServiceBase<AdminEntity>, IAdminService
    {
        #region 【Ctor】
        public AdminService(AppDbContext db) : base(db, db.Admins)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [查]
        #region 根据“名称”获取“数据”
        /// <summary>根据“名称”获取“数据”</summary>
        public async Task<MyActionResult<AdminEntity>> GetByName(string name, string password)
        {
            var res = MyResults<AdminEntity>.OperationSuccess;

            try
            {
                var entity = await _dbSet.AsNoTracking().FirstOrDefaultAsync(i => i.Name == name);
                if (entity == null)
                {
                    return MyResults<AdminEntity>.UserNotExist;
                }
                else if (entity.Password != password)
                {
                    return MyResults<AdminEntity>.PasswordIncorrect;
                }

                res.Data = entity;
            }
            catch (Exception e)
            {
                res = MyResults<AdminEntity>.Error(e.GetMessage());
            }

            return res;
        }
        #endregion
        #endregion [查]
        #endregion 【Functions】
    }
}
