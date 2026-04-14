namespace TigerSan.NET8.WebApi.Share.Entities
{
    public enum AssetStates
    {
        Offline = 0,
        Stolid = 1,
        Inbound = 2,
        Outbound = 3,
        InTransit = 4,
        InTransitTimeout = 5,
    }

    public static class AssetState
    {
        public static string GetName(AssetStates state)
        {
            return state switch
            {
                AssetStates.Offline => "离线",
                AssetStates.Stolid => "滞留",
                AssetStates.Inbound => "入库",
                AssetStates.Outbound => "出库",
                AssetStates.InTransit => "在途",
                AssetStates.InTransitTimeout => "在途超时",
                _ => "未知状态"
            };
        }
    }
}
