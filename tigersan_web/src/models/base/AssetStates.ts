import { SelectModel, Texts } from "@/0_tigersan_ui/tigerui"

export enum AssetStates {
    Offline = 0,
    Stolid = 1,
    Inbound = 2,
    Outbound = 3,
    InTransit = 4,
    InTransitTimeout = 5,
}

export class AssetState {
    static GetName(state: AssetStates): string {
        switch (state) {
            case AssetStates.Offline:
                return Texts.Offline.value
            case AssetStates.Stolid:
                return Texts.Stolid.value
            case AssetStates.Inbound:
                return Texts.Inbound.value
            case AssetStates.Outbound:
                return Texts.Outbound.value
            case AssetStates.InTransit:
                return Texts.InTransit.value
            case AssetStates.InTransitTimeout:
                return Texts.InTransitTimeout.value
            default:
                return Texts.Unknown.value
        }
    }

    /** 获取“筛选框模型” */
    static GetSelectModel(): SelectModel<AssetStates> {
        const select = new SelectModel<AssetStates>()
        select.Width.value = 208
        select.PlaceholderCN.value = '请选择状态'
        select.PlaceholderEN.value = 'Please select a state'
        select.Items.push(...[0, 1, 2, 3, 4, 5])
        select._converter = this.GetName
        return select
    }
}