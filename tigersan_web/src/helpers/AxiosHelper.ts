
import { api } from "./AxiosApi"
import { dialog } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, MyActionResult } from "@/models"
import { KeyValue, ParamHelper } from "./ParamHelper"

export class FilterModel<TValue> {
    field = ''
    values: TValue[] = []

    constructor(field: string = '', values: TValue[] = []) {
        this.field = field
        this.values = values
    }
}

export class AxiosHelper {
    // 基础:
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

    static async Post(action: string, data: unknown, params?: KeyValue[]): Promise<MyActionResult> {
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

    static async Put<T>(action: string, data: T, params?: KeyValue[]): Promise<MyActionResult> {
        try {
            let url = action
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

    static async Delete(action: string, index: number | bigint, params?: KeyValue[]): Promise<MyActionResult> {
        try {
            let url = `${action}/${index}`
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

    // 列表:
    static async GetCount(action: string, params?: KeyValue[]): Promise<number> {
        try {
            let url = `${action}/Count`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const actionResult = await this.Get(url)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return 0
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                dialog.ShowWarning('GetCount: The data is undefined!')
                return 0
            }

            return actionResult.data as number
        } catch (error) {
            console.error(error)
            return 0
        }
    }

    static async GetList<T>(
        action: string,
        pageSize?: number,
        pageNumber?: number,
        strList?: string,
        params?: KeyValue[]): Promise<T[]> {
        try {
            const arrParams: KeyValue[] = [
                { key: 'pageSize', value: pageSize },
                { key: 'pageNumber', value: pageNumber },
            ]
            if (params) arrParams.push(...params)

            const actionResult = await this.Get(`${action}/${strList ?? 'List'}`, arrParams)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return []
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                dialog.ShowWarning('GetList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    static async SelectIdName<T extends IdNameModel>(action: string, isDistinct?: boolean): Promise<T[]> {
        try {
            const params = isDistinct != undefined ? `?isDistinct=${isDistinct}` : ''
            const actionResult = await this.Get(`${action}/SelectIdName/${params}`)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return []
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                dialog.ShowWarning('GetList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    // static async Select<T>(action: string, field: string): Promise<T[]> {
    //     try {
    //         const actionResult = await this.Get(`${action}/Select/${field}}`)

    //         if (!MyActionResult.IsSuccess(actionResult)) {
    //             MyActionResult.ShowResult(actionResult)
    //             return []
    //         }
    //         else if (MyActionResult.IsSuccessNoData(actionResult)) {
    //             dialog.ShowWarning('GetList: The data is undefined!')
    //             return []
    //         }

    //         return actionResult.data as T[]
    //     } catch (error) {
    //         console.error(error)
    //         return []
    //     }
    // }

    // static async Where<T>(
    //     action: string,
    //     filters: FilterModel<any>[],
    //     pageSize?: number,
    //     pageNumber?: number): Promise<T[]> {
    //     try {
    //         const page = pageSize != undefined && pageNumber != undefined ? `?pageSize=${pageSize}&pageNumber=${pageNumber}` : ''
    //         const actionResult = await this.Post(`${action}/Where${page}`, filters)

    //         if (!MyActionResult.IsSuccess(actionResult)) {
    //             MyActionResult.ShowResult(actionResult)
    //             return []
    //         }
    //         else if (MyActionResult.IsSuccessNoData(actionResult)) {
    //             dialog.ShowWarning('GetList: The data is undefined!')
    //             return []
    //         }

    //         return actionResult.data as T[]
    //     } catch (error) {
    //         console.error(error)
    //         return []
    //     }
    // }

    static async Add<T>(action: string, data: T, isRange: boolean = false): Promise<MyActionResult> {
        try {
            const range = isRange ? '/Range' : ''
            const response = await api.post(`${action}${range}`, data)
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