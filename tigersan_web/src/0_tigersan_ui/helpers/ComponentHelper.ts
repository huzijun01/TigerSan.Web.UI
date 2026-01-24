import { h, createApp, type Component } from 'vue'

function CreateApp(component: Component) {
    // 创建应用实例:
    return createApp({
        render() {
            return h(component)
        }
    })
}

export { CreateApp }