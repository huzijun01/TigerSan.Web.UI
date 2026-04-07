import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { AxiosHelper } from "@/helpers"
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"

export type DepartmentEvent = (model: DepartmentModel) => void

/** "组织机构"模型 */
export class DepartmentModel extends IdNameModel {
    company: bigint = 0n
}

class DepartmentMgtHelper extends IdNameModelHelper<DepartmentModel> {
    constructor() {
        super('Department')
    }

    // 查:
    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择部门', 'Please select a department')
    }

    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint
    }) => await AxiosHelper.GetCount(this._action,
        {
            params: [{ key: 'company', value: param.company }]
        })

    /** 筛选“数据”集合 */
    readonly GetListAsync = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
    }) =>
        await AxiosHelper.GetList<DepartmentModel>(this._action,
            {
                pageSize: param.pageSize,
                pageNumber: param.pageNumber,
                params: [
                    { key: 'company', value: param.company }
                ]
            })

    /** 获取“ID名称对”集合 */
    readonly SelectIdNameByCompanyAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/SelectIdNameByCompany`,
        [{ key: 'company', value: company }])

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)
}

export const departmentMgtHelper = new DepartmentMgtHelper()