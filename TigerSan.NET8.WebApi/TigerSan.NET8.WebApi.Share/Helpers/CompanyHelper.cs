using TigerSan.CsvLog;
using TigerSan.NET8.WebApi.Share.Entities;

namespace TigerSan.NET8.WebApi.Share.Helpers
{
    public static class CompanyHelper
    {
        #region 获取“后代公司”集合
        /// <summary>获取“后代公司”集合</summary>
        public static List<CompanyEntity> GetSubCompanies(List<CompanyEntity> companies, CompanyEntity rootCompany)
        {
            var nodes = Companies2TreeNodes(companies);
            if (nodes == null)
            {
                LogHelper.Instance.IsNull(nameof(nodes));
                return [];
            }

            var subs = TreeHelper.GetSubs(nodes, rootCompany.Id);
            if (subs == null) return [];

            return subs.Select(n => n.Data).ToList();
        }
        #endregion

        #region “公司集合”转“树节点集合”
        /// <summary>“公司集合”转“树节点集合”</summary>
        public static List<TreeNode<CompanyEntity>>? Companies2TreeNodes(List<CompanyEntity> companies)
        {
            return TreeHelper.List2TreeNodes(
                companies,
                item => item.Id,
                item => item.Parent);
        }
        #endregion
    }
}
