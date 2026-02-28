import { ref, watch } from "vue"
import { DomHelper } from "@/0_tigersan_ui/tigerui"

export class ThemeHelper {
    theme = `${window.location.href}/theme.css`
    readonly IsDark = ref(false)

    constructor() {
        this.UpdateTheme()
        watch(this.IsDark, this.UpdateTheme)
    }

    readonly UpdateTheme = () => {
        if (this.IsDark.value) {
            DomHelper.RemoveCss(this.theme)
        } else {
            DomHelper.AddCss(this.theme)
        }
    }

    readonly Toggle = () => {
        this.IsDark.value = !this.IsDark.value
    }
}

export const themeHelper = new ThemeHelper()