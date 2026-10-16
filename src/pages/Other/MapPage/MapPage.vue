<template>
  <PageCard>
    <Map :model="map" />
  </PageCard>
</template>

<script lang="ts" setup>
import { PageCard, Map, MapModel } from '../../../packages'

const map = new MapModel()
map._onInitAsync = async () => {
  await map.InitPolygonEditorAsync()
  map.AddEvent({
    click: args => {
      if (map.IsEditing.value) return
      const polygons = map.GetPolygons()
      if (!polygons || polygons.length < 1) {
        map.SetMarker(args.lnglat)
        return
      }

      for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i] as AMap.Polygon
        if (!polygon.contains(args.lnglat)) {
          map.SetMarker(args.lnglat)
          return
        }
      }
    },
    rightclick: () => {
      map.RemoveMarker()
    },
  })
}
</script>

<style lang="less" scoped>
.loading {
  flex-direction: column;
}
</style>