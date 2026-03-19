import { ref } from 'vue'
import { configs } from './configs'
import { MyActionResult } from '@/models'
import { AxiosHelper, FilterModel } from './AxiosHelper'
import { Colors, TreeModel, TreeNodeModel } from "@/0_tigersan_ui/tigerui"

/** “权限”模型 */
export class AuthorityModel {
    readonly id?: number = undefined
    role: number = 0
    path = ''
    isReadonly = false
}

/** “权限助手”模型 */
export class AuthorityHelper {
    //#region 【Fields】
    static readonly _action = 'AuthorityMgt'
    /** “权限”树模型 */
    readonly _tree = new TreeModel<boolean>(configs, false, true)
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“只读” */
    readonly IsReadonly = ref(false)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this._tree._onInit = node => {
            if (node._data) {
                node.Color.value = Colors.Warning
            }
        }
        this._tree._onActive = node => {
            if (node._data === undefined) {
                console.warn('The _data is undefined!')
                return
            }
            this.IsReadonly.value = node._data
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [private]
    /** 设置“是否只读” */
    private readonly SetIsReadonly = (node: TreeNodeModel<boolean>, isReadonly: boolean) => {
        node._data = this.IsReadonly.value
        node.Color.value = isReadonly ? Colors.Warning : ''
    }
    //#endregion [private]

    /** 初始化 */
    readonly Init = () => {
        this._tree.Init()
    }

    /** 设置“是否只读” */
    readonly SetIsReadonlyRange = () => {
        const node = this._tree.ActiveNode.value
        if (node) {
            node.Traverse(n => this.SetIsReadonly(n, this.IsReadonly.value))
        }
    }

    /** 获取“权限模型”集合 */
    readonly GetModels = (): AuthorityModel[] => {
        const models: AuthorityModel[] = []

        this._tree.NodeArray.value.forEach(node => {
            if (!node.IsChecked.value) return

            const model = new AuthorityModel()
            model.path = node.Path.value

            if (node._data === undefined) {
                console.warn('The _data is undefined!')
                return
            }
            model.isReadonly = node._data

            models.push(model)
        })

        return models
    }

    /** 获取“权限模型”集合 */
    readonly SaveModels = async (): Promise<MyActionResult> => {
        const models = this.GetModels()
        return await AxiosHelper.Add(AuthorityHelper._action, models, true)
    }

    /** 加载 */
    readonly Update = async (role: number) => {
        const filter = new FilterModel('role', [role])
        const arr = await AxiosHelper.Where(AuthorityHelper._action, [filter])
        console.log(arr)
    }
    //#endregion 【Functions】
}

/** “权限助手”实例 */
export const authorityHelper = new AuthorityHelper()
