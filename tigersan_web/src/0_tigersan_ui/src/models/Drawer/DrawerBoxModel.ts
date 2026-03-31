import { ref, computed } from "vue"
import { ContentSizeBehavior } from "../../helpers"

/** 抽屉盒子模型 */
class DrawerBoxModel extends ContentSizeBehavior {
    //#region 【Properties】
    /** 是否“打开” */
    readonly Title = ref('Title')

    //#region [computed]
    /** 类对象 */
    readonly ClassObj = computed(() => {
        return {
            'drawer-box-open': this.IsOpen.value
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    /** 点击后 */
    readonly OnClick = () => {
        this.IsOpen.value = !this.IsOpen.value
    }
    //#endregion 【Functions】
}

export {
    DrawerBoxModel
}