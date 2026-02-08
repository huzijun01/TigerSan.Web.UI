import { h, createApp, type Component } from 'vue'

export class ComponentHelper {
    static CreateApp(component: Component) {
        // 创建应用实例:
        return createApp({
            render() {
                return h(component)
            }
        })
    }
}