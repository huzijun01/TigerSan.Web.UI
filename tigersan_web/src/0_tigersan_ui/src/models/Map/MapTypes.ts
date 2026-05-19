export * from './MapTypes/Map'
export * from './MapTypes/Events'
export * from './MapTypes/Markers'
export * from './MapTypes/MapPlugins'

declare global {
    interface Window {
        AMap?: typeof AMap
        _AMapSecurityConfig?: SecurityConfig
    }

    type SecurityConfig = Record<string, any> & {
        /** JSAPI key搭配代理服务器并携带安全密钥转发（安全）*/
        serviceHost?: string
        /** JSAPI key搭配静态安全密钥以明文设置（不安全，建议开发环境用） */
        securityJsCode?: string
    }

    namespace AMap {
        function plugin(pluginName: string, callback: Function): void
    }
}
