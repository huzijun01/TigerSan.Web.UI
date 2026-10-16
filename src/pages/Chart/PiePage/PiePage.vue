<template>
  <PageCard>
    <Pie :model="pie" />
  </PageCard>
</template>

<script lang="ts" setup>
import { PageCard, Pie, PieModel, Texts, Colors } from '../../../packages'
const pie = new PieModel([
  {
    Name: Texts.NoRecord,
    Color: Colors.Blue,
    getValue: () => 10
  },
  {
    Name: Texts.Inbound,
    Color: Colors.Yellow,
    getValue: () => 15
  },
  {
    Name: Texts.InStore,
    Color: Colors.Green,
    getValue: () => 20
  },
  {
    Name: Texts.Stolid,
    Color: Colors.Orange,
    getValue: () => 25
  },
  {
    Name: Texts.Outbound,
    Color: Colors.Info,
    getValue: () => 30
  },
  {
    Name: Texts.InTransit,
    Color: Colors.Brand,
    getValue: () => 35
  },
  {
    Name: Texts.Timeout,
    Color: Colors.Red,
    getValue: () => 40
  },
])
pie.Height.value = 300
pie.Title.value = Texts.AssetState
</script>

<style lang="less" scoped></style>