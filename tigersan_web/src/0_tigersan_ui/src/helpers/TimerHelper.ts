export class TimerHelper {
    //#region 【Fields】
    private _id?: number
    _handler: TimerHandler
    _timeout: number
    //#endregion 【Fields】

    //#region 【Properties】
    get IsStarted() { return this._id != undefined }
    get IsStoped() { return this._id === undefined }
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(handler: TimerHandler, timeout: number) {
        this._handler = handler
        this._timeout = timeout
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    readonly Start = () => {
        this.Stop()
        this._id = setInterval(this._handler, this._timeout)
    }

    readonly Stop = () => {
        if (this._id === undefined) return
        clearInterval(this._id)
        this._id = undefined
    }
    //#endregion 【Functions】
}