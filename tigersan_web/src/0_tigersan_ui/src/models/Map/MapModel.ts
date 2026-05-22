import "./MapTypes"
import AMapLoader from "@amap/amap-jsapi-loader"
import Marker from '../../components/Map/Marker.vue'
import ClusterMarker from '../../components/Map/ClusterMarker.vue'
import { shallowRef, watch, type Component } from "vue"
import { MarkerModel } from "./MarkerModel"
import type { ActionAsync } from "../../types"
import { MapPlugins } from "./MapTypes/MapPlugins"
import { ClusterMarkerModel } from "./ClusterMarkerModel"
import { ComponentHelper, ThemeHelper } from "../../helpers"
import { MapEvents, DataOptions, MapStyle } from "./MapTypes"

/** “经纬度数据”模型 */
export class LnglatData<TData> {
    lnglat: AMap.LngLatLike
    data?: TData
    info?: Component
    infoModel?: any
    onClick?: (data?: TData) => void

    constructor(lnglat: AMap.LngLatLike, data?: TData) {
        this.lnglat = lnglat
        this.data = data
    }
}

/** “地图”模型 */
export class MapModel<TData> {
    //#region 【Fields】
    /** 应用秘钥 */
    static _appKey: string = ''
    /** “插件”集合 */
    static _plugins?: string[]
    /** 地图容器 */
    readonly refContainer = shallowRef<HTMLDivElement>()
    /** “标记数据”映射 */
    readonly _markerDataMap = new Map<DataOptions, LnglatData<TData>>()
    /** 地图实例 */
    _map?: AMap.Map
    /** 配置 */
    _opts?: AMap.MapOptions
    /** 标记聚合 */
    _cluster?: AMap.MarkerCluster
    /** “多边形”编辑器 */
    _polygonEditor?: AMap.PolygonEditor
    /** 初始化前 */
    _beforeInit?: Function
    /** 初始化前（异步） */
    _beforeInitAsync?: ActionAsync
    /** 初始化后 */
    _onInit?: Function
    /** 初始化后（异步） */
    _onInitAsync?: ActionAsync
    //#endregion 【Fields】

    //#region 【Properties】
    /** 是否为“黑暗模式” */
    IsDark = ThemeHelper.IsDark
    //#endregion 【Ctor】

    //#region 【Ctor】
    constructor(opts?: AMap.MapOptions) {
        this._opts = opts
        watch(this.IsDark, this.UpdateMapStyle)
    }
    //#endregion 【Ctor】

    //#region 【Functions】
    //#region [static]
    /** 加载地图组件 */
    static async LoadAsync(
        secretKey: string,
        appKey: string,
        plugins?: string[]) {
        MapModel._appKey = appKey
        MapModel._plugins = plugins
        window._AMapSecurityConfig = { securityJsCode: secretKey }
        await AMapLoader.load({
            key: MapModel._appKey,
            version: "2.0",
            plugins: MapModel._plugins
        }).catch((e) => {
            console.error(e)
        })
    }

    /** 获取“标记”集合 */
    static GetMarkers(points: AMap.LngLatLike[]): DataOptions[] {
        const markers: DataOptions[] = []

        points.forEach(point => {
            markers.push(new DataOptions(point))
        })

        return markers
    }

    /** 加载插件 */
    static async LoadPluginAsync(pluginNames: MapPlugins[], callback?: Function): Promise<boolean> {
        if (!MapModel._plugins) {
            MapModel._plugins = []
        }

        for (let index = 0; index < pluginNames.length; index++) {
            const pluginName = pluginNames[index] as string

            if (MapModel._plugins.includes(pluginName)) {
                callback?.()
                continue
            }

            try {
                await new Promise<void>((resolve, reject) => {
                    AMap.plugin(pluginName, () => {
                        resolve()
                    })
                })

                MapModel._plugins.push(pluginName)
                callback?.()
            } catch (error) {
                console.error(`Failed to load plugin "${pluginName}":`, error)
                return false
            }
        }

        return true
    }

