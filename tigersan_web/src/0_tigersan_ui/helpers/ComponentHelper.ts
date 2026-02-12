import { h, createApp, type Component } from 'vue'

export type Data = Record<string, unknown>

export class ComponentHelper {
    static CreateApp(component: Component, rootProps?: Data | null) {
        // 创建应用实例:
        return createApp({
            render() {
                return h(component)
            }
        }, rootProps)
    }
}