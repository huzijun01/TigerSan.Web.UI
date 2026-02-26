export class ArrayHelper {
    /** 删除元素 */
    static Set<T>(src: T[], dest: T[]) {
        src.splice(0)
        src.push(...dest)
    }

    /** 删除元素 */
    static DeleteItem<T>(arr: T[], item: T) {
        const index = arr.findIndex(i => i === item);
        if (index !== -1) {
            arr.splice(index, 1)
        }
    }

    /** 获取首个元素 */
    static GetFirstItem<T>(arr: T[]): T | undefined {
        if (arr.length < 1) return undefined
        return arr[0]
    }
}