using TigerSan.NET8.WebApi.Share;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Interfaces.Models;
using TigerSan.NET8.WebApi.Services.Models.Base;

namespace TigerSan.NET8.WebApi.Services.Models
{
    public class TagTypeService : IdNameServiceBase<TagTypeEntity>, ITagTypeService
    {
        #region 【Ctor】
        public TagTypeService(AppDbContext db) : base(db, db.TagTypes)
        {
        }
        #endregion 【Ctor】
    }
}
