import "./MapTypes"
import AMapLoader from "@amap/amap-jsapi-loader"
import ClusterMarker from '../../components/Map/ClusterMarker.vue'
import { ref, shallowRef, watch, type Ref } from "vue"
import type { ActionAsync } from "../../types"
import { MapPlugins } from "./MapTypes/MapPlugins"
import { ComponentHelper } from "../../helpers"
import { ClusterMarkerModel } from "./ClusterMarkerModel"
import { MapEvents, DataOptions, MapStyle } from "./MapTypes"

export class MapModel<TData> {
    //#region 【Fields】
    /** 应用秘钥 */
    static _appKey: string = ''
    /** “插件”集合 */
    static _plugins?: string[]
    /** 地图容器 */
    readonly refContainer = shallowRef<HTMLDivElement>()
    /** “标记数据”映射 */
    _markerDataMap = new Map<AMap.Marker, TData>
    /** 地图实例 */
    _map?: AMap.Map
    /** 配置 */
    _opts?: AMap.MapOptions
    /** 标记聚合 */
    _cluster?: AMap.MarkerCluster
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
    IsDark = ref<boolean>()
    //#endregion 【Ctor】

    //#region 【Ctor】
    constructor(opts?: AMap.MapOptions, isDark?: Ref<boolean>) {
        this._opts = opts
        if (isDark) this.IsDark = isDark
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
    static GetBounds(lnglats: AMap.LngLat[]): AMap.Bounds {
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
    static RenderMarker(context: AMap.RenderClusterMarkerObject) {
        const content = '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>';
        const offset = new AMap.Pixel(-9, -9);
        context.marker.setContent(content)
        context.marker.setOffset(offset)
    }

    /** 渲染“标记聚合” */
    static RenderClusterMarker(count: number, context: AMap.RenderClusterMarkerObject) {
        const model = new ClusterMarkerModel({
            count: context.count,
            totalCount: count
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

    /** 初始化 */
    readonly InitAsync = async (opts?: AMap.MapOptions) => {
        if (!window.AMap) {
            console.warn('The AMap has not been loaded. Please call LoadAsync first!')
            return
        }

        if (!this.refContainer.value) {
            console.warn('The Container is undefined!')
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

        this._onInit?.()
        await this._onInitAsync?.()
    }

    /** 初始化"标记聚合" */
    readonly InitClusterAsync = async (points: AMap.LngLatLike[], options?: AMap.MarkerClusterOptions) => {
        if (!await MapModel.LoadPluginAsync([MapPlugins.MarkerCluster])) return

        if (!this._map) {
            console.warn('The _map is undefined!')
            return
        }

        if (points.length === 0) return

        const markers = MapModel.GetMarkers(points)

        const count = markers.length

        this._cluster = new AMap.MarkerCluster(this._map, markers, {
            renderMarker: MapModel.RenderMarker,
            renderClusterMarker: (c: any) => MapModel.RenderClusterMarker(count, c),
            ...options
        })
        this._cluster.on(MapEvents.click, e => {
            this.ZoomByClusterData(e.clusterData)
        })
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

    /** 缩放到 */
    readonly ZoomTo = (lnglat: AMap.LngLat, zoom?: number) => {
        this._map?.setZoomAndCenter(zoom ?? 10, lnglat)
    }

    /** 根据“集群数据”缩放 */
    readonly ZoomByClusterData = (clusterData: DataOptions[], padding: number = 60) => {
        if (!this._map) return
        const lnglats = clusterData.map(c => c.lnglat as AMap.LngLat)
        const bounds = MapModel.GetBounds(lnglats)
        const zoomCenter = this._map.getFitZoomAndCenterByBounds(bounds, [padding, padding, padding, padding])
        this._map.setZoomAndCenter(zoomCenter[0], zoomCenter[1])
    }

    /** 根据“经纬度”缩放 */
    readonly ZoomByLngLat = (lnglat: AMap.LngLat, zoom: number = 20) => {
        if (!this._map) return
        this._map.setZoomAndCenter(zoom, lnglat)
    }

    /** 根据“向量”缩放 */
    readonly ZoomByVector2 = (point: AMap.Vector2, zoom: number = 20) => {
        if (!this._map) return
        this._map.setZoomAndCenter(zoom, new AMap.LngLat(point[0], point[1]))
    }
    //#endregion 【Functions】
}