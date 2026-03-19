import { watch } from 'vue'
import { useUserInfo } from '@/stores'
import { CompanyMgtModel } from '@/models'
import { SelectModel, TableModel, TreeModel } from '@/0_tigersan_ui/tigerui'

/** 树 */
const tree = new TreeModel<CompanyMgtModel>()
tree.IsShowCheckbox.value = false
tree._onActive = node => {
    if (!node._data) {
        console.warn('The _data is undefined!')
        return
    }
    selectParent.Value.value = node._data.name
}
tree._onUnactive = () => {
    selectParent.Value.value = undefined
}
tree._onInited = () => tree.SetActiveNode(selectParent.Text.value)

/** 选择框 */
const selectParent = new SelectModel<string>()
selectParent.Width.value = 208
selectParent.IsAllowSearch.value = true
selectParent.PlaceholderCN.value = '请选择公司名称'
selectParent.PlaceholderEN.value = 'Please select a company'
selectParent._onSelect = () => {
    tree.ActiveNode.value = tree.NodeArray.value.find(n => n.Text.value === selectParent.Value.value)
}

watch(tree.ActiveData, data => {
    const userInfo = useUserInfo()
    if (data) {
        userInfo.Company = data.name
    } else {
        userInfo.Company = ''
    }
})

/** 选择框（表单） */
const selectFormParent = new SelectModel<number>()
selectFormParent.Width.value = 208
selectFormParent.IsAllowSearch.value = true
selectFormParent.PlaceholderCN.value = '请选择公司名称'
selectFormParent.PlaceholderEN.value = 'Please select a company'
selectFormParent._converter = (obj: any) => {
    if (!obj) return ''
    const index = obj as number
    const company = tree.GetDatas().find(d => d.id === index)
    return company ? company.name : ''
}

// 列头:
const companyMgtTable = new TableModel<CompanyMgtModel>([
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
    CompanyMgtModel,
    companyMgtTable,
    selectParent,
    selectFormParent,
}