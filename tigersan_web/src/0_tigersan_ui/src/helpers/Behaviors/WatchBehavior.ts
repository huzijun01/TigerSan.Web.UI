import { watch, type WatchSource, type WatchCallback, type WatchHandle, unref } from "vue"

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

    readonly Do = () => {
        let currentValue: TSource

        if (typeof this._source === 'function') {
            currentValue = (this._source as any)()
        } else {
            currentValue = unref(this._source as any)
        }

        this._callback(currentValue, undefined as any, () => { })
    }
    //#endregion 【Functions】
}