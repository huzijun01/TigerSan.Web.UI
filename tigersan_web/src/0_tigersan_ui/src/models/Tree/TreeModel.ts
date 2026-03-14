import { nanoid } from "nanoid"
import { computed, ref, shallowReactive } from "vue"
import type { AnyFunc } from "../../types"
import { ContentSizeBehavior } from "../../helpers"

type TreeNodeModelFunc<T> = (node: TreeNodeModel<T>) => void

/** “树节点”模型 */
class TreeNodeModel<T> extends ContentSizeBehavior {
    //#region 【Fields】
    /** 是否“自动更新”选中状态 */
    private _isAutoUpdate = true
    /** ID */
    readonly _id = nanoid()
    /** 所属树 */
    _tree: TreeModel<T>
    /** 数据 */
    _data?: T
    /** 父项 */
    _parent?: TreeNodeModel<T>
    /** 激活后 */
    _onActive?: AnyFunc
    /** 选中后 */
    _onChecked?: AnyFunc
    //#endregion 【Fields】

    //#region 【Properties】
    /** 文本 */
    readonly Text = ref('null')
    /** 是否“选中” */
    readonly IsChecked = ref(false)
    /** “子项”集合 */
    readonly Childs = shallowReactive<TreeNodeModel<T>[]>([])

    //#region [computed]
    /** 是否“激活” */
    readonly IsActive = computed(() => {
        return this._tree.ActiveNode.value?._id === this._id
    })

    /** 根类 */
    readonly rootClass = computed(() => {
        return {
            open: this.IsOpen.value,
            active: this.IsActive.value,
            checked: this.IsChecked.value,
        }
    })

