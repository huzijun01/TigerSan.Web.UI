import { Colors } from '@/0_tigersan_ui/base'
import type { StringGetter, UnknownSetter, ObjectArrayFunc, Action } from '@/0_tigersan_ui/types'
import { ObjectHelper, CheckboxModel, CheckboxBehavior } from '@/0_tigersan_ui/helpers'
import { nanoid } from 'nanoid'
import { ref, computed, shallowReactive, type ShallowReactive, watch } from "vue"

type TableItemFunc = (itemModel: TableItemModel) => void
type TryTableItemFunc = TableItemFunc | undefined
type TableHeaderFunc = (itemModel: TableHeaderModel) => void
type TryTableHeaderFunc = TableHeaderFunc | undefined

/** 文本对齐 */
enum TextAlign {
    Left = 'left',
    Right = 'right',
    Center = 'center',
    Justify = 'justify'
}

/** “表格”配置 */
class TableModel {
    //#region 【Fields】
    /** “列头配置”集合 */
    _headerConfigs: TableHeaderConfig[]
    /** 列头背景
     * （防止tbody中的内容透过） */
    _headerBackground: String = 'var(--theme-table-header-background)'
    /** 复选框行为
     * （由“TableModel”维护） */
    _checkboxBehavior: CheckboxBehavior
    /** 初始化“项目” */
    _initItem: TryTableItemFunc
    /** 初始化“列头” */
    _initHeader: TryTableHeaderFunc
    /** 初始化“行模型”后 */
    _onInitRowModel?: Action
    /** “项目文本”输入 */
    _onItemTextInput: TryTableItemFunc
    /** “项目文本”改变 */
    _onItemTextChange: TryTableItemFunc
    /** “选中状态”改变 */
    _onSelectStateChange?: ObjectArrayFunc
    //#endregion 【Fields】

    //#region 【Properties】
    /** “行数据”集合 */
    RowDatas: ShallowReactive<object[]> = shallowReactive([])

    /** “列头模型”集合 */
    HeaderModels: ShallowReactive<TableHeaderModel[]> = shallowReactive([])

    /** “行模型”集合 */
    RowModels: ShallowReactive<TableRowModel[]> = shallowReactive([])

    /** 是否“全选” */
    IsSelectAll = ref(false)

    /** 是否“显示复选框” */
    IsShowCheckBox = ref(true)

    /** 是否“允许多选” */
    IsAllowMultiSelect = ref(true)

    //#region [computed]
    /** 是否“已选中” */
    IsSelected = computed(() => {
        return this.SelectedRowDatas.value.length > 0
    })

    /** 是否“已单选” */
    IsOnlySelected = computed(() => {
        return this.SelectedRowDatas.value.length === 1
    })

    /** 是否“显示全选复选框” */
    IsShowSelectAllCheckBox = computed(() => {
        return this.IsShowCheckBox && this.IsAllowMultiSelect.value
    })

    /** 行数 */
    Count = computed(() => {
        return this.RowDatas.length
    })

    /** “被选行”个数 */
    SelectedRowCount = computed(() => {
        return this.SelectedRowDatas.value.length
    })

