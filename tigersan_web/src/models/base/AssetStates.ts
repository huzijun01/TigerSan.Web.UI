import { Colors, SelectModel, TableItemModel, Texts } from "@/0_tigersan_ui/tigerui"

/** 资产状态 */
export enum AssetStates {
    /** 无记录 */
    NoRecord = 0,
    /** 入库 */
    Inbound = 1,
    /** 在库 */
    InStore = 2,
    /** 滞留 */
    Stolid = 3,
    /** 出库 */
    Outbound = 4,
    /** 在途 */
    InTransit = 5,
}

export class AssetState {
    static GetName(state: AssetStates): string {
        switch (state) {
            case AssetStates.NoRecord:
                return Texts.NoRecord.value
            case AssetStates.Inbound:
                return Texts.Inbound.value
            case AssetStates.InStore:
                return Texts.InStore.value
            case AssetStates.Stolid:
                return Texts.Stolid.value
            case AssetStates.Outbound:
                return Texts.Outbound.value
            case AssetStates.InTransit:
                return Texts.InTransit.value
            default:
                return Texts.Unknown.value
        }
    }

    /** 获取“筛选框模型” */
    static GetSelectModel(): SelectModel<AssetStates> {
        const select = new SelectModel<AssetStates>()
        select.Width.value = 120
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '资产状态'
        select.PlaceholderEN.value = 'Asset State'
        select.Items.push(...[0, 1, 2, 3, 4, 5])
        select._converter = this.GetName
        return select
    }

    /** 初始化“项目模型” */
    static InitItemModel(itemModel: TableItemModel<any>, propName: string = 'state') {
        if (itemModel._headerModel._propName === propName) {
            const source = itemModel.GetSource()
            if (source === AssetStates.Inbound) {
                itemModel.Color.value = Colors.Warning
                itemModel.Background.value = Colors.Warning10
            } else if (source === AssetStates.InStore) {
                itemModel.Color.value = Colors.Success
                itemModel.Background.value = Colors.Success10
            } else if (source === AssetStates.Stolid) {
                itemModel.Color.value = Colors.Danger
                itemModel.Background.value = Colors.Danger10
            } else if (source === AssetStates.Outbound) {
                itemModel.Color.value = Colors.Info
                itemModel.Background.value = Colors.Info10
            } else if (source === AssetStates.NoRecord) {
                itemModel.Color.value = Colors.Danger
                itemModel.Background.value = Colors.Danger10
            } else {
                itemModel.Color.value = Colors.Brand
                itemModel.Background.value = Colors.Brand10
            }
        }
    }
}

/** 异常类型 */
export enum ErrorTypes {
    /** 无信号 */
    NoSignal = 0,
    /** 故障 */
    Breakdown = 1,
    /** 丢失 */
    Lose = 2,
}

export class ErrorType {
    static GetName(state?: ErrorTypes): string {
        if (state === undefined || state === null) return ''

        switch (state) {
            case ErrorTypes.NoSignal:
                return Texts.NoSignal.value
            case ErrorTypes.Breakdown:
                return Texts.Breakdown.value
            case ErrorTypes.Lose:
                return Texts.Lose.value
            default:
                return Texts.Unknown.value
        }
    }

    /** 获取“筛选框模型” */
    static GetSelectModel(): SelectModel<ErrorTypes> {
        const select = new SelectModel<ErrorTypes>()
        select.Width.value = 120
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '异常类型'
        select.PlaceholderEN.value = 'Error Type'
        select.Items.push(...[0, 1, 2])
        select._converter = this.GetName
        return select
    }
}