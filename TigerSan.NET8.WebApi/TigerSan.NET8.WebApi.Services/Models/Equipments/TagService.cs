using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
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
    }
}
