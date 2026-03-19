import axios from "axios"
import { MyActionResult } from "@/models"
import { dialog } from "@/0_tigersan_ui/tigerui"

export class FilterModel<TValue> {
    field = ''
    values: TValue[] = []

    constructor(field: string = '', values: TValue[] = []) {
        this.field = field
        this.values = values
    }
}

export class AxiosHelper {
    static url = "https://localhost:8888"

    // 基础:
    static async Get(action: string): Promise<MyActionResult> {
        try {
            const response = await axios.get(`${this.url}/${action}`)
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

    static async Post(action: string, data: unknown): Promise<MyActionResult> {
        try {
            const response = await axios.post(`${this.url}/${action}`, data)
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

    static async Put<T>(action: string, data: T): Promise<MyActionResult> {
        try {
            const response = await axios.put(`${this.url}/${action}`, data)
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

    static async Delete(action: string, index: number): Promise<MyActionResult> {
        try {
            const response = await axios.delete(`${this.url}/${action}/${index}`)
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
    static async GetCount(action: string): Promise<number> {
        try {
            const actionResult = await this.Get(`${action}/Count`)

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

    static async GetAllList<T>(action: string): Promise<T[]> {
        try {
            const actionResult = await this.Get(action)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return []
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                dialog.ShowWarning('GetAllList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    static async GetList<T>(
        action: string,
        pageSize: number,
        pageNumber: number): Promise<T[]> {
        try {
            const actionResult = await this.Get(`${action}/${pageSize}/${pageNumber}`)

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

    static async Select<T>(action: string, field: string): Promise<T[]> {
        try {
            const actionResult = await this.Get(`${action}/Select/${field}}`)

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

    static async Where<T>(
        action: string,
        filters: FilterModel<any>[],
        pageSize?: number,
        pageNumber?: number): Promise<T[]> {
        try {
            const page = pageSize != undefined && pageNumber != undefined ? `/${pageSize}/${pageNumber}` : ''
            const actionResult = await this.Post(`${action}/Where${page}`, filters)

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

    static async Add<T>(action: string, data: T, isRange: boolean = false): Promise<MyActionResult> {
        try {
            const range = isRange ? '/Range' : ''
            const response = await axios.post(`${this.url}/${action}${range}`, data)
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