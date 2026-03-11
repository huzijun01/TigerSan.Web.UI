using Microsoft.EntityFrameworkCore;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class ServiceBase<T> : IServiceBase<T> where T : IndexEntity
    {
        #region 【Fields】
        public AppDbContext _db;
        public DbSet<T> _dbSet;
        #endregion 【Fields】

        #region 【Ctor】
        public ServiceBase(AppDbContext db, DbSet<T> dbSet)
        {
            _db = db;
            _dbSet = dbSet;
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region 是否存在
        public async Task<bool> IsExists(int index)
        {
            return await _dbSet.AnyAsync(i => i.Index == index);
        }

        public async Task<bool> IsExists(IList<int> indexes)
        {
            return await _dbSet.AnyAsync(i => indexes.Contains(i.Index));
        }
        #endregion

        #region [查]
        #region 获取“单条数据”
        /// <summary>获取“单条数据”</summary>
        public async Task<T?> Get(int index)
        {
            try
            {
                return await _dbSet.FirstOrDefaultAsync(i => i.Index == index);
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return null;
            }
        }
        #endregion

        #region 获取“总数”
        /// <summary>获取“总数”</summary>
        public async Task<int> GetCount()
        {
            try
            {
                return await _dbSet.CountAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return 0;
            }
        }
        #endregion

        #region 获取“所有数据”
        /// <summary>获取“所有数据”</summary>
        public async Task<List<T>> GetList()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<T>();
            }
        }
        #endregion

        #region 获取“单页数据”
        /// <summary>获取“单页数据”</summary>
        public async Task<List<T>> GetList(int pageSize, int pageNumber)
        {
            try
            {
                return await _dbSet
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            }
            catch (Exception e)
            {
                LogHelper.Instance.Error(e.Message);
                return new List<T>();
            }
        }
        #endregion
        #endregion [查]

        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public async Task<MyActionResult> Add(T entity)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                if (await IsExists(entity.Index))
                {
                    return MyResults.ResourceExists;
                }

                _dbSet.Add(entity);
                await _db.SaveChangesAsync();
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
        public async Task<MyActionResult> Add(IList<T> entities)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var indexes = entities.Select(i => i.Index).ToList();
                if (await IsExists(indexes))
                {
                    return MyResults.ResourceExists;
                }

                await _dbSet.AddRangeAsync(entities);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public async Task<MyActionResult> Edit(T entity)
        {
            var res = MyResults.OperationSuccess;

            try
            {
                var find = _dbSet.FirstOrDefault(i => i.Index == entity.Index);
                if (find == null)
                {
                    return MyResults.ResourceNotExist;
                }

                find.ShallowCopy(entity);

                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                res = MyResults.Error(e);
            }

            return res;
        }
        #endregion
        #endregion [改]

        #region [删]
        #region 删除“单条数据”
        /// <summary>删除“单条数据”</summary>
        public async Task<MyActionResult> Remove(int index)
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
        public async Task<MyActionResult> Remove(IList<int> indexes)
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
