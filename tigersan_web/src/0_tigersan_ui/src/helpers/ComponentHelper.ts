import { h, createApp, type App, type Component } from 'vue'

export type Data = Record<string, unknown>

interface ManagedElement extends HTMLDivElement {
    __vueAppInstance?: App
    __mutationObserver?: MutationObserver
}

export class ComponentHelper {
    /** 创建“应用实例” */
    static CreateApp(component: Component, rootProps?: Data | null): App<Element> {
        return createApp({
            render() {
                return h(component)
            }
        }, rootProps)
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

        const div = ComponentHelper.GetElement(component, rootProps)
        if (!div) {
            console.warn('The div is null!')
            return null
        }
        body.appendChild(div)
        return div
    }

    /** 移除“元素” */
    static RemoveElement(div: Element, selectors: string = 'body'): boolean {
        const body = document.querySelector(selectors)
        if (!body) {
            console.warn('The body is null!')
            return false
        }

        body.removeChild(div)
        return true
    }

    /** 获取“元素” */
    static GetElement(component: Component, rootProps?: Data | null): Element | null {
        // 1. 创建容器
        const div = document.createElement('div') as ManagedElement

        // 2. 创建并挂载 Vue 应用
        const app = createApp(component, rootProps)

        try {
            app.mount(div)
        } catch (e) {
            console.error('Vue app mount failed:', e)
            return null
        }

        // 3. 绑定实例引用
        div.__vueAppInstance = app

        // 4. 设置 MutationObserver 监听器
        const observer = new MutationObserver((mutationsList) => {
            let shouldUnmount = false

            for (const mutation of mutationsList) {
                for (const removedNode of mutation.removedNodes) {
                    // 情况 A: div 直接被移除
                    if (removedNode === div) {
                        shouldUnmount = true
                        break
                    }
                    // 情况 B: div 的父节点被移除 (div 成为 detached node)
                    if (removedNode instanceof Node && removedNode.contains(div)) {
                        shouldUnmount = true
                        break
                    }
                }
                if (shouldUnmount) break
            }

            if (shouldUnmount) {
                // 执行清理
                // 1. 断开观察者
                if (div.__mutationObserver) {
                    div.__mutationObserver.disconnect()
                    div.__mutationObserver = undefined
                }

                // 2. 卸载 Vue 应用
                if (div.__vueAppInstance) {
                    try {
                        div.__vueAppInstance.unmount()
                    } catch (e) {
                        console.warn('Vue app unmount error:', e)
                    }
                    div.__vueAppInstance = undefined
                }
            }
        })

        // 5. 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        // 保存 observer 引用
        div.__mutationObserver = observer

        return div
    }
}