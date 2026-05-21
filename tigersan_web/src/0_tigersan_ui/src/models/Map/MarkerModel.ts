import { type Component } from "vue"

export class MarkerModel<TData> {
    static readonly size: number = 18
    static readonly offset: number = -this.size / 2
    /** 数据 */
    data?: TData
    /** “信息”组件 */
    info?: Component
    /** “信息”模型 */
    infoModel?: any
    /** 点击时 */
    onClick?: (data: any) => void

    constructor(opts?: MarkerModelOptions<TData>) {
        if (!opts) return
        this.data = opts.data
        this.info = opts.info
        this.infoModel = opts.infoModel
        this.onClick = opts.onClick
    }
}

export type MarkerModelOptions<TData> = {
    /** 数据 */
    data?: TData
    /** “信息”组件 */
    info?: Component
    /** “信息”模型 */
    infoModel?: any
    /** 点击时 */
    onClick?: (data: any) => void
}