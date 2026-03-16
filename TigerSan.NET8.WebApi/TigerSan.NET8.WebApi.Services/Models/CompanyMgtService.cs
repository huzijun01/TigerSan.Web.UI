using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

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
        private void RemoveChilds(int index)
        {
            var entities = _dbSet.Where(i => i.Parent == index);
            _dbSet.RemoveRange(entities);
        }
        #endregion
        #endregion [private]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public new async Task<MyActionResult> Remove(int index)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var entity = _dbSet.FirstOrDefault(i => i.Index == index);
                if (entity == null)
                {
                    return MyResults.ResourceNotExist;
                }

                _dbSet.Remove(entity);
                RemoveChilds(index);

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
        public new async Task<MyActionResult> RemoveRange(IList<int> indexes)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                if (indexes.Count < 1) return res;

                var entities = _dbSet.Where(i => indexes.Contains(i.Index));

                var count = await entities.CountAsync();
                if (count < 1)
                {
                    return MyResults.ResourceNotExist;
                }
                else if (count < indexes.Count)
                {
                    res = MyResults.SomeResourceNotExist;
                }


                _dbSet.RemoveRange(entities);

                foreach (var item in entities)
                {
                    RemoveChilds(item.Index);
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
