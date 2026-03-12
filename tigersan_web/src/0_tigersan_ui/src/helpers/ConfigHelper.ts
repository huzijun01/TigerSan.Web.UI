import { ref, watch } from 'vue'

/** 语言 */
enum Language {
    en,
    zhCn
}

/** 配置模型 */
class ConfigModel {
    //#region 【Fields】
    /** “地区”改变后 */
    _onLocaleChanged?: (lang: Language) => void
    //#endregion 【Fields】

    //#region 【Properties】
    /** 地区 */
    readonly Locale = ref(Language.en)
    //#endregion 【Properties】

    //#region 【Ctor】
    constructor() {
        watch(this.Locale, () => this._onLocaleChanged?.(this.Locale.value))
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 切换“地区” */
    readonly ToggleLocale = () => {
        this.Locale.value = this.Locale.value == Language.en ? Language.zhCn : Language.en
    }
    //#endregion 【Functions】
}

/** 配置实例 */
const config = new ConfigModel()

export {
    Language,
    ConfigModel,
    config,
}