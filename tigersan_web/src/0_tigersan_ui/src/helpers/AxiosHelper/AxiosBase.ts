import axios from "axios"
import JSONBig from 'json-bigint'
import { DialogHelper } from "../../stores"
import { type AxiosInstance } from "axios"
import { KeyValueModel, ParamHelper } from "../ParamHelper"
import { MyActionResult } from "../../models/MyActionResult"

export class AxiosBase {
    _api: AxiosInstance

    constructor(baseURL: string) {
        const api = axios.create({
            baseURL: baseURL,
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

        this._api = api
    }

    readonly SetAuthorization = (authorization?: string) => {
        this._api.defaults.headers.common['Authorization'] = authorization ? authorization : undefined
    }

    readonly Get = async <TData>(
        action: string,
        params?: KeyValueModel[],
        isShowResult: boolean = true): Promise<MyActionResult<TData>> => {
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.get(url)
            const actionResult = response.data as MyActionResult<TData>

            if (actionResult === undefined) {
                DialogHelper.Warning(MyActionResult.ActionResult_Undefined.message)
                return MyActionResult.ActionResult_Undefined
            }
            else if (isShowResult && !MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
            }

            return actionResult
        } catch (error) {
            return MyActionResult.GetError(error)
        }
    }

    readonly GetData = async <T extends object | unknown[] | number>(action: string, params?: KeyValueModel[]): Promise<T> => {
        return (await this.Get(action, params)).data as T
    }

    readonly Post = async <TData>(action: string, params?: KeyValueModel[], data?: unknown): Promise<MyActionResult<TData>> => {
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.post(url, data)
            const actionResult = response.data as MyActionResult<TData>

            if (actionResult === undefined) {
                DialogHelper.Warning(MyActionResult.ActionResult_Undefined.message)
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

    readonly Put = async <TData>(action: string, data: TData, params?: KeyValueModel[], isRange: boolean = false): Promise<MyActionResult<TData>> => {
        try {
            const range = isRange ? '/Range' : ''

            let url = `${action}${range}`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.put(url, data)
            const actionResult = response.data as MyActionResult<TData>

            if (actionResult === undefined) {
                DialogHelper.Warning(MyActionResult.ActionResult_Undefined.message)
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

    readonly Delete = async <TData>(action: string, id: number | bigint, params?: KeyValueModel[]): Promise<MyActionResult<TData>> => {
        try {
            let url = `${action}/${id}`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.delete(url)
            const actionResult = response.data as MyActionResult<TData>

            if (actionResult === undefined) {
                DialogHelper.Warning(MyActionResult.ActionResult_Undefined.message)
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

    readonly DeleteRange = async <TData>(action: string, ids: number[] | bigint[], params?: KeyValueModel[]): Promise<MyActionResult<TData>> => {
        try {
            let url = `${action}/Range`
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.delete(url, { data: ids })
            const actionResult = response.data as MyActionResult<TData>

            if (actionResult === undefined) {
                DialogHelper.Warning(MyActionResult.ActionResult_Undefined.message)
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