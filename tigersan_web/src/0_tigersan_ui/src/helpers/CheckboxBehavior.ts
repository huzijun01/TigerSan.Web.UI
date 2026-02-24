import type { BooleanAction, BooleanFunc, BooleanGetter, BooleanSetter } from '../types'

type CheckboxModelsGetter = () => CheckboxBehaviorModel[]

/** 复选框模型 */
class CheckboxBehaviorModel {
    //#region 【Fields】
    private _getIsChecked: BooleanGetter
    private _setIsChecked: BooleanSetter
    /** 行模型 */
    _rowModel: object
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“选中” */
    get IsChecked() {
        return this._getIsChecked(this._rowModel)
    }
    set IsChecked(bool: boolean) {
        this._setIsChecked(this._rowModel, bool)
    }
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        rowModel: object,
        getIsChecked: BooleanGetter,
        setIsChecked: BooleanSetter,
    ) {
        this._rowModel = rowModel
        this._getIsChecked = getIsChecked
        this._setIsChecked = setIsChecked
    }
    //#endregion 【Ctor】
}

/** 复选框行为 */
class CheckboxBehavior {
    //#region 【Fields】
    /** 是否“联动” */
    private _isJoint = true
    private _getIsSelectAll: BooleanAction
    private _setIsSelectAll: BooleanFunc
    private _getCheckboxModels: CheckboxModelsGetter
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“全选” */
    get IsSelectAll() {
        return this._getIsSelectAll()
    }
    set IsSelectAll(bool: boolean) {
        this._setIsSelectAll(bool)
    }

    /** 是否“允许多选” */
    get IsAllowMultiSelect() {
        return this._isAllowMultiSelect
    }
    set IsAllowMultiSelect(bool: boolean) {
        this._isAllowMultiSelect = bool
        this.InitState()
    }
    private _isAllowMultiSelect = true

    /** “复选框模型”集合 */
    get CheckboxModels() {
        return this._getCheckboxModels()
    }
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        getIsSelectAll: BooleanAction,
        setIsSelectAll: BooleanFunc,
        getCheckboxModels: CheckboxModelsGetter,
    ) {
        this._getIsSelectAll = getIsSelectAll
        this._setIsSelectAll = setIsSelectAll
        this._getCheckboxModels = getCheckboxModels
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 取消选择“其它复选框” */
    UncheckOtherCheckboxs(rowModel?: object) {
        let checkboxModels = this.CheckboxModels
        checkboxModels.forEach(checkboxModel => {
            if (checkboxModel._rowModel === rowModel) return
            checkboxModel.IsChecked = false
        })
    }

    /** 初始化“状态"
     * （需在“集合改变后”手动调用） */
    InitState = () => {
        this.IsSelectAll = false
    }

    /** “全选状态”改变后
     * （需在“全选状态改变后”手动调用） */
    onIsSelectAllChanged = () => {
        if (!this._isJoint || !this.IsAllowMultiSelect) return

        this._isJoint = false

        let checkboxModels = this.CheckboxModels
        checkboxModels.forEach(checkboxModel => {
            checkboxModel.IsChecked = this.IsSelectAll
        })

        this._isJoint = true
    }

    /** “选中状态”改变后
     * （需在“选中状态改变后”手动调用） */
    onIsCheckedChanged = (rowModel?: object) => {
        if (!this._isJoint) return

        this._isJoint = false

        if (!this.IsAllowMultiSelect) {
            this.UncheckOtherCheckboxs(rowModel)
        }

        this.IsSelectAll = this.CheckboxModels.every(cm => cm.IsChecked)

        this._isJoint = true
    }
    //#endregion 【Functions】
}

export {
    type CheckboxModelsGetter,
    CheckboxBehaviorModel,
    CheckboxBehavior
}