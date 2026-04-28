import axios from "axios"
import JSONBig from 'json-bigint' // 导入JSONBig

function CreateApi() {
    return axios.create({
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
}

export const api = CreateApi()

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

export const SetAuthorization = (authorization?: string) => {
    api.defaults.headers.common['Authorization'] = authorization ? authorization : undefined
}