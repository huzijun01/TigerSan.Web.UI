
import { AxiosBase } from "./AxiosBase"
import { KeyValue } from "../ParamHelper"
import { dialog } from "../../stores/dialog"
import { FilterModel } from "../../models/FilterModel"
import { MyActionResult } from "../../models/MyActionResult"
import { IdNameModel, IdValueModel } from "../../models/SelectModel"

export class AxiosHelper extends AxiosBase {
    // 列表:
    static async GetCount(
        action: string,
        param: {
            params?: KeyValue[],
            filter?: FilterModel
        }): Promise<number> {
        try {
            const actionResult = await this.Post(`${action}/Count`, param.params, param.filter)

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
        param: {
            pageSize?: number,
            pageNumber?: number,
            strList?: string,
            sort?: string,
            ascending?: boolean,
            params?: KeyValue[],
            filter?: FilterModel
        }): Promise<T[]> {
        try {
            const arrParams: KeyValue[] = [
                { key: 'pageSize', value: param.pageSize },
                { key: 'pageNumber', value: param.pageNumber },
                { key: 'sort', value: param.sort },
                { key: 'ascending', value: param.ascending },
            ]
            if (param.params) arrParams.push(...param.params)

            const actionResult = await this.Post(`${action}/${param.strList ?? 'List'}`, arrParams, param.filter)

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

    static async SelectIdValue<T extends IdValueModel>(
        action: string,
        param: {
            isDistinct?: boolean,
            strIdValueList?: string,
            params?: KeyValue[],
            filter?: FilterModel
        }): Promise<T[]> {
        try {
            const arrParams: KeyValue[] = [{ key: 'isDistinct', value: param.isDistinct }]
            if (param.params) arrParams.push(...param.params)

            const actionResult = await this.Post(`${action}/${param.strIdValueList ?? 'SelectIdValue'}`, arrParams, param.filter)

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

    static async SelectIdName<T extends IdNameModel>(
        action: string,
        param: {
            isDistinct?: boolean,
            strIdNameList?: string,
            params?: KeyValue[],
            filter?: FilterModel
        }): Promise<T[]> {
        try {
            const arrParams: KeyValue[] = [{ key: 'isDistinct', value: param.isDistinct }]
            if (param.params) arrParams.push(...param.params)

            const actionResult = await this.Post(`${action}/${param.strIdNameList ?? 'SelectIdName'}`, arrParams, param.filter)

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
        debugger
            const range = isRange ? '/Range' : ''
            const actionResult = await this.Post(`${action}${range}`, undefined, data)

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
}