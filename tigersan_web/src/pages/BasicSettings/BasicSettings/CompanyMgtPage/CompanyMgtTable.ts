import { companyMgtHelper, CompanyModel } from '@/models'
import { ArrayHelper, BigintHelper, TableModel, TreeModel } from '@/0_tigersan_ui/tigerui'

/** 树 */
const tree = new TreeModel<CompanyModel>()
tree.IsShowCheckbox.value = false
tree._onActive = node => {
    if (!node._data) {
        console.warn('The _data is undefined!')
        return
    }
    selectCompany.Value.value = selectCompany.Items.find(n => BigintHelper.IsEqualAndNotUndefined(n.id, node._data?.id))
}
tree._onUnactive = () => {
    selectCompany.Value.value = undefined
}
tree._onInited = () => tree.SetActiveNode(selectCompany.Text.value)

/** “公司”选择框 */
const selectCompany = companyMgtHelper.GetSelectModel()
selectCompany._onChange = () => {
    tree.ActiveNode.value = tree.NodeArray.value.find(n => BigintHelper.IsEqualAndNotUndefined(n._data?.id, selectCompany.Value.value?.id))
}

/** “父公司”选择框 */
const selectParentCompany = companyMgtHelper.GetSelectModel()
const AddGetItemsAsync = selectParentCompany._getItemsAsync
const EditGetItemsAsync = async () => {
    const arr = await companyMgtHelper.GetIdNames()

    const active = tree.ActiveNode.value
    if (!active) {
        console.warn('The node is undefined!')
        return arr
    }

    // 剔除“自身节点”及“后代节点”:
    const ids = active.GetArray().map(n => n._data?.id)
    ArrayHelper.Filter(arr, i => !BigintHelper.IsContain(ids, i.id))

    return arr
}

// 列头:
const companyMgtTable = new TableModel<CompanyModel>([
    {
        _propName: 'Name',
        Text: '公司名称',
        IsReadonly: true,
        IsAllowWrap: false,
    },
    {
        _propName: 'Addr',
        Text: '公司地址',
        IsReadonly: true,
        IsAllowWrap: false,
    },
])
companyMgtTable.IsAllowMultiSelect.value = false

// 初始化:
companyMgtTable._initHeader = headerModel => {
    if (headerModel._propName === 'id') {
        headerModel.Width.value = 100
    }
}

companyMgtTable._initItem = itemModel => {
}

export {
    tree,
    CompanyModel,
    companyMgtTable,
    selectCompany,
    selectParentCompany,
    AddGetItemsAsync,
    EditGetItemsAsync,
}