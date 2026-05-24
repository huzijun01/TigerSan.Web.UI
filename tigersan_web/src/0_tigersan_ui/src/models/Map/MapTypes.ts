export * from './MapTypes/Map'
export * from './MapTypes/Events'
export * from './MapTypes/Markers'
export * from './MapTypes/MapPlugins'
export * from './MapTypes/Tools'

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

/** 类名 */
export class ClassNames {
    static readonly Polygon = 'Overlay.Polygon'
    static readonly Polyline = 'Overlay.Polyline'
    static readonly BezierCurve = 'Overlay.BezierCurve'
    static readonly Circle = 'Overlay.Circle'
    static readonly CircleMarker = 'Overlay.CircleMarker'
    static readonly Ellipse = 'Overlay.Ellipse'
    static readonly Rectangle = 'Overlay.Rectangle'
    static readonly GeoJSON = 'Overlay.GeoJSON'
}
