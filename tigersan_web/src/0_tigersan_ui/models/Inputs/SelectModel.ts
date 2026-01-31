import { nanoid } from "nanoid"
import { computed, ref, shallowReactive, type ShallowReactive } from "vue"
import type { TryObject2StringFunc } from "@/0_tigersan_ui/base"

type MenuItemModelAction = (itemModel: MenuItemModel) => void

class ConverterBase {
    //#region 【Fields】
    /** 转换器 */
    _converter: TryObject2StringFunc
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

class SelectModel extends ConverterBase {
    //#region 【Fields】
    /** 选择后 */
    _onSelect?: MenuItemModelAction
    //#endregion 【Fields】

    //#region 【Properties】
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
    //#endregion 【Properties】

    //#region 【Functions】
    /** 内部点击事件 */
    OnInternalClick = (itemModel: MenuItemModel) => {
        this.Value.value = itemModel.Value.value
        this.IsOpen.value = false
    }
    //#endregion 【Functions】
}

export {
    type MenuItemModelAction,
    MenuItemModel,
    SelectModel
}