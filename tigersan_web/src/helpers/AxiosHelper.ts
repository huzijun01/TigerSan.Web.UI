import axios from "axios"
import { MyActionResult } from "@/models"
import { dialog } from "@/0_tigersan_ui/tigerui"

export class AxiosHelper {
    static url = "https://localhost:8888"

    static async Get(action: string): Promise<MyActionResult> {
        const response = await axios.get(`${this.url}/${action}`)
        const actionResult = response.data as MyActionResult
        if (actionResult === undefined) {
            dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
            return MyActionResult.ActionResult_Undefined
        }
        return actionResult
    }

    static async GetCount(action: string): Promise<number> {
        const actionResult = await this.Get(`${action}/Count`)
        if (actionResult.data === undefined) {
            dialog.ShowWarning('GetCount: The data is undefined!')
            return 0
        }
        return actionResult.data as number
    }

    static async GetList<T>(
        action: string,
        pageSize: number,
        pageNumber: number): Promise<T[]> {
        const actionResult = await this.Get(`${action}/${pageSize}/${pageNumber}`)
        if (actionResult.data === undefined) {
            dialog.ShowWarning('GetList: The data is undefined!')
            return []
        }
        return actionResult.data as T[]
    }

    static async GetAllList<T>(action: string): Promise<T[]> {
        const actionResult = await this.Get(action)
        if (actionResult.data === undefined) {
            dialog.ShowWarning('GetAllList: The data is undefined!')
            return []
        }
        return actionResult.data as T[]
    }

    static async Post<T>(action: string, data: T): Promise<MyActionResult> {
        const response = await axios.post(`${this.url}/${action}`, data)
        const actionResult = response.data as MyActionResult
        if (actionResult === undefined) {
            dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
            return MyActionResult.ActionResult_Undefined
        }
        return actionResult
    }

    static async Put<T>(action: string, data: T): Promise<MyActionResult> {
        const response = await axios.put(`${this.url}/${action}`, data)
        const actionResult = response.data as MyActionResult
        if (actionResult === undefined) {
            dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
            return MyActionResult.ActionResult_Undefined
        }
        return actionResult
    }

    static async Delete<T>(action: string, index: number): Promise<MyActionResult> {
        const response = await axios.delete(`${this.url}/${action}/${index}`)
        const actionResult = response.data as MyActionResult
        if (actionResult === undefined) {
            dialog.ShowWarning(MyActionResult.ActionResult_Undefined.message)
            return MyActionResult.ActionResult_Undefined
        }
        return actionResult
    }
}