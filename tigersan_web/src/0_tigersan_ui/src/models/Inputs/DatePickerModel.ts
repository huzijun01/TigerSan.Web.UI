import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { computed, ref } from "vue"
import type { Language } from "element-plus/lib/locales.js"

enum DateType {
    year = 'year',
    month = 'month',
    date = 'date',
    dates = 'dates',
    datetime = 'datetime',
    week = 'week',
    datetimerange = 'datetimerange',
    daterange = 'daterange',
    monthrange = 'monthrange',
}

class DatePickerModel {
    //#region 【Fields】
    _locale?: Language = zhCn
    _type: DateType = DateType.date
    _format = 'YYYY/MM/DD hh:mm:ss'
    _valueFormat = 'YYYY/MM/DD hh:mm:ss'
    _placeholder = '请选择时间'
    _startPlaceholder = '开始时间'
    _endPlaceholder = '结束时间'
    _onChange?: (value?: string | [string, string]) => void
    //#endregion 【Fields】

    //#region 【Properties】
    /** 日期 */
    readonly Date = ref<string | [string, string] | undefined>()

    //#region [computed]
    /** 起始日期 */
    readonly Start = computed(() => {
        const date = this.Date.value
        return date && Array.isArray(date) && date.length > 0 ? date[0] : undefined
    })

    /** 结束日期 */
    readonly End = computed(() => {
        const date = this.Date.value
        return date && Array.isArray(date) && date.length > 1 ? date[1] : undefined
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    readonly OnChange = () => {
        if (this._onChange) {
            this._onChange(this.Date.value)
        }
    }
    //#endregion 【Functions】
}

export {
    DateType,
    DatePickerModel
}