import { dialog } from "../stores"
import { FormResult, SubmitResult } from "./Form/FormModel"

export enum ActionResultCode {
    Success = 0,
    Warning = 1,
    Error = 2,
    InvalidToken = 3,
}

export class MyActionResult {
    static _logout?: Function
    static ActionResult_Undefined = new MyActionResult(ActionResultCode.Error, 'The actionResult is undefined!')

    code: ActionResultCode
    message = ''
    data?: object | unknown[] | number

    constructor(
        code: ActionResultCode,
        message = '',
        data?: object | unknown[] | number) {
        this.code = code
        this.message = message
        this.data = data
    }

    static GetError(msg: any) {
        return new MyActionResult(ActionResultCode.Error, msg)
    }

    static ShowResult(res: MyActionResult, success: string = '操作成功') {
        if (res.code === ActionResultCode.Error) {
            dialog.ShowError(res.message)
        } else if (res.code === ActionResultCode.InvalidToken) {
            MyActionResult._logout?.()
            dialog.ShowError(res.message)
        } else if (res.code === ActionResultCode.Warning) {
            dialog.ShowWarning(res.message)
        } else {
            dialog.ShowSuccess(success)
        }
    }

    static IsSuccess(res: MyActionResult): boolean {
        return res.code == ActionResultCode.Success
    }

    static IsSuccessNoData(res: MyActionResult): boolean {
        return res.code == ActionResultCode.Success && res.data === undefined
    }
}

export function GetSubmitResult(res: MyActionResult, success?: string): SubmitResult {
    switch (res.code) {
        case ActionResultCode.Error:
            return new SubmitResult(res.message, FormResult.Error)
        case ActionResultCode.Warning:
            return new SubmitResult(res.message, FormResult.Warning)
        default:
            return new SubmitResult(success ?? res.message)
    }
}