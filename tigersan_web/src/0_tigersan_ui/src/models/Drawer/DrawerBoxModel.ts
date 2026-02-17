import { ref, computed } from "vue"

/** 抽屉盒子模型 */
class DrawerBoxModel {
    //#region 【Properties】
    /** 是否“打开” */
    Title = ref('Title')
    /** 是否“打开” */
    IsOpen = ref(true)
    /** 内容高度 */
    ContentHeight = ref(0)
    /** 内容最大高度 */
    ContentMaxHeight = ref(500)
    /** “内容容器”内边距 */
    ContentPanelPadding = ref(10)

    //#region [computed]
    /** 类对象 */
    ClassObj = computed(() => {
        return {
            'drawer-box-open': this.IsOpen.value
        }
    })

    /** “内容容器”样式对象 */
    ContentPanelStyleObj = computed(() => {
        let height = this.IsOpen.value ? this.ContentHeight.value : 0
        height += Math.ceil(this.ContentPanelPadding.value * 2)

        return {
            'height': `${height}px`,
            'maxHeight': `${this.ContentMaxHeight.value}px`
        }
    })
    //#endregion [computed]
    //#endregion 【Properties】

    //#region 【Functions】
    /** 点击后 */
    OnClick() {
        this.IsOpen.value = !this.IsOpen.value
    }
    //#endregion 【Functions】
}

export {
    DrawerBoxModel
}