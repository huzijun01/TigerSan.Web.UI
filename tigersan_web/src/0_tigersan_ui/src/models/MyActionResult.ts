import { DialogHelper } from "../stores"
import { ToastHelper } from './Dialog/ToastHelper'
import { FormResult, SubmitResult } from "./Form/FormModel"

export enum ActionResultCode {
    Success = 0,
    Warning = 1,
    Error = 2,
    InvalidToken = 3,
    InvalidCaptcha = 4,
}

export class MyActionResult<TData> {
    static readonly ActionResult_Undefined = new MyActionResult<any>(ActionResultCode.Error, 'The actionResult is undefined!')
    /** 是否使用“Toast” */
    static _isUseToast = true
    /** “登出”方法 */
    static _logout?: Function

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
            DialogHelper.Error(res.message)
        } else if (res.code === ActionResultCode.InvalidCaptcha) {
            return
        } else if (res.code === ActionResultCode.InvalidToken) {
            MyActionResult._logout?.()
            DialogHelper.Error(res.message)
        } else if (res.code === ActionResultCode.Warning) {
            DialogHelper.Warning(res.message)
        } else if (isShowSuccess) {
            if (this._isUseToast) ToastHelper.Success(success)
            else DialogHelper.Success(success)
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