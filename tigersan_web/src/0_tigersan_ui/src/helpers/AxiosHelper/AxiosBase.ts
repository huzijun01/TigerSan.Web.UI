import { api } from "./AxiosApi"
import { dialog } from "../../stores"
import { KeyValue, ParamHelper } from "../ParamHelper"
import { MyActionResult } from "../../models/MyActionResult"

export class AxiosBase {
    static async Get(action: string, params?: KeyValue[]): Promise<MyActionResult> {
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await api.get(url)
            const actionResult = response.data as MyActionResult

            if (actionResult === undefined) {
                dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }

    static async GetData<T extends object | unknown[] | number>(action: string, params?: KeyValue[]): Promise<T> {
        return (await this.Get(action, params)).data as T
    }

    static async Post(action: string, params?: KeyValue[], data?: unknown): Promise<MyActionResult> {
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await api.post(url, data)
            const actionResult = response.data as MyActionResult

            if (actionResult === undefined) {
                dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }

    static async Put<T>(action: string, data: T, params?: KeyValue[], isRange: boolean = false): Promise<MyActionResult> {
        try {
            const range = isRange ? '/Range' : ''

            let url = `${action}${range}`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await api.put(url, data)
            const actionResult = response.data as MyActionResult

            if (actionResult === undefined) {
                dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }
            else if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }

    static async Delete(action: string, id: number | bigint, params?: KeyValue[]): Promise<MyActionResult> {
        try {
            let url = `${action}/${id}`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await api.delete(url)
            const actionResult = response.data as MyActionResult

            if (actionResult === undefined) {
                dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }
            else if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }

    static async DeleteRange(action: string, ids: number[] | bigint[], params?: KeyValue[]): Promise<MyActionResult> {
        try {
            let url = `${action}/Range`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await api.delete(url, { data: ids })
            const actionResult = response.data as MyActionResult

            if (actionResult === undefined) {
                dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }
            else if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }
}