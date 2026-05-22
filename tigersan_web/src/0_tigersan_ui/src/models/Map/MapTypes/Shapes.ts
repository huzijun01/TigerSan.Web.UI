declare global {
    namespace AMap {
        /** 多边形 */
        class Polygon extends EventBase {
            // Ctor:
            constructor(opts?: PolygonOptions)

            // Function:
            /** 隐藏 */
            hide(): void
            /** 显示 */
            show(): void
            /** 销毁 */
            destroy(): void
            /** 是否“包含” */
            contains(originPoint: LngLatLike): boolean

            /** 获取“自定义数据” */
            getExtData(): object
            /** 设置“自定义数据” */
            setExtData(extData: object): void

            /** 获取“配置” */
            getOptions(): PolygonOptions
            /** 设置“配置” */
            setOptions(opts: PolygonOptions): void

            /** 获取“路径” */
            getPath(): LngLatLike[] | LngLatLike[][] | LngLatLike[][][]
            /** 设置“路径” */
            setPath(path: LngLatLike[] | LngLatLike[][] | LngLatLike[][][]): void

            /** 获取“高度” */
            getExtrusionHeight(): number
            /** 设置“高度” */
            setExtrusionHeight(extrusionHeight: number): void

            /** 获取“范围” */
            getBounds(): Bounds
            /** 获取“面积”（米）
             * @param isTerrain - 是否基于地形。默认值：false */
            getArea(isTerrain: boolean): number

            /** 获取“海拔高度” */
            getPlaneHeight(): number
            /** 设置“海拔高度” */
            setPlaneHeight(height: number): void
        }

        /** “多边形”配置 */
        type PolygonOptions = {
            /** 路径（普通多边形 | 单个带孔多边形 | 多个带孔多边形） */
            path?: LngLatLike[] | LngLatLike[][] | LngLatLike[][][]
            /** Z轴层级。默认值：10 */
            zIndex?: number
            /** 是否“冒泡”。默认值：false */
            bubble?: boolean
            /** 光标样式 */
            cursor?: string
            /** 线条颜色。默认值：#00D3FC */
            strokeColor?: string
            /** 线条透明度。默认值：0.9 */
            strokeOpacity?: number
            /** 填充色 */
            fillColor?: string
            /** 填充透明度 */
            fillOpacity?: number
            /** 是否“可拖动”。默认值：false */
            draggable?: boolean
            /** 海拔高度。默认值：0 */
            height?: number
            /** 高度。默认值：0 */
            extrusionHeight?: number
            /** 侧面颜色 */
            wallColor?: string
            /** 顶面颜色 */
            roofColor?: string
            /** 自定义数据 */
            extData?: object
            /** 线条样式。默认值：solid */
            strokeStyle?: 'solid' | 'dashed'
            /** 虚线间隙数组 */
            strokeDasharray?: [number, number] | [number, number, number]
        }

        /** 折线 */
        class Polyline extends EventBase {
            // Ctor:
            constructor(opts?: PolylineOptions)

            // Function:
        }

        /** “折线”配置 */
        type PolylineOptions = {
        }

        /** 贝塞尔曲线 */
        class BezierCurve extends EventBase {
            // Ctor:
            constructor(opts?: BezierCurveOptions)

            // Function:
        }

        /** “贝塞尔曲线”配置 */
        type BezierCurveOptions = {
        }

        /** 圆 */
        class Circle extends EventBase {
            // Ctor:
            constructor(opts?: CircleOptions)

            // Function:
        }

        /** “圆”配置 */
        type CircleOptions = {
        }

        /** 圆标记 */
        class CircleMarker extends EventBase {
            // Ctor:
            constructor(opts?: CircleMarkerOptions)

            // Function:
        }

        /** “圆标记”配置 */
        type CircleMarkerOptions = {
        }

        /** 椭圆 */
        class Ellipse extends EventBase {
            // Ctor:
            constructor(opts?: EllipseOptions)

            // Function:
        }

        /** “椭圆”配置 */
        type EllipseOptions = {
        }

        /** 矩形 */
        class Rectangle extends EventBase {
            // Ctor:
            constructor(opts?: RectangleOptions)

            // Function:
        }

        /** “矩形”配置 */
        type RectangleOptions = {
        }

        /** GeoJSON */
        class GeoJSON extends EventBase {
            // Ctor:
            constructor(opts?: GeoJSONOptions)

            // Function:
        }

        /** “GeoJSON”配置 */
        type GeoJSONOptions = {
        }
    }
}
