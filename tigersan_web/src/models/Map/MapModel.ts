import "amap-jsapi-v2-types"
import AMapLoader from "@amap/amap-jsapi-loader"
import { nanoid } from "nanoid"
import { shallowRef } from "vue"
import { MapPlugins } from "./MapPlugins"
import type { _MarkerClustererOptions, RenderClusterMarkerObject } from "@vuemap/amap-jsapi-types/plugins/MarkerClusterer"

export class Marker {
    lnglat: AMap.LngLatLike

    constructor(lnglat: AMap.LngLatLike) {
        this.lnglat = lnglat
    }
}

export class MapModel {
    static _appKey: string = ''
    static _plugins?: string[]
    readonly _id = `map-container${nanoid()}`
    readonly refContainer = shallowRef<HTMLDivElement>()
    _map?: AMap.Map
    _opts?: AMap.MapOptions
    _cluster?: AMap.MarkerCluster
    _onInit?: Function

    constructor(opts?: AMap.MapOptions) {
        this._opts = opts
    }

    /** 加载地图组件 */
    static readonly LoadAsync = async (
        appKey: string,
        plugins?: string[]) => {
        MapModel._appKey = appKey
        MapModel._plugins = plugins

        await AMapLoader.load({
            key: MapModel._appKey,
            version: "2.0",
            plugins: MapModel._plugins
        }).catch((e) => {
            console.error(e)
        })
    }

    /** 获取“标记”集合 */
    static readonly GetMarkers = (points: AMap.LngLatLike[]): Marker[] => {
        const markers: Marker[] = []

        points.forEach(point => {
            markers.push(new Marker(point))
        })

        return markers
    }

    /** 加载插件 */
    private static LoadPlugin(pluginNames: MapPlugins[], callback?: Function): void {
        if (!MapModel._plugins) {
            MapModel._plugins = []
        }

        for (let index = 0; index < pluginNames.length; index++) {
            const pluginName = pluginNames[index] as string

            if (MapModel._plugins.includes(pluginName)) {
                callback?.()
            }
            else {
                console.log(`Plugin "${pluginName}" is not loaded. Attempting to load...`)

                try {
                    // 使用 AMap.plugin 动态加载
                    AMap.plugin(pluginName, () => {
                        console.log(`Plugin "${pluginName}" loaded successfully`)
                        callback?.()
                    })
                    MapModel._plugins.push(pluginName)
                } catch (error) {
                    console.error(`Failed to load plugin "${pluginName}":`, error)
                    throw error
                }
            }
        }
    }

    /** 初始化 */
    readonly Init = (opts?: AMap.MapOptions) => {
        this._opts = opts ?? {
            center: [104.937478, 35.439575],
            zoom: 5
        }

        if (!window.AMap) {
            console.warn('The AMap has not been loaded. Please call LoadAsync first!')
            return
        }

        if (!this.refContainer.value) {
            console.warn('The Container is undefined!')
            return
        }

        this._map = new AMap.Map(this.refContainer.value, this._opts)
        this._onInit?.()
    }

    /** 初始化"标记集群" */
    readonly InitCluster = (points: AMap.LngLatLike[], options: _MarkerClustererOptions) => {
        MapModel.LoadPlugin([MapPlugins.MarkerCluster], () => {
            if (!this._map) {
                console.warn('The _map is undefined!')
                return
            }

            const markers = MapModel.GetMarkers(points)

            if (markers.length === 0) {
                console.warn('No markers provided!')
                return
            }

            var count = markers.length;

            // 集群标记:
            var _renderClusterMarker = function (context: RenderClusterMarkerObject) {
                var factor = Math.pow(context.count / count, 1 / 18);
                var div = document.createElement('div');
                var Hue = 180 - factor * 180;
                var bgColor = 'hsla(' + Hue + ',100%,40%,0.7)';
                var fontColor = 'hsla(' + Hue + ',100%,90%,1)';
                var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                var shadowColor = 'hsla(' + Hue + ',100%,90%,1)';
                div.style.backgroundColor = bgColor;
                var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                div.style.width = div.style.height = size + 'px';
                div.style.border = 'solid 1px ' + borderColor;
                div.style.borderRadius = size / 2 + 'px';
                div.style.boxShadow = '0 0 5px ' + shadowColor;
                div.innerHTML = context.count.toString();
                div.style.lineHeight = size + 'px';
                div.style.color = fontColor;
                div.style.fontSize = '14px';
                div.style.textAlign = 'center';
                context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
                context.marker.setContent(div)
            }

            // 标记:
            var _renderMarker = function (context: RenderClusterMarkerObject) {
                var content = '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>';
                var offset = new AMap.Pixel(-9, -9);
                context.marker.setContent(content)
                context.marker.setOffset(offset)
            }

            this._cluster = new AMap.MarkerCluster(this._map, markers, {
                zoomOnClick: true,
                renderClusterMarker: _renderClusterMarker,
                renderMarker: _renderMarker,
                ...options
            })
        })
    }
}