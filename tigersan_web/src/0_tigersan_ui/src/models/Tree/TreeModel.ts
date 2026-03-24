import { nanoid } from "nanoid"
import { computed, ref, shallowRef, shallowReactive } from "vue"
import { ContentSizeBehavior } from "../../helpers"

type TreeNodeModelFunc<TData> = (node: TreeNodeModel<TData>) => void

/** “树节点”模型 */
class TreeNodeModel<TData> extends ContentSizeBehavior {
    //#region 【Fields】
    /** 是否“自动更新”选中状态 */
    private _isAutoUpdate = true
    /** ID */
    readonly _id = nanoid()
    /** 分隔符 */
    _separator = '>'
    /** 所属树 */
    _tree: TreeModel<TData>
    /** 数据 */
    _data?: TData
    /** 父项 */
    _parent?: TreeNodeModel<TData>
    /** 配置（内部维护） */
    _config?: TreeNodeConfig<TData>
    /** 激活后 */
    _onActive?: TreeNodeModelFunc<TData>
    /** 失活后 */
    _onUnactive?: TreeNodeModelFunc<TData>
    /** 选中后 */
    _onChecked?: TreeNodeModelFunc<TData>
    //#endregion 【Fields】

    //#region 【Properties】
    /** 文本 */
    readonly Text = ref('null')
    /** 颜色 */
    readonly Color = ref('')
    /** 是否“选中” */
    readonly IsChecked = ref(false)
    /** “子项”集合 */
    readonly Childs = shallowReactive<TreeNodeModel<TData>[]>([])

    //#region [computed]
    /** 是否“激活” */
    readonly IsActive = computed(() => {
        return this._tree.ActiveNode.value?._id === this._id
    })

    /** 路径 */
    readonly Path = computed(() => {
        this._tree.NodeArray
        let path = ''

        this.UpTraverse(node => {
            path = path === '' ? node.Text.value : `${node.Text.value}${this._separator}${path}`
        })

        return path
    })

    /** 根类 */
    readonly RootClass = computed(() => {
        return {
            open: this.IsOpen.value,
            active: this.IsActive.value,
            checked: this.IsChecked.value,
        }
    })

