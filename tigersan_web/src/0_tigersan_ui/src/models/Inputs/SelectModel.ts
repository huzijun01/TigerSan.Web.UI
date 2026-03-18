import { nanoid } from "nanoid"
import { ref, watch, computed, shallowReactive, type App, type ShallowReactive } from "vue"
import { Texts } from "../../texts"
import { TextModel } from "../Text/TextModel"
import { ConverterBase } from "./ConverterBase"
import { RectPosition, RectHelper } from '../../helpers'

type MenuItemModelAction<TSource> = (itemModel: MenuItemModel<TSource>) => void

/** “菜单项目”模型 */
class MenuItemModel<TSource> extends ConverterBase<TSource> {
    //#region 【Fields】
    /** ID */
    readonly _id = nanoid()
    /** 所属“选择框” */
    readonly _select: SelectModel<TSource>
    /** 点击事件 */
    _onClick?: MenuItemModelAction<TSource>
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [computed]
    /** 是否显示 */
    readonly IsShow = computed(() => {
        return this.Value.value != this._select.Value.value
            && this.IsFuzzyIncludes(this._select.SearchText.value)
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(select: SelectModel<TSource>) {
        super()
        this._select = select
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 点击事件 */
    readonly OnClick = () => {
        this._select.IsOpen.value = false
        this._select.Value.value = this.Value.value

        if (this._onClick) {
            this._onClick(this)
        }
    }
    //#endregion 【Functions】
}

/** “选择框”模型 */
class SelectModel<TSource> extends ConverterBase<TSource> {
    //#region 【Fields】
    /** 菜单实例
     * （由“Select”内部维护） */
    static _appMenu?: App
    /** 选择后 */
    _onSelect?: MenuItemModelAction<TSource>
    //#endregion 【Fields】

    //#region 【Properties】
    //#region [内部维护]
    private readonly left = ref(0)
    private readonly top = ref(0)
    private readonly bottom = ref(0)
    private readonly isTopOpen = ref(false)
    readonly refRoot = ref<HTMLElement | undefined>()
    readonly refMenu = ref<HTMLElement | undefined>()
    readonly refInput = ref<HTMLElement | undefined>()
    //#endregion [内部维护]

    /** 宽度 */
    readonly Width = ref(200)
    /** 是否“充满父容器” */
    readonly IsFull = ref(false)
    /** 菜单最大高度 */
    readonly MenuMaxHeight = ref(300)
    /** 是否“打开” */
    readonly IsOpen = ref(false)
    /** 是否“启用” */
    readonly IsEnabled = ref(true)
    /** 是否“允许搜索” */
    readonly IsAllowSearch = ref(false)
    /** 搜索文本
     * （由“MenuItemModel”维护） */
    readonly SearchText = ref('')
    /** 占位文本（英文） */
    readonly PlaceholderEN = ref('')
    /** 占位文本（中文） */
    readonly PlaceholderCN = ref('')
    /** 项目集合 */
    readonly Items: ShallowReactive<TSource[]> = shallowReactive([])

    //#region [computed]
    /** 显示的“占位文本” */
    readonly ShowPlaceholder = TextModel.DefaultComputed(this.PlaceholderEN, this.PlaceholderCN, Texts.PleaseSelect)

    /** 是否“无内容” */
    readonly IsNoContent = computed(() => this.Items.length < 1)

    /** 项目集合 */
    readonly ItemModels = computed(() => {
        const itemModels: MenuItemModel<TSource>[] = []

        this.Items.forEach(item => {
            const itemModel = new MenuItemModel<TSource>(this)
            itemModel._onClick = this._onSelect
            itemModel._converter = this._converter
            itemModel.Value.value = item
            itemModels.push(itemModel)
        })

        return itemModels
    })

    /** 根类 */
    readonly RootClass = computed(() => {
        return {
            open: this.IsOpen.value,
            disabled: !this.IsEnabled.value,
            'top-open': this.isTopOpen.value
        }
    })

    /** 根样式 */
    readonly widthStyle = computed(() => {
        return {
            width: this.IsFull.value ? '100%' : `${this.Width.value}px`
        }
    })

    /** 箭头样式 */
    readonly arrowStyleObj = computed(() => {
        const arrowAngle = this.IsOpen.value ? -90 : 90
        return {
            transform: `rotate(${arrowAngle}deg)`
        }
    })

    /** 菜单样式 */
    readonly menuStyleObj = computed(() => {
        const obj = {
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

    //#region 【Ctor】
    constructor() {
        super()

        watch(this.IsOpen, isOpen => {
            this.SearchText.value = ''

            if (!isOpen) {
                this.UpdateText()
            }
        })

        watch(this.Text, text => {
            if (this.IsOpen.value) {
                this.SearchText.value = text
            }

            if (this.Text.value === '') {
                this.Value.value = undefined
            }
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 更新菜单位置 */
    readonly UpdateMenuPosition = () => {
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
        const rectRoot = this.refRoot.value.getBoundingClientRect()

        // 菜单矩形:
        const rectMenu = RectHelper.GetWithinWindowRect(rectRoot, this.refMenu.value.offsetWidth, this.refMenu.value.offsetHeight)

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