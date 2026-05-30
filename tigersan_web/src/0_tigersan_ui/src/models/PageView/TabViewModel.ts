import { nanoid } from "nanoid"
import { ref, watch, computed, shallowRef, shallowReactive, type Component } from "vue"
import { type Data } from "../../helpers"

export type TabPageHandler = (pageModel: TabPageModel) => void

export class TabPageConfig {
    /** 标题 */
    Title?: string
    /** 是否选中 */
    IsSelected?: boolean
    /** 组件 */
    _component?: Component
    /** 参数 */
    _rootProps?: Data | null
}

/** 标签页模型 */
export class TabPageModel {
    //#region 【Fields】
    readonly _id = nanoid()
    /** 所属“标签视图” */
    readonly _tabView: TabViewModel
    /** 组件 */
    _component?: Component
    /** 模型 */
    _rootProps?: Data | null
    //#endregion 【Fields】

    //#region 【Properties】
    /** 标题 */
    readonly Title = ref('title')

    //#region [computed]
    /** 是否选中 */
    readonly IsSelected = computed(() => {
        return this._tabView.SelectedPage.value === this
    })
    /** “是否选中”类名 */
    readonly SelectedClass = computed(() => {
        return { selected: this.IsSelected.value }
    })
    /** “隐藏”类名 */
    readonly HiddenClass = computed(() => {
        return { 'display-none': !this.IsSelected.value }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        tabView: TabViewModel,
        title?: string,
        component?: Component,
        rootProps?: Data | null
    ) {
        this._tabView = tabView
        if (title) this.Title.value = title
        this._component = component
        this._rootProps = rootProps
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly OnClick = () => {
        this._tabView.SelectedPage.value = this
        this._tabView.Clicked?.(this)
    }
    //#endregion 【Functions】
}

/** 标签视图模型 */
export class TabViewModel {
    //#region 【Properties】
    readonly Pages = shallowReactive<TabPageModel[]>([])
    /** 选中的“标签页模型” */
    readonly SelectedPage = shallowRef<TabPageModel | undefined>()
    //#endregion 【Properties】

    //#region 【Events】
    /** 点击后 */
    Clicked?: TabPageHandler
    /** “是否选中”改变后 */
    IsSelectedChanged?: TabPageHandler
    //#endregion 【Events】

    //#region 【Ctor】
    constructor(configs?: TabPageConfig[]) {
        this.Init(configs)

        watch(this.SelectedPage, (value, oldValue) => {
            if (value != oldValue && value) {
                this.IsSelectedChanged?.(value)
            }
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 初始化 */
    readonly Init = (configs?: TabPageConfig[]) => {
        this.Pages.splice(0)
        this.SelectedPage.value = undefined

        if (!configs) return

        configs.forEach(config => {
            const page = new TabPageModel(
                this,
                config.Title,
                config._component,
                config._rootProps)
            if (config.IsSelected) this.SelectedPage.value = page
            this.Pages.push(page)
        })

        if (!this.SelectedPage.value && this.Pages.length > 0) {
            this.SelectedPage.value = this.Pages[0]
        }
    }
    //#endregion 【Functions】
}