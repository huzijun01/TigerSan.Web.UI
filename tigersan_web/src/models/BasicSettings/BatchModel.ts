import { AxiosHelper } from "@/helpers"
import { IdModel, IdModelHelper } from "../base/IdModel"

export type BatchEvent = (model: BatchModel) => void

/** "组织机构"模型 */
export class BatchModel extends IdModel {
    company: bigint = 0n
    scenario: bigint = 0n
    batchId = ''
    shipmentTime = new Date()
    manager?: string
    phone?: string
    comment?: string
}

class BatchMgtHelper extends IdModelHelper<BatchModel> {
    constructor() {
        super('Batch')
    }

    /** 筛选“总数” */
    readonly GetCountAsync = async (param: {
        company?: bigint,
        scenario?: bigint,
        batchId?: string,
    }) => await AxiosHelper.GetCount(this._action,
        {
            filter: {
                filters: [
                    { propName: 'Scenario', value: param.scenario },
                    { propName: 'BatchId', value: param.batchId },
                ],
                parent: {
                    id: param.company,
                }
            }
        })

    /** 筛选“数据”集合 */
    readonly GetListAsync = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        scenario?: bigint,
        batchId?: string,
    }) => await AxiosHelper.GetList<BatchModel>(this._action,
        {
            pageSize: param.pageSize,
            pageNumber: param.pageNumber,
            filter: {
                filters: [
                    { propName: 'Scenario', value: param.scenario },
                    { propName: 'BatchId', value: param.batchId },
                ],
                parent: {
                    id: param.company,
                }
            }
        })
}

export const batchMgtHelper = new BatchMgtHelper()