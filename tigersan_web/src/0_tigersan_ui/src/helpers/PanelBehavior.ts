import { type App, type Component } from "vue"
import { ComponentHelper } from "./ComponentHelper"

export class PanelBehavior {
    //#region 【Fields】
    private _panel?: Element
    private readonly _id: string
    private readonly _component: Component
    private readonly _getContent: () => App<any> | undefined
    private readonly _setContent: (content?: App<any>) => void
    //#endregion 【Fields】

    //#region 【Ctor】
    constructor(
        id: string,
        component: Component,
        getContent: () => App<any> | undefined,
        setContent: (content?: App<any>) => void,
    ) {
        this._id = id
        this._component = component
        this._getContent = getContent
        this._setContent = setContent
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    /** 添加容器 */
    readonly AddPanel = () => {
        const id = this._id
        const dom = document.querySelector(`#${id}`)
        if (dom) {
            this._panel = dom
        }

        if (!this._panel) {
            this._panel = document.createElement('div')
            this._panel.id = id
            document.body.appendChild(this._panel)
        }
    }

    /** 添加内容 */
    readonly AddContent = (model?: any) => {
        this.AddPanel()
        if (!this._panel) {
            console.warn('The panel is undefined!')
            return
        }

        const content = this._getContent()
        if (content) {
            content.unmount()
            this._setContent(undefined)
        }

        const contentApp = ComponentHelper.CreateApp(this._component, { model })
        contentApp.mount(this._panel)
        this._setContent(contentApp)
    }

    /** 移除内容 */
    readonly RemoveContent = (model?: any) => {
        const content = this._getContent()
        if (content) {
            content.unmount()
            this._setContent(undefined)
        }
    }
    //#endregion 【Functions】
}