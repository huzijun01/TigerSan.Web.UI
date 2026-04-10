import { AuthorityModel, SelectModel } from "@/0_tigersan_ui/tigerui"
import { AxiosHelper } from "@/helpers"
import { IdNameModel } from "../base/SelectModel"
import { IdNameModelHelper } from "../base/IdNameModel"

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

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdNameModel> {
        return super.GetIdNameSelectModel('请选择角色', 'Please select a role')
    }

    // 查:
    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        department?: bigint
    }) => await AxiosHelper.GetCount(this._action,
        {
            filter: {
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                    }
                }
            }
        })

    /** 筛选“数据”集合 */
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        department?: bigint,
    }) => await AxiosHelper.GetList<RoleAuthorityModel>(this._action,
        {
            pageSize: param.pageSize,
            pageNumber: param.pageNumber,
            strList: 'FullList',
            filter: {
                parent: {
                    id: param.department,
                    parent: {
                        id: param.company,
                    }
                }
            }
        })

    /** 获取“ID名称对”集合 */
    readonly SelectIdNameByDepartment = async (department?: bigint) => await this.GetIdNames({
        filter: {
            filters: [{ propName: 'Department', value: department }]
        }
    })

    /** 获取“所属公司”集合 */
    readonly GetBelongCompanyListAsync = async () => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongCompanyList`)

    /** 获取“所属部门”集合 */
    readonly GetBelongDepartmentListAsync = async (company?: bigint) => await AxiosHelper.GetData<IdNameModel[]>(`${this._action}/BelongDepartmentList`, [{ key: 'company', value: company }])
}

export const roleMgtHelper = new RoleMgtHelper()