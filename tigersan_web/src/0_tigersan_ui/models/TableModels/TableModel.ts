import type { StringGetter, ObjectSetter, Action } from '@/0_tigersan_ui/base'
import { DefaultStringGetter, DefaultObjectSetter } from '@/0_tigersan_ui/helpers'
import { nanoid } from 'nanoid'
import { ref, computed, shallowReactive, type ShallowReactive } from "vue"

class TableModel {
    /** “行数据”集合 */
    RowDatas: ShallowReactive<object[]> = shallowReactive([])

    /** “列头模型”集合 */
    HeaderModels: ShallowReactive<TableHeaderModel[]> = shallowReactive([])

    /** “行模型”集合 */
    RowModels: ShallowReactive<TableRowModel[]> = shallowReactive([])

    //#region 【Ctor】
    constructor(headerConfigs: TableHeaderConfig[]) {
        this.InitHeaderModels(headerConfigs)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 初始化“列头模型”集合 */
    InitHeaderModels(headerConfigs: TableHeaderConfig[]) {
        this.HeaderModels.splice(0)

        headerConfigs.forEach(headerConfig => {
            let headerModel = new TableHeaderModel(headerConfig._propName)
            SetTableHeaderModel(headerModel, headerConfig)
            this.HeaderModels.push(headerModel)
        })
    }

    /** 初始化“行模型” */
    InitRowModel() {
        this.RowModels.splice(0)

        this.RowDatas.forEach(rowData => {
            let rowModel = new TableRowModel(rowData)
            this.RowModels.push(rowModel)

            this.HeaderModels.forEach(headerModel => {
                let itemModel = new TableItemModel(headerModel, rowModel)
                rowModel.ItemModels.push(itemModel)
            })
        })
    }
    //#endregion 【Functions】
}

class TableRowModel {
    //#region 【Fields】
    _id = nanoid()
    _rowData: object
    //#endregion 【Fields】

    /** “项目模型”集合 */
    ItemModels: ShallowReactive<TableItemModel[]> = shallowReactive([])

    //#region 【Ctor】
    constructor(rowData: object) {
        this._rowData = rowData
    }
    //#endregion 【Ctor】
}

class TableItemModel {
    //#region 【Fields】
    _id = nanoid()
    _headerModel: TableHeaderModel
    _rowModel: TableRowModel
    /** 项目文本改变
     * （由“TableItemModel”内部自动传入，
     * 并由“TableItem”内部调用） */
    _onItemTextChange: Action
    //#endregion 【Fields】

    /** 文本 */
    Text = ref('')
    /** 是否只读 */
    IsReadonly = computed(() => this._headerModel.IsReadonly.value)

    //#region 【Ctor】
    constructor(headerModel: TableHeaderModel, rowModel: TableRowModel) {
        this._headerModel = headerModel
        this._rowModel = rowModel
        this.UpdateText()
        this._onItemTextChange = this.SetRowData
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 更新“文本” */
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

class TableHeaderModel {
    //#region 【Fields】
    _id = nanoid()
    /** 属性名 */
    _propName = ''
    /** 文本获取方法 */
    _strGetter: StringGetter = DefaultStringGetter
    /** 对象修改方法 */
    _objSetter: ObjectSetter = DefaultObjectSetter
    //#endregion 【Fields】

    /** 文本 */
    Text = ref('null')
    /** 是否只读 */
    IsReadonly = ref(false)

    //#region 【Ctor】
    constructor(propName: string) {
        this._propName = propName
    }
    //#endregion 【Ctor】
}

class TableHeaderConfig {
    /** 属性名 */
    _propName: string
    /** 文本获取方法 */
    _strGetter?: StringGetter
    /** 对象修改方法 */
    _objSetter?: ObjectSetter
    /** 文本 */
    Text?: string
    /** 是否只读 */
    IsReadonly?: boolean

    //#region 【Ctor】
    constructor(propName: string) {
        this._propName = propName
    }
    //#endregion 【Ctor】
}

function SetTableHeaderModel(model: TableHeaderModel, config: TableHeaderConfig) {
    model._propName = config._propName
    if (config._strGetter != undefined) model._strGetter = config._strGetter
    if (config._objSetter != undefined) model._objSetter = config._objSetter
    if (config.Text != undefined) model.Text.value = config.Text
    if (config.IsReadonly != undefined) model.IsReadonly.value = config.IsReadonly
}

export {
    TableModel,
    TableRowModel,
    TableItemModel,
    TableHeaderModel,
    TableHeaderConfig,
    SetTableHeaderModel,
}