import { Icons, NavFolderConfig } from '@/0_tigersan_ui/tigerui'
import { Authorities } from './Authorities'
import AssetMgtPage from '@/pages/Home/AssetMgtPage/AssetMgtPage.vue'

export const navHome: NavFolderConfig = {
    Folders: [
        {
            Title: "资产管理",
            Icon: Icons.Asset,
            IsOpen: true,
            _authority: Authorities.BusinessFolder1,
            Buttons: [
                {
                    Title: "资产台账",
                    Icon: Icons.Asset,
                    IsSelected: true,
                    IsShowCloseButton: false,
                    _component: AssetMgtPage,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产地图",
                    Icon: Icons.Global_Linear,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产盘点",
                    Icon: Icons.Log,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产调拨",
                    Icon: Icons.Outbound,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产预警",
                    Icon: Icons.Bell,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产维护",
                    Icon: Icons.Tools,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "资产报表",
                    Icon: Icons.Chart_Pie,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
            ]
        },
        {
            Title: "其它",
            Icon: Icons.Folder_Linear,
            IsOpen: true,
            Buttons: [
                {
                    Title: "过户管理",
                    Icon: Icons.Transfer,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "车辆列表",
                    Icon: Icons.Transport,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "统计分析",
                    Icon: Icons.Chart_Line,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "异常信息",
                    Icon: Icons.Error,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
                {
                    Title: "业务流程",
                    Icon: Icons.Flowchart,
                    IsSelected: false,
                    _component: undefined,
                    _authority: Authorities.Business1,
                },
            ]
        },
    ],
    Buttons: [
    ]
}