export class ArrayHelper {
    /** 修改源数据 */
    static Set<T>(src: T[], dest: T[]) {
        src.splice(0)
        src.push(...dest)
    }

    /** 删除元素 */
    static Delete<T>(arr: T[], item: T) {
        const index = arr.findIndex(i => i === item)
        if (index != -1) {
            arr.splice(index, 1)
        }
    }

    /** 获取“首个元素” */
    static GetFirst<T>(arr: T[]): T | undefined {
        if (arr.length < 1) return undefined
        return arr[0]
    }

    /** 过滤元素（修改源数据） */
    static Filter<T>(arr: T[], fn: (item: T) => boolean) {
        const filter = arr.filter(fn)
        arr.splice(0)
        arr.push(...filter)
    }
}