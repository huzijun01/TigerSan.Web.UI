using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Interfaces.Models
{
    public interface IBindingRecordService : IIdServiceBase<BindingRecordEntity>
    {
        public Task<MyActionResult<BindingRecordEntity>> GetLast(long? tag = null, long? asset = null);
        public Task<MyActionResult<List<BindingRecordDto>>> GetFullList(
            int? pageSize = null,
            int? pageNumber = null,
            string? sort = null,
            bool? ascending = null,
            FilterDto? filter = null);
    }
}
