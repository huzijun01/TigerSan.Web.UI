import axios from "axios"
import JSONBig from 'json-bigint' // 导入JSONBig
import { dialog } from "@/0_tigersan_ui/tigerui"
import { IdNameModel, MyActionResult } from "@/models"

const api = axios.create({
    baseURL: 'https://localhost:8888',
    // TransformResponse:axios提供的工具，用在获取后端数据之后，先进行处理，再通过promise返回给axios调用者
    // transformResponse发生在axios 的响应拦截器之前。
    transformResponse: [function (data) {
        try {
            return JSONBig.parse(data) // 字符串--->对象
        } catch (err) {
            return data
        }
    }],
    responseType: 'text'
})

// 请求拦截器：发送前转换 BigInt -> 字符串
api.interceptors.request.use(config => {
    const transform = (obj: any) => {
        if (obj === null || typeof obj !== 'object') return obj

        Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (typeof value === 'bigint') {
                obj[key] = value.toString();
            } else if (typeof value === 'object') {
                transform(value)
            }
        })
        return obj
    }
    return {
        ...config,
        data: transform(config.data)
    }
})

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
    static async Get(action: string): Promise<MyActionResult> {
        try {
            const response = await api.get(action)
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
            const response = await api.post(action, data)
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
            const response = await api.put(action, data)
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

    static async Delete(action: string, index: number | bigint): Promise<MyActionResult> {
        try {
            const response = await api.delete(`${action}/${index}`)
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

    static async SelectIdName<T extends IdNameModel>(action: string, isDistinct: boolean = false): Promise<T[]> {
        try {
            const actionResult = await this.Get(`${action}/SelectIdName/${isDistinct}`)

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