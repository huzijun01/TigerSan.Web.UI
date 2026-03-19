using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using Microsoft.EntityFrameworkCore;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class CompanyMgtService : ServiceBase<CompanyMgtEntity>, ICompanyMgtService
    {
        #region 【Ctor】
        public CompanyMgtService(AppDbContext db) : base(db, db.CompanyMgts)
        {
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [private]
        #region 删除“后代数据”
        /// <summary>删除“后代数据”</summary>
        private void RemoveChilds(long id)
        {
            var entities = _dbSet.Where(i => i.Parent == id);
            _dbSet.RemoveRange(entities);
        }
        #endregion
        #endregion [private]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public new async Task<MyActionResult> Remove(long id)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var entity = _dbSet.FirstOrDefault(i => i.Id == id);
                if (entity == null)
                {
                    return MyResults.ResourceNotExist;
                }

                _dbSet.Remove(entity);
                RemoveChilds(id);

                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion

        #region 删除“多条数据”
        /// <summary>删除“多条数据”</summary>
        public new async Task<MyActionResult> RemoveRange(IList<long> ids)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                if (ids.Count < 1) return res;

                var entities = _dbSet.Where(i => ids.Contains(i.Id));

                var count = await entities.CountAsync();
                if (count < 1)
                {
                    return MyResults.ResourceNotExist;
                }
                else if (count < ids.Count)
                {
                    res = MyResults.SomeResourceNotExist;
                }


                _dbSet.RemoveRange(entities);

                foreach (var item in entities)
                {
                    RemoveChilds(item.Id);
                }

                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [删]
        #endregion 【Functions】
    }
}
