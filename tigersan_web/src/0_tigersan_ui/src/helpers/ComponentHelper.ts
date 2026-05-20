import { h, createApp, type App, type Component } from 'vue'

export type Data = Record<string, unknown>

export class ComponentHelper {
    /** 创建“应用实例” */
    static CreateApp(component: Component, rootProps?: Data | null): App<Element> {
        return createApp({
            render() {
                return h(component)
            }
        }, rootProps)
    }

    /** 获取“元素” */
    static GetElement(component: Component, rootProps?: Data | null): Element | null {
        const app = ComponentHelper.CreateApp(component, rootProps)
        const div = document.createElement('div')
        app.mount(div)
        const container = app._container as HTMLDivElement
        if (!container) {
            console.log('The container is undefined!')
            return null
        }
        return container.firstElementChild
    }
}