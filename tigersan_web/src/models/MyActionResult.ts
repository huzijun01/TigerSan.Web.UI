import { dialog, FormResult, SubmitResult } from "@/0_tigersan_ui/tigerui"

export enum ActionResultCode {
    Success = 0,
    Warning = 1,
    Error = 2,
}

export class MyActionResult {
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

    static ShowResult(res: MyActionResult, success: string = '操作成功') {
        if (res.code === ActionResultCode.Error) {
            dialog.ShowError(res.message)
        } else if (res.code === ActionResultCode.Warning) {
            dialog.ShowWarning(res.message)
        } else {
            dialog.ShowSuccess(success)
        }
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