
import { AxiosBase } from "./AxiosBase"
import { KeyValueModel } from "../ParamHelper"
import { DialogHelper } from "../../stores/dialog"
import { FilterModel } from "../../models/FilterModel"
import { MyActionResult } from "../../models/MyActionResult"
import { IdNameModel, IdValueModel } from "../../models/SelectModel"

export class AxiosHelper extends AxiosBase {
    constructor(baseURL: string) {
        super(baseURL)
    }

    // 列表:
    readonly GetCount = async (
        action: string,
        param: {
            params?: KeyValueModel[],
            filter?: FilterModel
        }): Promise<number> => {
        try {
            const actionResult = await this.Post(`${action}/Count`, param.params, param.filter)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return 0
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                DialogHelper.Warning('GetCount: The data is undefined!')
                return 0
            }

            return actionResult.data as number
        } catch (error) {
            console.error(error)
            return 0
        }
    }

    readonly GetList = async <T>(
        action: string,
        param: {
            pageSize?: number,
            pageNumber?: number,
            strList?: string,
            sort?: string,
            ascending?: boolean,
            params?: KeyValueModel[],
            filter?: FilterModel
        }): Promise<T[]> => {
        try {
            const arrParams: KeyValueModel[] = [
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
                DialogHelper.Warning('GetList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    readonly SelectIdValue = async <T extends IdValueModel>(
        action: string,
        param: {
            isDistinct?: boolean,
            strIdValueList?: string,
            params?: KeyValueModel[],
            filter?: FilterModel
        }): Promise<T[]> => {
        try {
            const arrParams: KeyValueModel[] = [{ key: 'isDistinct', value: param.isDistinct }]
            if (param.params) arrParams.push(...param.params)

            const actionResult = await this.Post(`${action}/${param.strIdValueList ?? 'SelectIdValue'}`, arrParams, param.filter)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return []
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                DialogHelper.Warning('GetList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    readonly SelectIdName = async <T extends IdNameModel>(
        action: string,
        param: {
            isDistinct?: boolean,
            strIdNameList?: string,
            params?: KeyValueModel[],
            filter?: FilterModel
        }): Promise<T[]> => {
        try {
            const arrParams: KeyValueModel[] = [{ key: 'isDistinct', value: param.isDistinct }]
            if (param.params) arrParams.push(...param.params)

            const actionResult = await this.Post(`${action}/${param.strIdNameList ?? 'SelectIdName'}`, arrParams, param.filter)

            if (!MyActionResult.IsSuccess(actionResult)) {
                MyActionResult.ShowResult(actionResult)
                return []
            }
            else if (MyActionResult.IsSuccessNoData(actionResult)) {
                DialogHelper.Warning('GetList: The data is undefined!')
                return []
            }

            return actionResult.data as T[]
        } catch (error) {
            console.error(error)
            return []
        }
    }

    readonly Add = async <TData>(action: string, data: TData, isRange: boolean = false): Promise<MyActionResult<TData>> => {
        try {
            const range = isRange ? '/Range' : ''
            const actionResult = await this.Post<TData>(`${action}${range}`, undefined, data)

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

    // readonly Select = async <T>(action: string, field: string): Promise<T[]> => {
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