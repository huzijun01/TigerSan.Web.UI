namespace TigerSan.NET8.WebApi.Share.Dtos
{
    public class MqttConnection
    {
        public string ServerUrl { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AppSettings
    {
        public string ListenUrl { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
        public MqttConnection MqttConnection { get; set; } = new MqttConnection();
    }
}
