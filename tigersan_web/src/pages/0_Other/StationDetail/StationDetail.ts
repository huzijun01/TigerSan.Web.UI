import StationPathPage from './StationPathPage/StationPathPage.vue'
import StationRecordPage from './StationRecordPage/StationRecordPage.vue'
import StationBindingPage from './StationBindingPage/StationBindingPage.vue'
import { TabViewModel, PopWindowModel, Texts } from '@/0_tigersan_ui/tigerui'
import { StationPathPageModel } from './StationPathPage/StationPathPageModel'
import { StationRecordPageModel } from './StationRecordPage/StationRecordPageModel'
import { StationBindingPageModel } from './StationBindingPage/StationBindingPageModel'

/** 基站详情 */
export class StationDetail {
    //#region 【Fields】
    /** 轨迹 */
    readonly pathPage = new StationPathPageModel()
    /** 记录 */
    readonly recordPage = new StationRecordPageModel()
    /** 绑定记录 */
    readonly stationBindingPage = new StationBindingPageModel()

    /** 标签视图 */
    readonly tabView = new TabViewModel([
        {
            Title: '轨迹',
            _component: StationPathPage,
            _rootProps: { model: this.pathPage },
        },
        {
            Title: '记录',
            _component: StationRecordPage,
            _rootProps: { model: this.recordPage },
        },
        {
            Title: '绑定记录',
            _component: StationBindingPage,
            _rootProps: { model: this.stationBindingPage },
        },
    ])

    /** 弹窗 */
    readonly pop = new PopWindowModel()
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.pop.MinWidth.value = '80vw'
        this.pop.MinHeight.value = '70vh'
        this.pop._onShow = () => this.tabView.SelectedPage.value = this.tabView.Pages[0]
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Show = (station: bigint, macAddr: string) => {
        this.pathPage._station = station
        this.recordPage._station = station
        this.stationBindingPage._station = station

        this.pop.Title.value = `${Texts.StationDetail.value} - ${macAddr}`
        this.pop.Show()
    }
    //#endregion 【Functions】
}