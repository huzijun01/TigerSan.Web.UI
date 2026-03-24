import { SelectModel } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, IdNameModelHelper } from "./base/IdNameModel"
import { AxiosHelper, AuthorityModel } from "@/helpers"

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
        readonly GetList = async (pageSize?: number, pageNumber?: number) => await AxiosHelper.GetList<RoleAuthorityModel>(this._action, pageSize, pageNumber, 'FullList')

    /** 获取“筛选框模型” */
    GetSelectModel(): SelectModel<IdNameModel> {
        return super.GetSelectModel('请选择角色', 'Please select a role')
    }
}

export const roleMgtHelper = new RoleMgtHelper()