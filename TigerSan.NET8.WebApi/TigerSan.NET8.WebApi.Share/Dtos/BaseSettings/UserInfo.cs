using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class UserInfo : PersonEntity
    {
        public bool IsAdmin { get; set; } = false;
        public bool IsRoot { get; set; } = false;
        public string Captcha { get; set; } = string.Empty;
        public IdName Company { get; set; } = new IdName();
        public IdName Department { get; set; } = new IdName();
        public new IdName Role { get; set; } = new IdName();
        public List<AuthorityEntity> Authorities { get; set; } = new List<AuthorityEntity>();
        public string? Token { get; set; } = string.Empty;
    }
}