    /** 颜色样式 */
    readonly ColorStyle = computed(() => {
        return {
            color: this.Color.value,
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
        tree: TreeModel<TData>,
        data?: TData,
        parent?: TreeNodeModel<TData>,
        childs?: TreeNodeModel<TData>[]) {
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
    static TraverseRange<T>(nodes: TreeNodeModel<T>[], callback: TreeNodeModelFunc<T>) {
        nodes.forEach(node => node.Traverse(callback))
    }

    /** 获取数组（无嵌套） */
    static GetArrayRange<T>(nodes: TreeNodeModel<T>[]) {
        const arr: TreeNodeModel<T>[] = []
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
    readonly Traverse = (callback: TreeNodeModelFunc<TData>) => {
        callback(this)

        if (this.Childs) {
            this.Childs.forEach(child => child.Traverse(callback))
        }
    }

    /** 向上遍历 */
    readonly UpTraverse = (callback: TreeNodeModelFunc<TData>) => {
        callback(this)

        if (this._parent) {
            this._parent.UpTraverse(callback)
        }
    }

    /** 获取数组（无嵌套） */
    readonly GetArray = (): TreeNodeModel<TData>[] => {
        const arr: TreeNodeModel<TData>[] = []
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
            this._onChecked?.(this)
            this._tree._onChecked?.(this)
        }

        this.UpdateParentNodesIsChecked()
        this.UpdateSubNodesIsChecked()
    }
    //#endregion 【Functions】
}

/** “树节点”配置 */
class TreeNodeConfig<TData> {
    // Fields:
    /** 数据 */
    _data?: TData
    /** 激活后 */
    _onActive?: TreeNodeModelFunc<TData>
    /** 选中后 */
    _onChecked?: TreeNodeModelFunc<TData>
    /** 失活后 */
    _onUnactive?: TreeNodeModelFunc<TData>

    // Properties:
    /** 文本 */
    Text?: string
    /** 颜色 */
    Color?: string
    /** 是否“激活” */
    IsActive?: boolean
    /** 是否“选中” */
    IsChecked?: boolean
    /** “子项”集合 */
    Childs?: TreeNodeConfig<TData>[]
}

/** “树”模型 */
class TreeModel<TData> {
    //#region 【Fields】
    /** “配置”集合 */
    private _configs?: TreeNodeConfig<TData>[]
    /** 默认“数据” */
    _defaultData?: TData
    /** 默认“选中状态” */
    _defaultIsChecked: boolean
    /** 初始化后 */
    _onInit?: TreeNodeModelFunc<TData>
    /** 激活后 */
    _onActive?: TreeNodeModelFunc<TData>
    /** 选中后 */
    _onChecked?: TreeNodeModelFunc<TData>
    /** 失活后 */
    _onUnactive?: TreeNodeModelFunc<TData>
    /** 初始化后 */
    _onInited?: Function
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“显示复选框” */
    readonly IsShowCheckbox = ref(true)
    /** 激活节点 */
    readonly ActiveNode = shallowRef<TreeNodeModel<TData> | undefined>()
    /** “节点”集合 */
    readonly Nodes = shallowReactive<TreeNodeModel<TData>[]>([])

    //#region [computed]
    /** 是否“已激活” */
    readonly IsActive = computed(() => this.ActiveNode.value != undefined)
    /** “节点”数组（无嵌套） */
    readonly NodeArray = computed(() => TreeNodeModel.GetArrayRange<TData>(this.Nodes))
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
    constructor(
        configs?: TreeNodeConfig<TData>[],
        defaultData?: TData,
        defaultIsChecked: boolean = false) {
        this._defaultData = defaultData
        this._defaultIsChecked = defaultIsChecked
        this.Init(configs)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 点击后（内部方法） */
    readonly OnClickInternal = (node: TreeNodeModel<TData>) => {
        if (node.IsActive.value) {
            this.ActiveNode.value = undefined
            this._onUnactive?.(node)
            node._onUnactive?.(node)
        } else {
            this.ActiveNode.value = node
            this._onActive?.(node)
            node._onActive?.(node)
        }
    }

    /** 初始化 */
    readonly Init = (configs?: TreeNodeConfig<TData>[]) => {
        if (configs) this._configs = configs

        try {
            this.Nodes.splice(0)
            this.ActiveNode.value = undefined

            if (!this._configs) return

            this._configs.forEach(config => {
                const node = GetNodeModel(this, config)
                this.Nodes.push(node)
            })

            this.NodeArray.value.forEach(node => {
                if (!(node._config && node._config._data != undefined)) {
                    node._data = this._defaultData
                }

                if (!(node._config && node._config.IsChecked != undefined)) {
                    node.IsChecked.value = this._defaultIsChecked
                }

                this._onInit?.(node)
            })
        } finally {
            this._onInited?.()
        }
    }

    /** 更新“状态” */
    readonly UpdateState = () => {
        this.NodeArray.value.forEach(node => {
            this._onInit?.(node)
        })
    }

    /** 设置“激活节点” */
    SetActiveNode(text: string) {
        const node = this.NodeArray.value.find(n => n.Text.value === text)
        if (!node) return
        this.ActiveNode.value = node
    }

    /** 获取“文本”集合 */
    GetTexts(): string[] {
        return this.NodeArray.value.map(n => n.Text.value)
    }

    /** 获取“数据”集合 */
    GetDatas(): TData[] {
        return this.NodeArray.value.map(n => (n._data as TData))
    }
    //#endregion 【Functions】
}

/** 获取“节点模型” */
function GetNodeModel<TData>(tree: TreeModel<TData>, config: TreeNodeConfig<TData>, parent?: TreeNodeModel<TData>): TreeNodeModel<TData> {
    const node = new TreeNodeModel<TData>(tree, config._data, parent)
    node._config = config
    InitNodeModel(config, node)

    if (config.Childs) {
        config.Childs.forEach(childConfig => {
            node.Childs.push(GetNodeModel(tree, childConfig, node))
        })
    }

    return node
}

/** 初始化“节点模型” */
function InitNodeModel<TData>(config: TreeNodeConfig<TData>, node: TreeNodeModel<TData>) {
    // Fields:
    if (config._data != undefined) node._data = config._data
    if (config._onActive != undefined) node._onActive = config._onActive
    if (config._onChecked != undefined) node._onChecked = config._onChecked
    if (config._onUnactive != undefined) node._onUnactive = config._onUnactive

    // Properties:
    if (config.Text != undefined) node.Text.value = config.Text
    if (config.Color != undefined) node.Color.value = config.Color
    if (config.IsChecked != undefined) node.IsChecked.value = config.IsChecked
}

export {
    type TreeNodeModelFunc,
    TreeNodeModel,
    TreeNodeConfig,
    TreeModel,
}