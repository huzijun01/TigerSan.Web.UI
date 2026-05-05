import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import { Authorities } from './Authorities'
import AssetMgtPage from '@/pages/Home/AssetMgtPage/AssetMgtPage.vue'

export const navHome: NavFolderConfig = {
    Folders: [
        {
            Title: "资产管理",
            Icon: Icons.Asset,
            IsOpen: true,
            _authority: Authorities.AssetMgtFolder,
            Buttons: [
                {
                    Title: "资产台账",
                    Icon: Icons.Asset,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: AssetMgtPage,
                    _authority: Authorities.AssetLedgerPage,
                },
                {
                    Title: "资产地图",
                    Icon: Icons.Global_Linear,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetMapPage,
                },
                {
                    Title: "资产盘点",
                    Icon: Icons.Log,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetCheckPage,
                },
                {
                    Title: "资产调拨",
                    Icon: Icons.Outbound,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetAllocationPage,
                },
                {
                    Title: "资产预警",
                    Icon: Icons.Bell,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetAlarmPage,
                },
                {
                    Title: "资产维护",
                    Icon: Icons.Tools,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetMaintenancePage,
                },
                {
                    Title: "资产报表",
                    Icon: Icons.Chart_Pie,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AssetReportPage,
                },
            ]
        },
        {
            Title: "其它",
            Icon: Icons.Folder_Linear,
            IsOpen: true,
            _authority: Authorities.OtherFolder,
            Buttons: [
                {
                    Title: "过户管理",
                    Icon: Icons.Transfer,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.OwnershipTransferPage,
                },
                {
                    Title: "车辆列表",
                    Icon: Icons.Transport,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.VehiclesListPage,
                },
                {
                    Title: "统计分析",
                    Icon: Icons.Chart_Line,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.AnalysisPage,
                },
                {
                    Title: "异常信息",
                    Icon: Icons.Error,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.ErrorInfoPage,
                },
                {
                    Title: "业务流程",
                    Icon: Icons.Flowchart,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.WorkFlowPage,
                },
            ]
        },
    ],
    Buttons: [
    ]
}