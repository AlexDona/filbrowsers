<template>
  <ve-line
      v-loading="loading"
      :data-empty="dataEmpty"
      :extend="percentExtend"
      :data="lineData"
      :legend-visible="legendVisible"
      :settings="lineSettings"></ve-line>
</template>

<script>
import 'v-charts/lib/style.css'
import { qurryAccountPowerVariety } from '@/api/common'
import {getDatas} from "@/utils/method";
export default {
  name: "chartsPower",
  props: {
    legendVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    account: {
      type: String,
      default: ""
    }
  },
  data() {
    this.lineSettings = {
      xAxisType: 'category',
    }
    this.percentExtend = {
      // X轴自定义
      xAxis: {
        axisLabel: {
          show: true,
          formatter: (val) => {
            return val
          }
        }
      },
      // Y轴自定义
      yAxis: {
        axisLabel: {
          show: true,
          formatter: (val) => {
            return this.$XEUils.commafy(val) + ' TiB'
          }
        }
      },
      // tip浮层自定义
      tooltip: {
        trigger: "axis",
        show: true,
        formatter: (v) => {
          let result = ''
          v.forEach((item, index) => {
            if (item.data) {
              result +=
                  item.marker +
                  item.seriesName + '：' +  item.data[1] + ' TiB' +
                  '<br/>'
            }
          })
          return result
        }
      },
      series(arr) {
        arr.forEach((item, index) => {
          if (index === 1) {
            item.type = 'bar'
            item. barMinHeight = 1
          }
        })
        return arr
      },
      legend: {
        data: ['有效算力', '有效算力增量']
      },
    }
    return {
      dataEmpty: false,
      loading: true,
      lineData: {
        columns: ['timestamp', '有效算力', '有效算力增量'],
        rows: []
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData() {
      getDatas.call(this, qurryAccountPowerVariety({account: this.account}), 'loading').then(res => {
        if (res.data) {
          this.lineData.rows = res.data.map(item => {
            return {
              timestamp: this.$moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
              '有效算力': +this.$utils.unitConversion(item.rawBytePower, 0, 4).split(' ')[0], // 转换单位TiB
              '有效算力增量': +this.$utils.unitConversion(item.rawBytePowerDelta, 0, 4).split(' ')[0] // 转换单位TiB
            }
          })
        } else {
          this.dataEmpty = true
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>