import { ref, shallowRef } from "vue"

/** 尺寸行为 */
export class SizeBehavior {
    //#region 【Fields】
    /** “尺寸”监听器 */
    private _observer?: ResizeObserver
    //#endregion 【Fields】

    //#region 【Properties】
    /** 根元素（需手动绑定到“根元素”上） */
    readonly refRoot = shallowRef<HTMLElement | undefined>()
    /** 实际宽度 */
    readonly ActualWidth = ref(0)
    /** 实际高度 */
    readonly ActualHeight = ref(0)
    //#endregion 【Properties】

    //#region 【Functions】
    /** 获取“宽度” */
    private readonly GetWidth = (): number => {
        return this.refRoot.value?.getBoundingClientRect().width ?? 0
    }

    /** 获取“高度” */
    private readonly GetHeight = (): number => {
        return this.refRoot.value?.getBoundingClientRect().height ?? 0
    }

    /** 更新“尺寸” */
    readonly UpdateSize = () => {
        this.ActualWidth.value = this.GetWidth()
        this.ActualHeight.value = this.GetHeight()
    }

    /** 开始监听“尺寸变化”（需手动调用） */
    readonly Observe = () => {
        if (!this.refRoot.value) return

        this.UpdateSize()
        this.Unobserver()
        this._observer = new ResizeObserver(this.UpdateSize)
        this._observer.observe(this.refRoot.value)
    }

    /** 停止监听“尺寸变化” */
    readonly Unobserver = () => {
        if (!this.refRoot.value) return

        this._observer?.unobserve(this.refRoot.value)
    }
    //#endregion 【Functions】
}