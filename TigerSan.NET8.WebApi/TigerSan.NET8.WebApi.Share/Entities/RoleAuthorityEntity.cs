namespace TigerSan.NET8.WebApi.Share.Entities
{
    public class RoleAuthorityEntity : RoleEntity
    {
        public List<AuthorityEntity> Authorities { get; set; } = new List<AuthorityEntity>();
    }
}
