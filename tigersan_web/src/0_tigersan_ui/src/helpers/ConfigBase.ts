export class ConfigBase<T extends object> {
    //#region 【Fields】
    /** 键 */
    readonly key: string
    /** 值 */
    private value: T
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor(key: string, value: T) {
        this.key = key
        this.value = value
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 安全解析 */
    static SafeParse<T>(str: string): T {
        const parsed = JSON.parse(str);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid JSON structure')
        }

        return parsed as T;
    }

    /** 获取 */
    Get(): T {
        const str = localStorage.getItem(this.key)
        if (str === null) {
            this.Save()
            return this.Get()
        }

        try {
            this.value = ConfigBase.SafeParse<T>(str)
            return this.value
        } catch (error) {
            console.error(error)
            this.Save()
            return this.Get()
        }
    }

    /** 保存 */
    Save() {
        localStorage.setItem(this.key, JSON.stringify(this.value))
    }
    //#endregion 【Functions】
}