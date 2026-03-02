import { ref, watch } from "vue"
import { DomHelper } from "./DomHelper"
import { ConfigBase } from "./ConfigBase"

export class ThemeConfig {
    /** 是否为黑暗模式 */
    isDark = false
}

export class ThemeHelper {
    //#region 【Fields】
    /** CSS路径 */
    static readonly theme = `theme.css`
    static readonly config = new ConfigBase('theme', new ThemeConfig())
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否为黑暗模式 */
    static readonly IsDark = ref(false)
    //#endregion 【Properties】

    //#region 【Ctor】
    private constructor() { }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [private]
    /** 更新 */
    private static Update() {
        const config = this.config.Get()
        this.IsDark.value = config.isDark
    }

    /** 保存 */
    private static Save() {
        const config = this.config.Get()
        config.isDark = this.IsDark.value
        this.config.Save()
    }
    //#endregion [private]

    /** 初始化 */
    static Init() {
        this.Update()
        this.UpdateTheme()
        watch(this.IsDark, this.UpdateTheme)
    }

    /** 更新主题 */
    static readonly UpdateTheme = () => {
        this.Save()
        if (this.IsDark.value) {
            DomHelper.AddClass('dark')
            DomHelper.RemoveCss(this.theme)
        } else {
            DomHelper.RemoveClass('dark')
            DomHelper.AddCss(this.theme)
        }
    }

    /** 切换 */
    static readonly Toggle = () => {
        this.IsDark.value = !this.IsDark.value
    }
    //#endregion 【Functions】
}

ThemeHelper.Init()