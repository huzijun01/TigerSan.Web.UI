import { IdModel, IdModelHelper, SelectModel, IdValueModel, AxiosHelper } from "@/0_tigersan_ui/tigerui"

/** "批次"模型 */
export class BatchModel extends IdModel {
    company: bigint = 0n
    scenario: bigint = 0n
    batchId = ''
    shipmentTime = new Date()
    manager?: string
    phone?: string
    comment?: string
}

class BatchHelper extends IdModelHelper<BatchModel> {
    constructor() {
        super('Batch')
        this._strIdValueList = 'IdBatchIdList'
    }

    /** 获取“筛选框模型” */
    GetIdNameSelectModel(): SelectModel<IdValueModel> {
        return super.GetIdValueSelectModel('请选择批次', 'Please select a batch')
    }

    // 查:
    /** 筛选“总数” */
    readonly GetCount = async (param: {
        company?: bigint,
        scenario?: bigint,
        batchId?: string,
    }) => await AxiosHelper.GetCount(this._action, {
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
    readonly GetList = async (param: {
        pageSize?: number,
        pageNumber?: number,
        company?: bigint,
        scenario?: bigint,
        batchId?: string,
    }) => await AxiosHelper.GetList<BatchModel>(this._action, {
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

export const batchHelper = new BatchHelper()