    /** 获取"缩放比例" */
    static GetZoom(shopinfo: string): number {
        if (shopinfo === '2') return 10 // 大型设施（城市、机场、火车站）
        if (shopinfo === '1') return 15 // 中型设施（影院等）
        if (shopinfo === '0') return 20 // 省级地名，大范围
        else return 10 // 省级地名，大范围
    }

    /** 获取"地址查询" */
    static async GetPlaceSearchAsync(callback: (res: AMap.SearchResult) => void) {
        if (!await MapModel.LoadPluginAsync([MapPlugins.PlaceSearch])) return undefined

        const placeSearch = new AMap.PlaceSearch({})
        if (callback) {
            placeSearch.on('complete', callback)
            placeSearch.on('error', callback)
        }

        return placeSearch
    }

    /** 获取"范围" */
    static GetBounds(lnglats: AMap.LngLat[]): AMap.Bounds | undefined {
        if (lnglats.length < 1) return undefined
        const lngs = lnglats.map(i => i.lng)
        const lats = lnglats.map(i => i.lat)
        const minLng = Math.min(...lngs)
        const maxLng = Math.max(...lngs)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const southWest = new AMap.LngLat(minLng, minLat)
        const northEast = new AMap.LngLat(maxLng, maxLat)
        return new AMap.Bounds(southWest, northEast)
    }

    /** 渲染“标记” */
    static RenderMarker(context: AMap.RenderMarkerObject, map: MapModel<any>) {
        const model = new MarkerModel()
        const cd = context.data[0]
        if (cd) {
            const opts = map._markerDataMap.get(cd)
            if (opts) {
                model.data = opts
                model.info = opts.info
                model.infoModel = opts.infoModel
            }
        }

        const marker = ComponentHelper.GetElement(Marker, { model })
        if (!marker) {
            console.log('The marker is undefined!')
            return
        }
        context.marker.setOffset(new AMap.Pixel(MarkerModel.offset, MarkerModel.offset))
        context.marker.setContent(marker as HTMLElement)
    }

    /** 渲染“标记聚合” */
    static RenderClusterMarker(context: AMap.RenderClusterMarkerObject, totalCount: number) {
        const model = new ClusterMarkerModel({
            count: context.count,
            totalCount: totalCount
        })
        const marker = ComponentHelper.GetElement(ClusterMarker, { model })
        if (!marker) {
            console.log('The marker is undefined!')
            return
        }
        context.marker.setOffset(new AMap.Pixel(model.offset, model.offset))
        context.marker.setContent(marker as HTMLElement)
    }
    //#endregion [static]

    //#region [Map]
    /** 初始化 */
    readonly InitAsync = async (opts?: AMap.MapOptions) => {
        if (!window.AMap) {
            console.warn('The AMap has not been loaded. Please call LoadAsync first!')
            return
        }

        if (!this.refContainer.value) {
            console.warn('The refContainer is undefined!')
            return
        }

        this._beforeInit?.()
        await this._beforeInitAsync?.()

        if (opts) this._opts = opts

        const opts1: AMap.MapOptions = {
            center: [104.937478, 35.439575],
            zoom: 5,
            ...this._opts
        }

        if (!opts1.mapStyle) {
            opts1.mapStyle = this.IsDark.value ? MapStyle.grey : undefined
        }

        this._map = new AMap.Map(this.refContainer.value, opts1)
        this._cluster = undefined
        this._polygonEditor = undefined

        this._onInit?.()
        await this._onInitAsync?.()
    }

    /** 更新"地图样式" */
    readonly UpdateMapStyle = () => {
        if (!this._map) return
        if (this._opts && this._opts.mapStyle) {
            this._map.setMapStyle(this._opts.mapStyle)
            return
        }

        this._map.setMapStyle(this.IsDark.value ? MapStyle.grey : MapStyle.normal)
    }
    //#endregion [Map]

