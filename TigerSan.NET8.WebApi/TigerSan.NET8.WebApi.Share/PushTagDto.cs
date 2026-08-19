using Newtonsoft.Json;
using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Dtos;
using TigerSan.NET8.WebApi.Share.Helpers;
using TigerSan.NET8.WebApi.Share.Entities;
using TigerSan.NET8.WebApi.Share.Extensions;

namespace TigerSan.NET8.WebApi.Share
{
    #region “公贝”数据
    public class GongBeiData
    {
        public string Type { get; set; } = "device.info.report";
        public TagDto Data { get; set; }
        public GongBeiData(TagDto tag)
        {
            Data = tag;
        }
    }
    #endregion

    public static class PushTagDto
    {
        #region 【Fields】
        static readonly string _urlGongBei = "https://connector.gongbeiyun.com/connector/api/webhook/test/b6978bf3c90d4ab4b1d2740fe88cefb0";
        static readonly string _testUrlGongBei = "https://test-asset.gongbeiyun.com/connector/api/webhook/test/b6978bf3c90d4ab4b1d2740fe88cefb0";
        #endregion 【Fields】

        #region 【Functions】
        #region 推送“标签数据”
        public static async Task<MyActionResult<object>> PushTagDtoAsync(TagDto tag)
        {
            try
            {
                if (tag.EqpType == EqpTypes.Locator)
                {
                }

                var gongBeiData = new GongBeiData(tag);
                await HttpHelper.PostAsync<GongBeiData, object>(_testUrlGongBei, gongBeiData);

                return MyResults<object>.OperationSuccess;
            }
            catch (Exception ex)
            {
                return MyResults<object>.Error(LogHelper.Instance.Error(ex.GetMessage()));
            }
        }
        #endregion
        #endregion 【Functions】
    }
}
