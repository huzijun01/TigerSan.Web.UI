import { DialogHelper } from "../stores"
import { FormResult, SubmitResult } from "./Form/FormModel"

export enum ActionResultCode {
    Success = 0,
    Warning = 1,
    Error = 2,
    InvalidToken = 3,
    InvalidCaptcha = 4,
}

export class MyActionResult<TData> {
    static _logout?: Function
    static ActionResult_Undefined = new MyActionResult<any>(ActionResultCode.Error, 'The actionResult is undefined!')

    code: ActionResultCode
    message = ''
    data?: TData

    constructor(
        code: ActionResultCode,
        message = '',
        data?: TData) {
        this.code = code
        this.message = message
        this.data = data
    }

    static GetError(msg: any) {
        return new MyActionResult<any>(ActionResultCode.Error, msg)
    }

    static ShowResult(res: MyActionResult<any>, success: string = '操作成功', isShowSuccess = true) {
        if (res.code === ActionResultCode.Error) {
            DialogHelper.ShowError(res.message)
        } else if (res.code === ActionResultCode.InvalidCaptcha) {
            return
        } else if (res.code === ActionResultCode.InvalidToken) {
            MyActionResult._logout?.()
            DialogHelper.ShowError(res.message)
        } else if (res.code === ActionResultCode.Warning) {
            DialogHelper.ShowWarning(res.message)
        } else if (isShowSuccess) {
            DialogHelper.ShowSuccess(success)
        }
    }

    static IsSuccess(res: MyActionResult<any>): boolean {
        return res.code == ActionResultCode.Success
    }

    static IsSuccessNoData(res: MyActionResult<any>): boolean {
        return res.code == ActionResultCode.Success && res.data === undefined
    }
}

export function GetSubmitResult(res: MyActionResult<any>, success?: string): SubmitResult {
    switch (res.code) {
        case ActionResultCode.Error:
            return new SubmitResult(res.message, FormResult.Error)
        case ActionResultCode.Warning:
            return new SubmitResult(res.message, FormResult.Warning)
        default:
            return new SubmitResult(success ?? res.message)
    }
}