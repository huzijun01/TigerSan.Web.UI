import { TableModel, TextAlign } from '@/0_tigersan_ui/tigerui'
import { nanoid } from "nanoid"
import { navData } from '@/navModel'

type CompanyEvent = (model: CompanyMgtModel) => void

/** "操作记录"模型 */
class CompanyMgtModel {
    id = nanoid()
    Name = ''
    Addr = ''
    Image = ''
    onClick?: CompanyEvent
    onDelete?: CompanyEvent
    onEdit?: CompanyEvent
}

// 列头:
let companyMgtTable = new TableModel([
    {
        _propName: 'Name',
        Text: '公司名称',
        TextAlign: TextAlign.Center,
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
let arr: CompanyMgtModel[] =
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
companyMgtTable._initItem = itemModel => {
}

export {
    type CompanyEvent,
    CompanyMgtModel,
    companyMgtTable,
}