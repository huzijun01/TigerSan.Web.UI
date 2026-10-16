<template>
  <PageCard>
    <div class="charts flex-around">
      <EChart :model="line" />
      <EChart :model="pie" />
      <EChart :model="scatter" />
    </div>
  </PageCard>
</template>

<script lang="ts" setup>
import { PageCard, EChart, ChartModel } from '../../../packages'
const line = new ChartModel()
line._initOpts = { width: 500, height: 300 }
line.RootStyle.value = { width: '500px' }
line._onInitBase = line => {
  line.setOption({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  })
}

const pie = new ChartModel()
pie._initOpts = { width: 500, height: 300 }
pie.RootStyle.value = { width: '500px' }
pie._onInitBase = pie => {
  pie.setOption({
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

const scatter = new ChartModel()
scatter._initOpts = { width: 500, height: 300 }
scatter.RootStyle.value = { width: '500px' }
scatter._onInitBase = scatter => {
  scatter.setOption({
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68]
        ],
        type: 'scatter'
      }
    ]
  })
}
</script>

<style lang="less" scoped>
.charts{
  flex-wrap: wrap;
}
</style>