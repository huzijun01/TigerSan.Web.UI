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

    /** 追加“应用实例” */
    static AppendApp(
        component: Component,
        rootProps?: Data | null,
        selectors: string = 'body'): Element | null {
        const body = document.querySelector(selectors)
        if (!body) {
            console.warn('The body is null!')
            return null
        }

        const element = ComponentHelper.GetElement(component, rootProps)
        if (!element) {
            console.warn('The element is null!')
            return null
        }
        body.appendChild(element)
        return element
    }

    /** 移除“元素” */
    static RemoveElement(element: Element, selectors: string = 'body'): boolean {
        const body = document.querySelector(selectors)
        if (!body) {
            console.warn('The body is null!')
            return false
        }

        body.removeChild(element)
        return true
    }
}