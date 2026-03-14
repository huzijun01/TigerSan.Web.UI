import { TreeNodeConfig } from "../models"
import { ArrayHelper } from "./ArrayHelper"

export class TreeHelper {
    /** “项目数组”转“树配置” */
    static Array2Tree<T extends object>(
        items: T[],
        getName: (item: T) => string,
        getParent: (item: T) => string | undefined): TreeNodeConfig<T>[] {

        /** 获取“节点” */
        function GetNode(item: T): TreeNodeConfig<T> {
            const node = new TreeNodeConfig<T>()
            node._data = item
            node.Text = getName(item)
            return node
        }

        /** “节点”数组 */
        const nodes: TreeNodeConfig<T>[] = []
        /** “节点”数组（无嵌套） */
        const nodeArray: TreeNodeConfig<T>[] = []

        /** “根项目”数组 */
        let rootItems = items.filter(i => !getParent(i))
        /** “剩余项目”数组 */
        const remainingItems = items.filter(i => getParent(i))
        /** “新根项目”数组 */
        const newRootItems: T[] = []

        // 添加“根项目”:
        rootItems.forEach(rootItem => {
            /** 根节点 */
            const rootNode = GetNode(rootItem)
            rootNode.Childs = []
            nodes.push(rootNode)
            nodeArray.push(rootNode)
        })

        // 添加“后代项目”:
        while (rootItems.length > 0) {
            newRootItems.splice(0)

            // 添加“根项目”:
            rootItems.forEach(rootItem => {
                /** 根节点 */
                const rootNode = nodeArray.find(n => n.Text === getName(rootItem))
                if (!rootNode) {
                    console.warn('The rootNode is undefined!')
                    return
                }

                /** “孙项目”数组 */
                const subItems = remainingItems.filter(i => getParent(i) === getName(rootItem))
                newRootItems.push(...subItems)

                // 添加“根节点”:
                subItems.forEach(subItem => {
                    // 添加“孙节点”:
                    const subNode = GetNode(subItem)
                    if (!rootNode.Childs) {
                        rootNode.Childs = []
                    }
                    rootNode.Childs.push(subNode)
                    nodeArray.push(subNode)

                    // 删除“孙项目”:
                    ArrayHelper.DeleteItem(remainingItems, subItem)
                })
            })

            rootItems.splice(0)
            rootItems.push(...newRootItems)
        }

        if (remainingItems.length > 0) {
            console.warn('There are unused items!')
        }

        return nodes
    }
}