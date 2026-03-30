import { ref } from 'vue'
import { Colors, NavBarModel, NavButtonModel, NavFolderModel, TreeHelper, TreeModel, TreeNodeConfig, TreeNodeModel } from "@/0_tigersan_ui/tigerui"

/** “权限”模型 */
export class AuthorityModel {
    readonly id?: number = undefined
    role: number = 0
    path = ''
    isReadonly = false
}

export class IsReadonlyNavItem {
    item: NavFolderModel | NavButtonModel
    isReadonly: boolean
    constructor(item: NavFolderModel | NavButtonModel, isReadonly: boolean = false) {
        this.item = item
        this.isReadonly = isReadonly
    }
}

/** “权限助手”模型 */
export class AuthorityHelper {
    //#region 【Fields】
    static readonly _action = 'Authority'
    /** “权限”树模型 */
    readonly _tree = new TreeModel<IsReadonlyNavItem>()
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“只读” */
    readonly IsReadonly = ref(false)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        this._tree._onInit = node => {
            if (node._data === undefined) {
                console.warn('The _data is undefined!')
                return
            }
            if (node._data.isReadonly) {
                node.Color.value = Colors.Warning
            }
        }
        this._tree._onActive = node => {
            if (node._data === undefined) {
                console.warn('The _data is undefined!')
                return
            }
            this.IsReadonly.value = node._data.isReadonly
        }
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [private]
    /** 设置“是否只读” */
    private readonly SetIsReadonly = (node: TreeNodeModel<IsReadonlyNavItem>, isReadonly: boolean) => {
        if (node._data === undefined) {
            console.warn('The _data is undefined!')
            return
        }
        node._data.isReadonly = this.IsReadonly.value
        node.Color.value = isReadonly ? Colors.Warning : ''
    }
    //#endregion [private]

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
            model.isReadonly = node._data.isReadonly

            models.push(model)
        })

        return models
    }

    /** 初始化 */
    readonly Init = (authorities?: AuthorityModel[]) => {
        this._tree.Init(undefined, undefined, true)

        if (authorities) {
            this._tree.NodeArray.value.forEach(node => {
                const authority = authorities.find(a => node.Path.value === a.path)
                node.IsChecked.value = authority != undefined
                if (authority) {
                    if (!node._data) {
                        console.warn('The _data is undefined!')
                        return
                    }
                    node._data.isReadonly = authority.isReadonly
                }
            })
        }

        this._tree.UpdateState()
    }

    /** “导航栏”转“树配置” */
    static Nav2Tree(folder: NavFolderModel): TreeNodeConfig<IsReadonlyNavItem>[] {
        let arr: IsReadonlyNavItem[] = []
        arr.push(new IsReadonlyNavItem(folder))
        NavFolderModel.RecursivelyOperateSubItems(folder, f => arr.push(new IsReadonlyNavItem(f)), b => arr.push(new IsReadonlyNavItem(b)),)

        return TreeHelper.Array2Tree<IsReadonlyNavItem>(
            arr,
            item => item.item.Title.value,
            item => item.item._id,
            item => item.item.ParentFolderModel?._id)
    }

    /** 添加“导航栏”到“树配置” */
    AddNav2Tree(nav: NavBarModel, rootName: string) {
        var configs = AuthorityHelper.Nav2Tree(nav.FolderModel)
        const first = configs[0]
        if (!first) {
            console.warn('There are no items in the configs!')
            return
        }
        first.Text = rootName
        this._tree._configs.push(...configs)
    }
    //#endregion 【Functions】
}

/** “权限助手”实例 */
export const authorityHelper = new AuthorityHelper()
