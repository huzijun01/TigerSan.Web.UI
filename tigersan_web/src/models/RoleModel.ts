import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { AxiosHelper } from "@/helpers"
import { AuthorityModel } from '../0_tigersan_ui/src/models/Authority/AuthorityModel'
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"

export type RoleEvent = (model: RoleAuthorityModel) => void

/** "角色"模型 */
export class RoleAuthorityModel extends IdNameModel {
    company: bigint = 0n
    department: bigint = 0n
    authorities: AuthorityModel[] = []
}

class RoleMgtHelper extends IdNameModelHelper<RoleAuthorityModel> {
    constructor() {
        super('Role')
    }

    // 查:
    /** 筛选“总数” */
    readonly GetCountAsync = async (company?: bigint, department?: bigint) => await AxiosHelper.GetCount(this._action, [{ key: 'company', value: company }, { key: 'department', value: department }])

    /** 筛选“数据”集合 */
    readonly GetListAsync = async (company?: bigint, department?: bigint, pageSize?: number, pageNumber?: number) =>
        await AxiosHelper.GetList<RoleAuthorityModel>(this._action, pageSize, pageNumber, 'FullList', [{ key: 'company', value: company }, { key: 'department', value: department }])

    /** 获取“ID名称对”集合 */
    readonly SelectIdNameByDepartment = async (department?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/SelectIdNameByDepartment`, [{ key: 'department', value: department }])

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属部门”集合 */
    readonly GetBelongDepartmentListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongDepartmentList`, [{ key: 'company', value: company }])

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择角色', 'Please select a role')
    }
}

export const roleMgtHelper = new RoleMgtHelper()