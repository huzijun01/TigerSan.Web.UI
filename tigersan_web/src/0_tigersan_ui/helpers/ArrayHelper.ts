/** 删除元素 */
function DeleteItem<T>(arr: T[], item: T) {
    const index = arr.findIndex(i => i === item);
    if (index !== -1) {
        arr.splice(index, 1)
    }
}

/** 获取首个元素 */
function GetFirstItem<T>(arr: T[]): T | undefined {
    if (arr.length < 1) return undefined
    return arr[0]
}

export {
    DeleteItem,
    GetFirstItem,
}