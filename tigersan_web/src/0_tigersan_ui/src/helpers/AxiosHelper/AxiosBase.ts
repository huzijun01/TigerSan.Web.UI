import JSONBig from 'json-bigint'
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"
import { Texts } from "../../texts"
import { type AxiosInstance } from "axios"
import { DialogHelper } from "../../stores"
import { KeyValueModel, ParamHelper } from "../ParamHelper"
import { MyActionResult } from "../../models/MyActionResult"

export class AxiosBase {
    //#region 【Fields】
    _api: AxiosInstance
    //#endregion 【Fields】

    //#region 【Ctor】
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
    //#endregion 【Ctor】

    //#region 【Functions】
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
            return MyActionResult.Error(error)
        }
    }

    readonly GetData = async <T extends object | unknown[] | number>(action: string, params?: KeyValueModel[]): Promise<T> => {
        return (await this.Get(action, params)).data as T
    }

    readonly Post = async <TData>(
        action: string,
        params?: KeyValueModel[],
        data?: unknown,
        config?: AxiosRequestConfig): Promise<MyActionResult<TData>> => {
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            const response = await this._api.post(url, data, config)
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
            return MyActionResult.Error(error)
        }
    }

    readonly Put = async <TData>(
        action: string,
        params?: KeyValueModel[],
        data?: TData,
        isRange: boolean = false): Promise<MyActionResult<TData>> => {
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
            return MyActionResult.Error(error)
        }
    }

    readonly Delete = async <TData>(
        action: string,
        id?: number | bigint,
        params?: KeyValueModel[]): Promise<MyActionResult<TData>> => {
        try {
            let url = id === undefined ? action : `${action}/${id}`
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
            return MyActionResult.Error(error)
        }
    }

    readonly DeleteRange = async <TData>(
        action: string,
        ids: number[] | bigint[],
        params?: KeyValueModel[]): Promise<MyActionResult<TData>> => {
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
            return MyActionResult.Error(error)
        }
    }

    /** 下载“文件” */
    readonly DownloadFile = async (action: string, params?: KeyValueModel[]): Promise<MyActionResult<undefined>> => {
        let link: HTMLAnchorElement | null = null // 用于后续清理
        try {
            let url = action
            if (params) {
                url += ParamHelper.GetParamString(params)
            }

            // 关键：设置 responseType 为 'blob'
            const response: AxiosResponse<Blob> = await this._api.get(url, {
                responseType: 'blob'
            })

            // 检查响应是否成功 (状态码 200-299)
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Download failed with status: ${response.status}`)
            }

            // 从响应头中获取文件名 (可选，如果后端没设置 Content-Disposition，可能需要从参数或默认值获取)
            const contentDisposition = response.headers['content-disposition']
            let fileName = 'downloaded_file'

            if (contentDisposition) {
                // 简单的正则提取 filename="..." 或 filename*=...
                const fileNameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^\r\n"']*)['"]??/i)
                if (fileNameMatch && fileNameMatch) {
                    fileName = decodeURIComponent(fileNameMatch)
                }
            } else {
                // 如果后端通过 FileDownloadName 设置了，通常会在 Content-Disposition 中
                // 也可以尝试从 URL 参数中获取 name
                const nameParam = params?.find(p => p.key === 'name')
                if (nameParam) fileName = nameParam.value as string
            }

            // 创建 Blob 对象
            const blob = new Blob([response.data], { type: response.headers['content-type'] as string })

            // 创建下载链接
            link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName

            // 触发点击
            document.body.appendChild(link)
            link.click()

            return MyActionResult.Success(Texts.DownloadSuccessfully.value)
        } catch (error) {
            return MyActionResult.Error(error)
        } finally {
            if (link) {
                // 移除 DOM 元素
                if (link.parentNode) {
                    link.parentNode.removeChild(link)
                }
                // 释放 Blob URL 内存
                if (link.href) {
                    window.URL.revokeObjectURL(link.href)
                }
            }
        }
    }
    //#endregion 【Functions】
}