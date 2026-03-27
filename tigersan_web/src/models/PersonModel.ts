import { AxiosHelper } from "@/helpers"
import { IdModel, IdModelHelper } from "./base/IdModel"
import type { IdNameModel } from "@/models"

export type PersonEvent = (model: PersonModel) => void

/** "组织机构"模型 */
export class PersonModel extends IdModel {
    company: bigint = 0n
    department: bigint = 0n
    role: bigint = 0n
    username = ''
    nickname = ''
    password = ''
    avatar?: string
    phone?: string
    mail?: string
}

class PersonMgtHelper extends IdModelHelper<PersonModel> {
    constructor() {
        super('Person')
    }

    /** 筛选“总数” */
    readonly GetCount = async (company?: bigint, department?: bigint, role?: bigint) => await AxiosHelper.GetCount(this._action, [{ key: 'company', value: company }, { key: 'department', value: department }, { key: 'role', value: role }])

    /** 筛选“数据”集合 */
    readonly GetListAsync = async (company?: bigint, department?: bigint, role?: bigint, pageSize?: number, pageNumber?: number) =>
        await AxiosHelper.GetList<PersonModel>(this._action, pageSize, pageNumber, 'FullList', [{ key: 'company', value: company }, { key: 'department', value: department }, { key: 'role', value: role }])

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属部门”集合 */
    readonly GetBelongDepartmentListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongDepartmentList`, [{ key: 'company', value: company }])

    /** 获取“所属角色”集合 */
    readonly GetBelongRoleListAsync = async (department?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongRoleList`, [{ key: 'department', value: department }])
}

export const personMgtHelper = new PersonMgtHelper()