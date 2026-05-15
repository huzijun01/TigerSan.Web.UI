import "@amap/amap-jsapi-types"
import AMapLoader from "@amap/amap-jsapi-loader"
import { nanoid } from "nanoid"
import { shallowRef } from "vue"

declare global {
    interface Window {
        _AMapSecurityConfig: any
    }
}

export class MapModel {
    static _securityKey: string = ''
    static _appKey: string = ''
    readonly _id = `map-container${nanoid()}`
    readonly refContainer = shallowRef<HTMLDivElement>()
    _map?: AMap.Map
    _opts?: AMap.MapOptions

    constructor(opts?: AMap.MapOptions) {
        this._opts = opts
    }

    /** 加载地图组件 */
    static readonly LoadAsync = async (
        securityKey: string,
        appKey: string,
        plugins?: string[]) => {
        MapModel._securityKey = securityKey
        MapModel._appKey = appKey

        await AMapLoader.load({
            key: MapModel._appKey,
            version: "2.0",
            plugins,
        }).catch((e) => {
            console.error(e)
        })
    }

    /** 初始化 */
    readonly Init = (opts?: AMap.MapOptions) => {
        if (opts) this._opts = opts

        if (!window.AMap) {
            console.warn('The AMap has not been loaded. Please call LoadAsync first!')
            return
        }

        if (!this.refContainer.value) {
            console.warn('The Container is undefined!')
            return
        }

        this._map = new AMap.Map(this.refContainer.value, this._opts)

        window._AMapSecurityConfig = {
            securityJsCode: MapModel._securityKey,
        }
    }
}