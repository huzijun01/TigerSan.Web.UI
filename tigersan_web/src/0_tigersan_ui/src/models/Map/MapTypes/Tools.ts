export enum PolygonEditorEvent {
    /** 添加节点。（args: PolygonEditorArgs） */
    addnode = 'addnode',
    /** 移除节点。（args: PolygonEditorArgs） */
    removenode = 'removenode',
    /** 调整。（args: PolygonEditorArgs） */
    adjust = 'adjust',
    /** 移动。（args: PolygonEditorArgs） */
    move = 'move',
    /** 添加。（target: Polygon） */
    add = 'add',
    /** 结束编辑。（target: Polygon） */
    end = 'end',
}

declare global {
    namespace AMap {
        /** “多边形”编辑器 */
        class PolygonEditor extends EventBase {
            constructor(map: Map, polygon?: Polygon, opts?: PolygonEditorOptions)

            /** 开始编辑 */
            open(): void
            /** 结束编辑 */
            close(): void
            /** 设置“编辑对象” */
            setTarget(overlay: Polygon): void
            /** 获取“编辑对象” */
            getTarget(): Polygon | undefined
            /** 设置“吸附多边形” */
            setAdsorbPolygons(list: Polygon | Polygon[]): void
            /** 添加“吸附多边形” */
            addAdsorbPolygons(list: Polygon | Polygon[]): void
            /** 添加“吸附多边形” */
            removeAdsorbPolygons(list: Polygon | Polygon[]): void
            /** 移除“吸附多边形” */
            clearAdsorbPolygons(): void
        }

        /** “多边形”编辑器配置 */
        type PolygonEditorOptions = {
            /** 样式 */
            createOptions?: object
            /** 编辑样式 */
            editOptions?: object
            /** 顶点样式 */
            controlPoint?: CircleMarkerOptions
            /** 中间点样式 */
            midControlPoint?: CircleMarkerOptions
        }

        /** “多边形”编辑器回调参数 */
        type PolygonEditorArgs = {
            target: AMap.Polygon,
            lnglat: AMap.LngLat,
            pixel: AMap.Pixel
        }

        /** “多边形”编辑器结束回调参数 */
        type PolygonEditorEndArgs = {
            target: AMap.Polygon,
        }
    }
}
