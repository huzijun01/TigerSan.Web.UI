/** 地图事件 */
export enum MapEvents {
    add = 'add',
    resize = 'resize',
    complete = 'complete',
    click = 'click',
    dblclick = 'dblclick',
    mapmove = 'mapmove',
    hotspotclick = 'hotspotclick',
    hotspotover = 'hotspotover',
    hotspotout = 'hotspotout',
    movestart = 'movestart',
    moveend = 'moveend',
    zoomchange = 'zoomchange',
    zoomstart = 'zoomstart',
    zoomend = 'zoomend',
    rotatechange = 'rotatechange',
    rotatestart = 'rotatestart',
    rotateend = 'rotateend',
    mousemove = 'mousemove',
    mousewheel = 'mousewheel',
    mouseover = 'mouseover',
    mouseout = 'mouseout',
    mouseup = 'mouseup',
    mousedown = 'mousedown',
    rightclick = 'rightclick',
    dragstart = 'dragstart',
    dragging = 'dragging',
    dragend = 'dragend',
    touchstart = 'touchstart',
    touchmove = 'touchmove',
    touchend = 'touchend',
}

/** 切片图层事件 */
export enum TileLayerEvent {
    /** 加载完成 */
    complete = 'complete',
}

declare global {
    namespace AMap {
        // 事件:
        /** 事件基类 */
        class EventBase {
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
        type MapsArgs = {
            /** 经纬度 */
            lnglat: LngLat
            /** 像素坐标 */
            pixel: Pixel
            /** 事件类型 */
            type: string
            /** 目标对象 */
            target: object
        }
    }
}