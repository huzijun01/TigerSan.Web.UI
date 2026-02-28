import { nanoid } from "nanoid"
import { navData } from '@/navs/navModel'
import { TableModel } from '@/0_tigersan_ui/tigerui'

type CompanyEvent = (model: CompanyMgtModel) => void

/** "操作记录"模型 */
class CompanyMgtModel {
    id = nanoid()
    Name = ''
    Addr = ''
    Image = ''
    onClick?: CompanyEvent
    onDeconste?: CompanyEvent
    onEdit?: CompanyEvent
}

// 列头:
const companyMgtTable = new TableModel([
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

// 数据:
const arr: CompanyMgtModel[] =
    [
        {
            id: nanoid(),
            Name: '深圳市乾道数字科技有',
            Addr: '深圳',
            Image: '',
            onClick: () => { navData.GoHome() }
        },
    ]
companyMgtTable.RowDatas.push(...arr)

// 初始化:
companyMgtTable._initHeader = headerModel => {
    if (headerModel._propName === 'Index') {
        headerModel.Width.value = 50
    }
}

companyMgtTable._initItem = itemModel => {
}

export {
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
}