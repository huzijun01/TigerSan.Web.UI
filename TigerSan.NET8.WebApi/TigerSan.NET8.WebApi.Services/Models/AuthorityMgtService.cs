using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using Microsoft.EntityFrameworkCore;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class AuthorityMgtService : ServiceBase<AuthorityMgtEntity>, IAuthorityMgtService
    {
        #region 【Ctor】
        public AuthorityMgtService(AppDbContext db) : base(db, db.AuthorityMgts)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public new async Task<MyActionResult> Add(AuthorityMgtEntity entity)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                _db.AuthorityMgts.Where(a => a.Role == entity.Role).ExecuteDelete();

                return await base.Add(entity);
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public new async Task<MyActionResult> AddRange(IList<AuthorityMgtEntity> entities)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                entities.Select(e => e.Role).Distinct().ToList().ForEach(r =>
                {
                    _db.AuthorityMgts.Where(a => a.Role == r).ExecuteDelete();
                });

                return await base.AddRange(entities);
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [增]
        #endregion 【Functions】
    }
}
