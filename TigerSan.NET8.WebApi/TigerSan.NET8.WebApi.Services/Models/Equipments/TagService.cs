using Microsoft.EntityFrameworkCore;
using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class TagService : IdServiceBase<TagEntity>, ITagService
    {
        #region 【Ctor】
        public TagService(AppDbContext db) : base(db, db.Tags)
        {
        }

        static TagService()
        {
            SetDbSetConfig(nameof(TagEntity.Batch))
                .SetParent(typeof(BatchEntity), nameof(_db.Batches));
        }
        #endregion 【Ctor】

        #region 【Functions】
        #region [增]
        #region 添加“单条数据”
        /// <summary>添加“单条数据”</summary>
        public override async Task<MyActionResult<object>> Add(TagEntity entity, bool isBeginTransaction = true)
        {
            // 检验“标牌ID”是否重复:
            if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId))
            {
                return MyResults<object>.BrandIdRepeated;
            }

            return await base.Add(entity, isBeginTransaction);
        }
        #endregion

        #region 添加“多条数据”
        /// <summary>添加“多条数据”</summary>
        public override async Task<MyActionResult<object>> AddRange(List<TagEntity> entities, bool isBeginTransaction = true)
        {
            // 检验“标牌ID”是否重复:
            var names = entities.Where(e => !string.IsNullOrEmpty(e.BrandId)).Select(e => e.BrandId).ToList();
            if (await _dbSet.AnyAsync(i => names.Contains(i.BrandId)))
            {
                return MyResults<object>.BrandIdRepeated;
            }

            return await base.AddRange(entities, isBeginTransaction);
        }
        #endregion
        #endregion [增]

        #region [改]
        #region 修改“单条数据”
        /// <summary>修改“单条数据”</summary>
        public override async Task<MyActionResult<object>> Edit(TagEntity entity, bool isBeginTransaction = true)
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

                // 检验“标牌ID”是否重复:
                if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId && i.Id != entity.Id))
                {
                    return MyResults<object>.BrandIdRepeated;
                }

                // 修改“数据”:
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

        #region 修改“多条数据”
        /// <summary>修改“多条数据”</summary>
        public override async Task<MyActionResult<object>> EditRange(List<TagEntity> entities, bool isBeginTransaction = true)
        {
            var res = MyResults<object>.OperationSuccess;
            using var transaction = isBeginTransaction ? _db.Database.BeginTransaction() : null; // 显式开启事务

            try
            {
                if (entities.Count < 1) return res;

                var ids = entities.Select(i => i.Id).ToList();

                // 检验“资源”是否存在:
                var finds = await _dbSet.Where(i => ids.Contains(i.Id)).ToListAsync();
                if (finds.Count < 1)
                {
                    return MyResults<object>.ResourceNotExist;
                }
                else if (finds.Count < ids.Count)
                {
                    return MyResults<object>.SomeResourceNotExist;
                }

                foreach (var find in finds)
                {
                    var entity = entities.FirstOrDefault(i => i.Id == find.Id);
                    if (entity == null)
                    {
                        return MyResults<object>.SomeResourceNotExist;
                    }

                    // 检验“标牌ID”是否重复:
                    if (!string.IsNullOrEmpty(entity.BrandId) && await _dbSet.AnyAsync(i => i.BrandId == entity.BrandId && i.Id != entity.Id))
                    {
                        return MyResults<object>.BrandIdRepeated;
                    }

                    // 修改“数据”:
                    find.ShallowCopy(entity);
                }

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
