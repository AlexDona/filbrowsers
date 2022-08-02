<template>
    <div id="minerCharts" class="w-full" style="height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts'
import {getDatas} from '@/utils/method'
import {fetchPowerData} from '@/api/common'

export default {
  data() {
    return {
    }
  },
  methods: {
    init(data) {
      const vm = this
      let chartDom = document.getElementById('minerCharts')
      let chart = echarts.init(chartDom)
      let option
      option = {
        tooltip: {
          trigger: 'item',
          // formatter: '{b}: {c}TiB ({d}%)',
          formatter: (t) => {
            return "".concat(t.marker + t.name, ": ").concat(vm.$utils.unitConversion(t.value, 2, 4, false), "TiB (").concat(t.percent, "%)")
          }
        },
        color: [
          '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272',
          '#fc8452', '#9a60b4', '#ea7ccc','#45C2E0',
          // '#C1EBDD',
          // '#FFC851','#5A5476','#1869A0','#FF9393','#66FF99','#8ec060', '#47A474',
          // '#008D89', '#E6A23C', '#F56C6C',  '#C1232B','#B5C334','#FCCE10',
          // '#FE8463','#9BCA63','#FAD860','#E87C25','#60C0DD','#F3A43B',
        ],
        series: [
          {
            type: 'pie',
            radius: '50%',
            data,
            emptyCircleStyle: {
              color: "rgba(130, 122, 122, 1)"
            },
            // minAngle: 5,
            // labelLine: {
            //   length: 20
            // },
          }
        ]
      }
      option && chart.setOption(option);
      window.onresize = function () {
        chart.resize();
      }
    },
    getPowerData() {
      getDatas.call(this, fetchPowerData({page: 0, page_size: 30})).then(res => {
        if (res.data) {
          let other = 0
          res.data.list && res.data.list.map((item, index) => {
            if (index < 10) {
              const { effectivePower, storageProvider } = item
              item.value = effectivePower
              item.name = storageProvider
              other = other + Number(effectivePower)
              return item
            }
          })
          const _other = res.data?.totalPower -  other
          res.data.list.push({value: _other, name: 'other', storageProvider: 'other'})
          this.init(res.data.list)
        }
      })
    },
  },
  mounted() {
    this.getPowerData()
  }
}
</script>

<style>
</style>
