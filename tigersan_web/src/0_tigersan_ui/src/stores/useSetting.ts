import { defineStore } from 'pinia'
import { StoreIDs } from './base/StoreIDs'

enum Language {
    en,
    zhCn
}

class SettingModel {
    /** 地区 */
    Locale = Language.en
}

/* 仓库 */
const useSetting = defineStore(StoreIDs.setting, () => {
    return new SettingModel()
})

class SettingHelper {
    /** 地区 */
    Locale = Language.en

    /** 设置“地区” */
    static SetLocale(lang: Language) {
        const setting = useSetting()
        setting.Locale = lang
    }
}

export {
    Language,
    SettingModel,
    SettingHelper,
    useSetting,
}