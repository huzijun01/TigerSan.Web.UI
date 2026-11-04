import { Icons, NavBarModel, TextModel, Texts } from "../../packages"
// Chart:
import TablePage from "../../pages/Chart/TablePage/TablePage.vue"
import PiePage from "../../pages/Chart/PiePage/PiePage.vue"
import EChartsPage from "../../pages/Chart/EChartsPage/EChartsPage.vue"
// Input:
import InputPage from "../../pages/Input/InputPage/InputPage.vue"
// Feedback:
import DialogPage from "../../pages/Dialog/DialogPage/DialogPage.vue"
import ToastPage from "../../pages/Dialog/ToastPage/ToastPage.vue"
import LoadingPage from "../../pages/Dialog/LoadingPage/LoadingPage.vue"
// Feedback:
import MapPage from "../../pages/Other/MapPage/MapPage.vue"
import SvgPage from "../../pages/Other/SvgPage/SvgPage.vue"

export class HomeModel {
    readonly nav = new NavBarModel({
        Folders: [
            {
                Title: Texts.Chart,
                Icon: Icons.Chart_Line,
                Buttons: [
                    {
                        Title: Texts.Table,
                        Icon: Icons.Table,
                        IsSelected: true,
                        _component: TablePage,
                    },
                    {
                        Title: Texts.Pie,
                        Icon: Icons.Chart_Pie,
                        _component: PiePage,
                    },
                    {
                        Title: 'ECharts',
                        Icon: Icons.Chart_Line,
                        _component: EChartsPage,
                    },
                ]
            },
            {
                Title: Texts.Form,
                Icon: Icons.Log,
                Buttons: [
                    {
                        Title: Texts.Input,
                        Icon: Icons.TextBox_T,
                        _component: InputPage,
                    },
                ]
            },
            {
                Title: Texts.Feedback,
                Icon: Icons.Msg_Circle,
                Buttons: [
                    {
                        Title: Texts.Dialog,
                        Icon: Icons.Window,
                        _component: DialogPage,
                    },
                    {
                        Title: TextModel.Computed('Toast', '提示框‌'),
                        Icon: Icons.About,
                        _component: ToastPage,
                    },
                    {
                        Title: Texts.Loading,
                        Icon: Icons.Loading_Dot,
                        _component: LoadingPage,
                    },
                ]
            },
            {
                Title: Texts.Other,
                Icon: Icons.Add_Corner,
                Buttons: [
                    {
                        Title: Texts.Map,
                        Icon: Icons.Global_Linear,
                        _component: MapPage,
                    },
                    {
                        Title: 'SVG',
                        Icon: Icons.PIC,
                        _component: SvgPage,
                    },
                ]
            },
        ]
    })

    constructor() {

    }
}