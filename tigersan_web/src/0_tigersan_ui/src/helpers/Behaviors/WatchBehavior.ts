import { watch, type WatchSource, type WatchCallback, type WatchHandle } from "vue"

export class WatchBehavior<TSource> {
    //#region 【Fields】
    private _watch?: WatchHandle
    private _source: WatchSource<TSource>
    private _callback: WatchCallback<TSource>
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor(source: WatchSource<TSource>, callback: WatchCallback<TSource>) {
        this._source = source
        this._callback = callback
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Start = () => {
        this._watch?.stop()
        this._watch = watch(this._source, this._callback)
    }

    readonly Stop = () => {
        this._watch?.stop()
        this._watch = undefined
    }
    //#endregion 【Functions】
}