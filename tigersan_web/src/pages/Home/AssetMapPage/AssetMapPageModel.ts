import { MapModel } from "@/models"

export const map = new MapModel()
map._onInit = () => {
    const points: AMap.LngLatLike[] = [
        [108.939621, 34.343147],
        [111.0, 23.0],
        [112.985037, 23.15046],
    ]

    map.InitCluster(points, {})
}