    /** “被选中”的“行数据”集合 */
    SelectedRowDatas = computed(() => {
        let list = new Array<object>()

        this.RowModels.forEach(rowModel => {
            if (rowModel.IsChecked.value) {
                list.push(rowModel._rowData)
            }
        })

        return list
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(headerConfigs: TableHeaderConfig[]) {
        this._headerConfigs = headerConfigs

        /** 初始化“复选框行为” */
        this.InitHeaderModels()
        this._checkboxBehavior = new CheckboxBehavior(
            () => this.IsSelectAll.value,
            bool => this.IsSelectAll.value = bool,
            () => {
                let CheckboxModels = new Array<CheckboxModel>()
                this.RowModels.forEach(rowModel => {
                    let checkboxModel = new CheckboxModel(
                        rowModel,
                        rowModel => (rowModel as TableRowModel).IsChecked.value,
                        (rowModel, bool) => { (rowModel as TableRowModel).IsChecked.value = bool }
                    )
                    CheckboxModels.push(checkboxModel)
                })
                return CheckboxModels
            }
        )

        this._checkboxBehavior.IsAllowMultiSelect = this.IsAllowMultiSelect.value
        watch(this.IsAllowMultiSelect, () => {
            this._checkboxBehavior.IsAllowMultiSelect = this.IsAllowMultiSelect.value
        })
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 刷新 */
    Refresh(isInitHeaderModels: boolean = false) {
        if (isInitHeaderModels) {
            this.InitHeaderModels()
        }
        this.InitRowModel()
    }

    /** 初始化“列头模型”集合 */
    InitHeaderModels() {
        this.HeaderModels.splice(0)

        this._headerConfigs.forEach(headerConfig => {
            let headerModel = new TableHeaderModel(this, headerConfig._propName)
            SetTableHeaderModel(headerModel, headerConfig)
            if (this._initHeader) this._initHeader(headerModel) // 初始化
            this.HeaderModels.push(headerModel)
        })
    }

    /** 初始化“行模型” */
    InitRowModel() {
        this.RowModels.splice(0)

        this.RowDatas.forEach(rowData => {
            let rowModel = new TableRowModel(this, rowData)
            this.RowModels.push(rowModel)

            this.HeaderModels.forEach(headerModel => {
                let itemModel = new TableItemModel(headerModel, rowModel)
                if (this._initItem) this._initItem(itemModel) // 初始化
                rowModel.ItemModels.push(itemModel)
            })
        })

        this._checkboxBehavior.InitState()

        if (this._onInitRowModel) {
            this._onInitRowModel()
        }
    }

    /** 触发“选中状态”改变
     * （由“Table”内部自动调用） */
    RiseOnSelectStateChange() {
        if (!this._onSelectStateChange) return
        this._onSelectStateChange(this.SelectedRowDatas.value)
    }
    //#endregion 【Functions】
}

/** “行”配置 */
class TableRowModel {
    //#region 【Fields】
    _id = nanoid()
    /** 行数据 */
    _rowData: object
    /** 所属“表格”配置 */
    _tableModel: TableModel
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“选中” */
    IsChecked = ref(false)

    /** “项目模型”集合 */
    ItemModels: ShallowReactive<TableItemModel[]> = shallowReactive([])
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(tableModel: TableModel, rowData: object) {
        this._rowData = rowData
        this._tableModel = tableModel
    }
    //#endregion 【Ctor】
}

/** “项目”配置 */
class TableItemModel {
    //#region 【Fields】
    _id = nanoid()
    _headerModel: TableHeaderModel
    _rowModel: TableRowModel
    get _tableModel(): TableModel {
        return this._headerModel._tableModel
    }
    //#endregion 【Fields】

    /** 文本 */
    Text = ref('')
    /** 是否只读 */
    IsReadonly = computed(() => this._headerModel.IsReadonly.value)
    /** 颜色 */
    Color = ref('')
    /** 背景 */
    Background = ref(Colors.Transparent)

    //#region 【Ctor】
    constructor(headerModel: TableHeaderModel, rowModel: TableRowModel) {
        this._headerModel = headerModel
        this._rowModel = rowModel
        this.UpdateText()
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 项目文本输入
     * （由“TableItem”内部调用） */
    _onItemTextInput() {
        if (this._tableModel._onItemTextInput) {
            this._tableModel._onItemTextInput(this)
        }
    }

    /** 项目文本改变
     * （由“TableItem”内部调用） */
    _onItemTextChange() {
        if (this._tableModel._onItemTextChange) {
            this._tableModel._onItemTextChange(this)
        }
    }

    /** 更新“文本” 
     * “TableItem”内部会自动调用 */
    UpdateText() {
        this.Text.value = this._headerModel
            ._strGetter(this._rowModel._rowData, this._headerModel._propName)
    }

    /** 修改“行数据” */
    SetRowData() {
        this._headerModel
            ._objSetter(this._rowModel._rowData, this._headerModel._propName, this.Text.value)
    }
    //#endregion 【Functions】
}

/** “列头”模型 */
class TableHeaderModel {
    //#region 【Fields】
    _id = nanoid()
    /** 属性名 */
    _propName = ''
    /** 所属“表格”配置 */
    _tableModel: TableModel
    /** 文本获取方法 */
    _strGetter: StringGetter = ObjectHelper.DefaultStringGetter
    /** 对象修改方法 */
    _objSetter: UnknownSetter = ObjectHelper.DefaultUnknownSetter
    //#endregion 【Fields】

    /** 文本 */
    Text = ref('null')
    /** 文本对齐 */
    TextAlign = ref(TextAlign.Left)
    /** 是否只读 */
    IsReadonly = ref(false)
    /** 是否允许换行 */
    IsAllowWrap = ref(true)

    //#region 【Ctor】
    constructor(tableModel: TableModel, propName: string) {
        this._propName = propName
        this._tableModel = tableModel
    }
    //#endregion 【Ctor】
}

/** “列头”配置 */
class TableHeaderConfig {
    /** 属性名 */
    _propName: string
    /** 文本获取方法 */
    _strGetter?: StringGetter
    /** 对象修改方法 */
    _objSetter?: UnknownSetter
    /** 文本 */
    Text?: string
    /** 文本对齐 */
    TextAlign?: TextAlign
    /** 是否只读 */
    IsReadonly?: boolean
    /** 是否允许换行 */
    IsAllowWrap?: boolean

    //#region 【Ctor】
    constructor(propName: string) {
        this._propName = propName
    }
    //#endregion 【Ctor】
}

/** 将“配置”设置到“模型” */
function SetTableHeaderModel(model: TableHeaderModel, config: TableHeaderConfig) {
    model._propName = config._propName
    if (config._strGetter) model._strGetter = config._strGetter
    if (config._objSetter) model._objSetter = config._objSetter
    if (config.Text != undefined) model.Text.value = config.Text
    if (config.TextAlign != undefined) model.TextAlign.value = config.TextAlign
    if (config.IsReadonly != undefined) model.IsReadonly.value = config.IsReadonly
    if (config.IsAllowWrap != undefined) model.IsAllowWrap.value = config.IsAllowWrap
}

export {
    type TableItemFunc,
    type TryTableItemFunc,
    type TableHeaderFunc,
    type TryTableHeaderFunc,
    TextAlign,
    TableModel,
    TableRowModel,
    TableItemModel,
    TableHeaderModel,
    TableHeaderConfig,
    SetTableHeaderModel,
}