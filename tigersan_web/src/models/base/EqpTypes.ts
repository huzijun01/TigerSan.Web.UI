import { SelectModel, Texts } from "@/0_tigersan_ui/tigerui"

/** 设备类型 */
export enum EqpTypes {
    /** 标签 */
    Tag = 0,
    /** 定位器 */
    Locator = 1,
}

export class EqpType {
    static GetName(state?: EqpTypes): string {
        if (state === undefined || state === null) return ''

        switch (state) {
            case EqpTypes.Tag:
                return Texts.Tag.value
            case EqpTypes.Locator:
                return Texts.Locator.value
            default:
                return Texts.Unknown.value
        }
    }

    /** 获取“筛选框模型” */
    static GetSelectModel(): SelectModel<EqpTypes> {
        const select = new SelectModel<EqpTypes>()
        select.Width.value = 120
        select.IsAllowSearch.value = true
        select.PlaceholderCN.value = '设备类型'
        select.PlaceholderEN.value = 'Eqp Type'
        select.Items.push(...[0, 1])
        select._converter = this.GetName
        return select
    }
}