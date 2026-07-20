import { PaginationModel, TableModel, ItemType, loading, ArrayHelper, ObjectHelper, DialogHelper, DialogMode, Colors, DialogState, MyActionResult, Texts, WatchBehavior } from '@/0_tigersan_ui/tigerui'
import { companyHelper, siteHelper, inventoryRecordHelper, InventoryRecordModel } from '@/models'
import { CompanyMgtForm } from '@/pages/BasicSettings/BasicSettings/CompanyMgtPage/CompanyMgtForm'

export class InventoryRecordPageModel {
    //#region 【Fields】
    /** “可访问公司”监听器 */
    readonly watchAccessibleCompanies
    /** “场地”选择框 */
    readonly selectSite = siteHelper.GetIdNameSelectModel()

    /** 分页器 */
    readonly pagination = new PaginationModel()

    /** 表格模型 */
    readonly table = new TableModel<InventoryRecordModel>([
        {
            _propName: 'companyName',
            Text: Texts.Company,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'siteName',
            Text: Texts.Site,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'inStore',
            Text: Texts.InStore,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'stolid',
            Text: Texts.Stolid,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'add',
            Text: Texts.Add,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'reduce',
            Text: Texts.Reduce,
            IsReadonly: true,
            Type: ItemType.TextBox,
        },
        {
            _propName: 'time',
            Text: Texts.Time,
            IsReadonly: true,
            IsShowSlot: true,
            Type: ItemType.TextBox,
            _getString: source => ObjectHelper.GetDateString(source.time, true, false)
        },
    ])
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor() {
        this.watchAccessibleCompanies = new WatchBehavior(CompanyMgtForm.AccessibleCompanies, this.Refresh)

        this.table._onInitHeaderModels = () => {
            this.table.SetSlotHeader('time', false)
        }
        this.table.IsAllowMultiSelect.value = false
        this.pagination.IsShowSelectedRowCount.value = true
        this.table._onSlotChange = this.Refresh
        this.pagination._onChange = this.Refresh
        this.selectSite._onChange = this.Refresh
        this.selectSite._getItemsAsync = async () => await siteHelper.SelectIdNameByCompanyAsync(undefined, CompanyMgtForm.AccessibleCompanies.value)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 查 */
    readonly Refresh = async () => {
        try {
            loading.IsShow.value = true

            await companyHelper.UpdateIdNames()
            await this.selectSite.UpdateItemsAsync()

            this.pagination.Count.value = await inventoryRecordHelper.GetCount({
                companies: CompanyMgtForm.AccessibleCompanies.value,
                site: this.selectSite.Value.value?.id,
            })
            await inventoryRecordHelper.GetList({
                pageSize: this.pagination.PageSize.value,
                pageNumber: this.pagination.SelectedNum.value,
                sort: this.table.SlotHeader.value?._propName,
                ascending: this.table.IsAscending.value,
                companies: CompanyMgtForm.AccessibleCompanies.value,
                site: this.selectSite.Value.value?.id,
            }).then(arr => {
                ArrayHelper.Set(this.table.RowDatas, arr)
            })
        } finally {
            loading.IsShow.value = false
        }
    }

    /** 删 */
    readonly Delete = async () => {
        DialogHelper.Show(
            Texts.Confirm,
            Texts.DeleteConfirm.value,
            undefined,
            this.DeleteRowData,
            DialogMode.YesOrNo,
            Colors.Warning)
    }

    readonly DeleteRowData = async (state: DialogState) => {
        if (state != DialogState.Yes) return

        const model = this.table.SelectedRowDatas.value[0]
        if (!model) {
            console.warn('The model is undefined!')
            return
        }

        inventoryRecordHelper.Delete(model.id).then(res => {
            this.Refresh()
            MyActionResult.ShowResult(res, Texts.DeletedSuccessfully.value)
        })
    }
    //#endregion 【Functions】
}
