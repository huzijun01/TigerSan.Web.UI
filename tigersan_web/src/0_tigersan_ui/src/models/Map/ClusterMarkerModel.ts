export class ClusterMarkerModel<TData> {
    readonly count: number = 0
    readonly totalCount: number = 0
    readonly data?: TData
    onClick?: (data: any) => void
    readonly offset: number = 0
    readonly size: number = 0

    constructor(opts?: ClusterMarkerModelOptions<TData>) {
        if (!opts) return
        if (opts.count != undefined) this.count = opts.count
        if (opts.totalCount != undefined) this.totalCount = opts.totalCount
        if (opts.data != undefined) this.data = opts.data
        this.size = Math.round(30 + Math.pow(this.totalCount / this.count, 1 / 5) * 20)
        this.offset = -this.size / 2
    }
}

export type ClusterMarkerModelOptions<TData> = {
    count?: number
    totalCount?: number
    data?: TData
    onClick?: (data: any) => void
}