    //#endregion [Tool]
    /** 初始化"标记聚合" */
    readonly InitClusterAsync = async (lnglatDatas: LnglatData<TData>[], options?: AMap.MarkerClusterOptions) => {
        if (!await MapModel.LoadPluginAsync([MapPlugins.MarkerCluster])) return

        if (!this._map) {
            console.warn('The _map is undefined!')
            return
        }

        const arrOpts: DataOptions[] = []
        this._markerDataMap.clear()

        lnglatDatas.forEach(lnglatData => {
            const opts = new DataOptions(lnglatData.lnglat)
            arrOpts.push(opts)
            this._markerDataMap.set(opts, lnglatData)
        })

        this._cluster = new AMap.MarkerCluster(this._map, arrOpts, {
            renderMarker: m => MapModel.RenderMarker(m, this),
            renderClusterMarker: c => MapModel.RenderClusterMarker(c, arrOpts.length),
            ...options
        })
        this._cluster.on(MapEvents.click, (e: AMap.MarkerClusterArgs) => {
            this.ZoomByClusterData(e.clusterData)
            const cd = e.clusterData[0]
            if (cd) {
                const opts = this._markerDataMap.get(cd)
                if (opts && opts.onClick) {
                    opts.onClick(opts.data)
                }
            }
        })
    }

    /** 获取“多边形编辑器” */
    readonly GetPolygonEditorAsync = async () => {
        if (!this._map) {
            console.warn('The _map is undefined!')
            return
        }

        if (!await MapModel.LoadPluginAsync([MapPlugins.PolygonEditor])) return

        if (!this._polygonEditor) {
            this._polygonEditor = new AMap.PolygonEditor(this._map)
        }

        return this._polygonEditor
    }
    //#endregion [Tool]

    //#region [Zoom]
    /** 缩放到 */
    readonly ZoomTo = (lnglat: AMap.LngLat, zoom?: number) => {
        this._map?.setZoomAndCenter(zoom ?? 10, lnglat)
    }

    /** 根据“经纬度”缩放 */
    readonly ZoomByLngLat = (lnglat: AMap.LngLat, zoom: number = 20) => {
        if (!this._map) return
        this._map.setZoomAndCenter(zoom, lnglat)
    }

    /** 根据“向量”缩放 */
    readonly ZoomByVector2 = (vector: AMap.Vector2, zoom: number = 20) => {
        if (!this._map) return
        this._map.setZoomAndCenter(zoom, new AMap.LngLat(vector[0], vector[1]))
    }

    /** 根据“经纬度集合”缩放 */
    readonly ZoomByLngLats = (lnglats: AMap.LngLat[], padding: number = 60) => {
        if (!this._map) return
        const bounds = MapModel.GetBounds(lnglats)
        if (!bounds) return
        const zoomCenter = this._map.getFitZoomAndCenterByBounds(bounds, [padding, padding, padding, padding])
        this._map.setZoomAndCenter(zoomCenter[0], zoomCenter[1])
    }

    /** 根据“向量集合”缩放 */
    readonly ZoomByVector2s = (vectors: AMap.Vector2[], padding: number = 60) => {
        if (!this._map) return
        const lnglats = vectors.map(v => new AMap.LngLat(v[0], v[1]))
        this.ZoomByLngLats(lnglats, padding)
    }

    /** 根据“多个向量集合”缩放 */
    readonly ZoomByMultiVector2s = (arrVectors: AMap.Vector2[][], padding: number = 60) => {
        if (!this._map) return
        const vectors: AMap.Vector2[] = []
        arrVectors.forEach(v => vectors.push(...v))
        this.ZoomByVector2s(vectors, padding)
    }

    /** 根据“集群数据”缩放 */
    readonly ZoomByClusterData = (clusterData: DataOptions[], padding: number = 60) => {
        if (!this._map) return
        const lnglats = clusterData.map(c => c.lnglat as AMap.LngLat)
        this.ZoomByLngLats(lnglats, padding)
    }
    //#endregion [Zoom]
    //#endregion 【Functions】
}