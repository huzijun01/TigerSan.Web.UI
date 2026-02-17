import { nanoid } from "nanoid"
import { computed, ref, shallowReactive, type App, type ShallowReactive } from "vue"
import type { Object2StringFunc } from "../../types"
import { RectPosition, RectHelper } from '../../helpers';

type MenuItemModelAction = (itemModel: MenuItemModel) => void

/** “值转换控件”基类 */
class ConverterBase {
    //#region 【Fields】
    /** 转换器 */
    _converter?: Object2StringFunc
    //#endregion 【Fields】

    //#region 【Properties】
    /** 值 */
    Value = ref<Object | undefined>()
    /** 文本 */
    Text = computed(() => this.GetText(this.Value.value))
    //#endregion 【Properties】

    //#region 【Functions】
    /** 获取“文本” */
    GetText(value?: object) {
        let text = ''

        if (this._converter) {
            text = this._converter(value);
        }
        else {
            text = new String(value).toString()
        }

        return text
    }
    //#endregion 【Functions】
}

/** “菜单项目”模型 */
class MenuItemModel extends ConverterBase {
    //#region 【Fields】
    /** 转换器 */
    _id = nanoid()
    /** 点击事件 */
    _onClick?: MenuItemModelAction
    /** 内部点击事件
     * （由“SelectModel”内部传入） */
    _onInternalClick: MenuItemModelAction
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否显示 */
    IsShow = ref(true)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(onInternalClick: MenuItemModelAction) {
        super()
        this._onInternalClick = onInternalClick
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 点击事件 */
    OnClick = () => {
        this._onInternalClick(this)

        if (this._onClick) {
            this._onClick(this)
        }
    }
    //#endregion 【Functions】
}

/** “选择框”模型 */
class SelectModel extends ConverterBase {
    //#region 【Fields】
    /** 菜单实例
     * （由“Select”内部维护） */
    static _appMenu?: App
    /** 选择后 */
    _onSelect?: MenuItemModelAction
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [内部维护]
    private left = ref(0)
    private top = ref(0)
    private bottom = ref(0)
    private isTopOpen = ref(false)
    readonly refRoot = ref<HTMLElement | undefined>()
    readonly refMenu = ref<HTMLElement | undefined>()
    //#endregion [内部维护]

    /** 占位文本 */
    Placeholder = ref('Please select.')
    /** 是否打开 */
    IsOpen = ref(false)
    /** 是否启用 */
    IsEnabled = ref(true)
    /** 项目集合 */
    Items: ShallowReactive<Object[]> = shallowReactive([])
    /** 宽度 */
    Width = ref(200)
    /** 菜单最大高度 */
    MenuMaxHeight = ref(300)

    //#region [computed]
    /** 项目集合 */
    ItemModels = computed(() => {
        let itemModels: MenuItemModel[] = []

        this.Items.forEach(item => {
            let itemModel = new MenuItemModel(this.OnInternalClick)
            itemModel._onClick = this._onSelect
            itemModel._onInternalClick = this.OnInternalClick
            itemModel._converter = this._converter
            itemModel.Value.value = item
            itemModel.IsShow.value = item != this.Value.value
            itemModels.push(itemModel)
        })

        return itemModels
    })

    /** 是否未定义: */
    isUndefined = computed(() => this.Value.value === undefined)

    /** 根类: */
    rootClassObj = computed(() => {
        return {
            open: this.IsOpen.value,
            disabled: !this.IsEnabled.value,
            'top-open': this.isTopOpen.value
        }
    })

    /** 根样式: */
    rootStyleObj = computed(() => {
        return {
            width: `${this.Width.value}px`
        }
    })

    /** 箭头样式: */
    arrowStyleObj = computed(() => {
        const arrowAngle = this.IsOpen.value ? -90 : 90
        return {
            transform: `rotate(${arrowAngle}deg)`
        }
    })

    /** 菜单样式: */
    menuStyleObj = computed(() => {
        let obj = {
            width: `${this.Width.value}px`,
            maxHeight: `${this.MenuMaxHeight.value}px`,
            left: '',
            top: '',
            bottom: '',
        }

        if (this.isTopOpen.value) {
            obj.left = `${this.left.value}px`
            obj.bottom = `${this.bottom.value}px`
        } else {
            obj.left = `${this.left.value}px`
            obj.top = `${this.top.value}px`
        }

        return obj
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    private InitWatch() {

    }

    /** 内部点击事件 */
    OnInternalClick = (itemModel: MenuItemModel) => {
        this.Value.value = itemModel.Value.value
        this.IsOpen.value = false
    }

    /** 更新菜单位置 */
    UpdateMenuPosition = () => {
        if (!this.IsOpen.value) return

        if (!this.refRoot.value) {
            console.warn('The refRoot is undefined!')
            return
        }

        if (!this.refMenu.value) {
            console.warn('The refMenu is undefined!')
            return
        }

        // 基准矩形:
        let rectRoot = this.refRoot.value.getBoundingClientRect()

        // 菜单矩形:
        let rectMenu = RectHelper.GetWithinWindowRect(rectRoot, this.refMenu.value.offsetWidth, this.refMenu.value.offsetHeight)

        // 设置位置:
        this.isTopOpen.value = rectMenu.Position === RectPosition.Top
        this.left.value = rectRoot.left
        this.top.value = rectRoot.bottom
        this.bottom.value = -rectRoot.top
    }
    //#endregion 【Functions】
}

export {
    type MenuItemModelAction,
    MenuItemModel,
    SelectModel
}