    /** 是否“有子项” */
    readonly IsHaveChild = computed(() => {
        return this.Childs.length > 0
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(
        tree: TreeModel<T>,
        data?: T,
        parent?: TreeNodeModel<T>,
        childs?: TreeNodeModel<T>[]) {
        super()
        this._tree = tree
        this._data = data
        this._parent = parent
        if (childs) this.Childs.push(...childs)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [static]
    /** 遍历集合 */
    static readonly TraverseRange = (nodes: TreeNodeModel<unknown>[], callback: TreeNodeModelFunc<unknown>) => {
        nodes.forEach(node => node.Traverse(callback))
    }

    /** 获取数组（无嵌套） */
    static readonly GetArrayRange = (nodes: TreeNodeModel<unknown>[]) => {
        const arr: TreeNodeModel<unknown>[] = []
        nodes.forEach(node => {
            arr.push(...node.GetArray())
        })
        return arr
    }
    //#endregion [static]

    //#region [private]
    /** 更新“祖先节点”选中状态 */
    private readonly UpdateParentNodesIsChecked = () => {
        if (!this._isAutoUpdate) return

        this._isAutoUpdate = false

        this.UpTraverse(node => {
            if (this._id === node._id) return
            node.IsChecked.value = node.Childs.every(n => n.IsChecked.value)
        })

        this._isAutoUpdate = true
    }

    /** 更新“后代节点”选中状态 */
    private readonly UpdateSubNodesIsChecked = () => {
        if (!this._isAutoUpdate) return

        this._isAutoUpdate = false

        this.Traverse(node => {
            if (this._id === node._id) return
            node.IsChecked.value = this.IsChecked.value
        })

        this._isAutoUpdate = true
    }
    //#endregion [private]

    /** 遍历 */
    readonly Traverse = (callback: TreeNodeModelFunc<T>) => {
        callback(this)

        if (this.Childs) {
            this.Childs.forEach(child => child.Traverse(callback))
        }
    }

    /** 向上遍历 */
    readonly UpTraverse = (callback: TreeNodeModelFunc<T>) => {
        callback(this)

        if (this._parent) {
            this._parent.UpTraverse(callback)
        }
    }

    /** 获取数组（无嵌套） */
    readonly GetArray = (): TreeNodeModel<T>[] => {
        const arr: TreeNodeModel<T>[] = []
        this.Traverse(node => { arr.push(node) })
        return arr
    }

    /** 点击后 */
    readonly OnClick = () => {
        this._tree.OnClickInternal(this)
    }

    /** 点击箭头后 */
    readonly OnClickArrow = () => {
        if (this.IsHaveChild.value) {
            this.IsOpen.value = !this.IsOpen.value
        }
    }

    /** 改变后 */
    readonly OnChange = () => {
        if (this.IsChecked.value) {
            this._onChecked?.(this._data)
        }

        this.UpdateParentNodesIsChecked()
        this.UpdateSubNodesIsChecked()
    }
    //#endregion 【Functions】
}

/** “树节点”配置 */
class TreeNodeConfig<T> {
    // Fields:
    /** 数据 */
    _data?: T
    /** 激活后 */
    _onActive?: AnyFunc
    /** 选中后 */
    _onChecked?: AnyFunc

    // Properties:
    /** 文本 */
    Text?: string
    /** 是否“激活” */
    IsActive?: boolean
    /** 是否“选中” */
    IsChecked?: boolean
    /** “子项”集合 */
    Childs?: TreeNodeConfig<T>[]
}

/** “树”模型 */
class TreeModel<T> {
    //#region 【Properties】
    /** 是否“显示复选框” */
    readonly IsShowCheckbox = ref(true)
    /** 被激活的节点 */
    readonly ActiveNode = ref<TreeNodeModel<T> | undefined>()
    /** “节点”集合 */
    readonly Nodes = shallowReactive<TreeNodeModel<T>[]>([])

    //#region [computed]
    /** 是否“已激活” */
    readonly IsActive = computed(() => this.ActiveNode.value != undefined)
    /** “节点”数组（无嵌套） */
    readonly NodeArray = computed(() => TreeNodeModel.GetArrayRange(this.Nodes))
    /** “选中节点”数组（无嵌套） */
    readonly CheckedNodeArray = computed(() => this.NodeArray.value.filter(n => n.IsChecked.value))
    /** “激活节点”的数据 */
    readonly ActiveData = computed(() => {
        if (!this.ActiveNode.value) return
        return this.ActiveNode.value._data
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(configs?: TreeNodeConfig<T>[]) {
        this.Init(configs)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 点击后（内部方法） */
    readonly OnClickInternal = (node: TreeNodeModel<T>) => {
        if (node.IsActive.value) {
            this.ActiveNode.value = undefined
        } else {
            this.ActiveNode.value = node
            node._onActive?.(node._data)
        }
    }

    /** 初始化 */
    readonly Init = (configs?: TreeNodeConfig<T>[]) => {
        this.Nodes.splice(0)
        this.ActiveNode.value = undefined

        if (!configs) return

        configs.forEach(config => {
            const node = GetNodeModel(this, config)
            this.Nodes.push(node)
        })
    }

    /** 获取“文本”集合 */
    GetTexts(): string[] {
        return this.NodeArray.value.map(n => n.Text.value)
    }

    /** 获取“数据”集合 */
    GetDatas(): T[] {
        return this.NodeArray.value.map(n => (n._data as T))
    }
    //#endregion 【Functions】
}

/** 获取“节点模型” */
function GetNodeModel<T>(tree: TreeModel<T>, config: TreeNodeConfig<T>, parent?: TreeNodeModel<T>): TreeNodeModel<T> {
    const node = new TreeNodeModel<T>(tree, config._data, parent)
    InitNodeModel(config, node)

    if (config.Childs) {
        config.Childs.forEach(childConfig => {
            node.Childs.push(GetNodeModel(tree, childConfig, node))
        })
    }

    return node
}

/** 初始化“节点模型” */
function InitNodeModel<T>(config: TreeNodeConfig<T>, node: TreeNodeModel<T>) {
    // Fields:
    if (config._data != undefined) node._data = config._data
    if (config._onActive != undefined) node._onActive = config._onActive
    if (config._onChecked != undefined) node._onChecked = config._onChecked

    // Properties:
    if (config.Text != undefined) node.Text.value = config.Text
    if (config.IsChecked != undefined) node.IsChecked.value = config.IsChecked
}

export {
    type TreeNodeModelFunc,
    TreeNodeModel,
    TreeNodeConfig,
    TreeModel,
}