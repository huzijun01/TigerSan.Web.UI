import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { AxiosHelper, KeyValue } from "@/helpers"
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

    /** 获取“所属公司”集合 */
    readonly GetCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/CompanyList`)

    /** 筛选“数据”集合 */
    readonly GetFilterListAsync = async (company?: bigint, pageSize?: number, pageNumber?: number) => {
        const params: KeyValue[] = [{ key: 'company', value: company }]
        return await AxiosHelper.GetList<DepartmentModel>(this._action, pageSize, pageNumber, undefined, params)
    }

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择部门', 'Please select a department')
    }
}

export const departmentMgtHelper = new DepartmentMgtHelper()