namespace TigerSan.NET8.WebApi.Share.Entities
{
    public class RoleAuthorityEntity : RoleEntity
    {
        public long Company { get; set; }
        public List<AuthorityEntity> Authorities { get; set; } = new List<AuthorityEntity>();
    }
}
