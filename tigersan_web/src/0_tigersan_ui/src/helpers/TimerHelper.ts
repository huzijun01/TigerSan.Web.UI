export class TimerHelper {
    //#region 【Fields】
    /** 定时器ID */
    private _id?: number
    /** 执行方法 */
    _handler: TimerHandler
    /** 间隔时间 */
    _timeout: number
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否“开始” */
    get IsStarted() { return this._id != undefined }
    /** 是否“停止” */
    get IsStoped() { return this._id === undefined }
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor(handler: TimerHandler, timeout: number) {
        this._handler = handler
        this._timeout = timeout
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 开始 */
    readonly Start = () => {
        this.Stop()
        this._id = setInterval(this._handler, this._timeout)
    }

    /** 停止 */
    readonly Stop = () => {
        if (this._id === undefined) return
        clearInterval(this._id)
        this._id = undefined
    }

    /** 设置 */
    readonly Set = (isStart: boolean) => {
        if (isStart) {
            this.Start()
        } else {
            this.Stop()
        }
    }
    //#endregion 【Functions】
}