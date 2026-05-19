import type { DataOptions } from "./Markers"

/** 地图事件 */
export enum MapEvents {
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
                type: MapEvents,
                callback: (e: MapsEvent) => void,
                context?: object,
                once?: boolean): void
            /** 解绑回调 */
            off(
                type: MapEvents,
                callback: (e: MapsEvent) => void,
                context?: object): void
            /** 是否已绑定回调 */
            hasEvents(
                type: MapEvents,
                callback: (e: MapsEvent) => void,
                context?: object): void
            /** 清除某一类型的全部回调 */
            clearEvents(type: MapEvents): void
            /** 触发事件 */
            emit(type: MapEvents, data?: object): void
        }

        /** 地图事件对象 */
        class MapsEvent {
            /** 经纬度 */
            lnglat: LngLat
            /** 像素坐标 */
            pixel: Pixel
            /** 事件类型 */
            type: string
            /** 目标对象 */
            target: object

            // 附加:
            /** 聚合 */
            cluster: DataCluster
            /** 聚合数据 */
            clusterData: DataOptions[]
            /** 标记 */
            marker: Marker
        }
    }
}