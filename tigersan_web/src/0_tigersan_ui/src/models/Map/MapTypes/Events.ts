/** 地图事件 */
export class MapEvents {
    static readonly add = 'add'
    static readonly resize = 'resize'
    static readonly error = 'error'
    static readonly complete = 'complete'
    static readonly click = 'click'
    static readonly dblclick = 'dblclick'
    static readonly mapmove = 'mapmove'
    static readonly hotspotclick = 'hotspotclick'
    static readonly hotspotover = 'hotspotover'
    static readonly hotspotout = 'hotspotout'
    static readonly movestart = 'movestart'
    static readonly moveend = 'moveend'
    static readonly zoomchange = 'zoomchange'
    static readonly zoomstart = 'zoomstart'
    static readonly zoomend = 'zoomend'
    static readonly rotatechange = 'rotatechange'
    static readonly rotatestart = 'rotatestart'
    static readonly rotateend = 'rotateend'
    static readonly mousemove = 'mousemove'
    static readonly mousewheel = 'mousewheel'
    static readonly mouseover = 'mouseover'
    static readonly mouseout = 'mouseout'
    static readonly mouseup = 'mouseup'
    static readonly mousedown = 'mousedown'
    static readonly rightclick = 'rightclick'
    static readonly dragstart = 'dragstart'
    static readonly dragging = 'dragging'
    static readonly dragend = 'dragend'
    static readonly touchstart = 'touchstart'
    static readonly touchmove = 'touchmove'
    static readonly touchend = 'touchend'
}

declare global {
    namespace AMap {
        // 事件:
        /** 事件基类 */
        class EventBase {
            /** 类型 */
            type: string
            /** 类名 */
            className: string

            // Function:
            /** 绑定回调 */
            on(
                type: string,
                callback: Function,
                context?: object,
                once?: boolean): void
            /** 解绑回调 */
            off(
                type: string,
                callback: Function,
                context?: object): void
            /** 是否已绑定回调 */
            hasEvents(
                type: string,
                callback: Function,
                context?: object): void
            /** 清除某一类型的全部回调 */
            clearEvents(type: string): void
            /** 触发事件 */
            emit(type: string, data?: object): void
        }

        /** “地图”回调参数 */
        type MapArgs = {
            /** 经纬度 */
            lnglat: LngLat
            /** 像素坐标 */
            pixel: Pixel
            /** 事件类型 */
            type: string
            /** 目标对象 */
            target: object
        }

        /** “地图”回调 */
        type MapCallback = {
            add?: (args: MapArgs) => void
            resize?: (args: MapArgs) => void
            complete?: (args: MapArgs) => void
            click?: (args: MapArgs) => void
            dblclick?: (args: MapArgs) => void
            mapmove?: (args: MapArgs) => void
            hotspotclick?: (args: MapArgs) => void
            hotspotover?: (args: MapArgs) => void
            hotspotout?: (args: MapArgs) => void
            movestart?: (args: MapArgs) => void
            moveend?: (args: MapArgs) => void
            zoomchange?: (args: MapArgs) => void
            zoomstart?: (args: MapArgs) => void
            zoomend?: (args: MapArgs) => void
            rotatechange?: (args: MapArgs) => void
            rotatestart?: (args: MapArgs) => void
            rotateend?: (args: MapArgs) => void
            mousemove?: (args: MapArgs) => void
            mousewheel?: (args: MapArgs) => void
            mouseover?: (args: MapArgs) => void
            mouseout?: (args: MapArgs) => void
            mouseup?: (args: MapArgs) => void
            mousedown?: (args: MapArgs) => void
            rightclick?: (args: MapArgs) => void
            dragstart?: (args: MapArgs) => void
            dragging?: (args: MapArgs) => void
            dragend?: (args: MapArgs) => void
            touchstart?: (args: MapArgs) => void
            touchmove?: (args: MapArgs) => void
            touchend?: (args: MapArgs) => void
        }
    }
}