<template>
  <ve-line
      v-loading="loading"
      :extend="percentExtend"
      :data="lineData"
      :after-config="afterConfig"
      :legend-visible="legendVisible"
      :settings="lineSettings"></ve-line>
</template>

<script>
import { qurryStatsPower } from '@/api/common'
import {getDatas} from "@/utils/method";
export default {
  name: "lineCharts",
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
      axisSite: {
        left: ['全网算力'],
        right: ['算力增量']
      }
    }
    let that = this
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
      // yAxis(arr) {
      //   arr.forEach((item, index) => {
      //     if (index === 0) {
      //       item.formatter = val => {
      //         console.log(val, that.$utils.unitConversion(val, 0, 7))
      //         return that.$utils.unitConversion(val, 0, 7)
      //       }
      //     }
      //     if (index === 1) {
      //       item.formatter= val => {
      //         console.log(val)
      //         return that.$utils.unitConversion(val, 0, 6)
      //       }
      //     }
      //   })
      // },
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
                  item.seriesName + '：' +  item.data[1] + (index === 0 ? ' Eib' : ' Pib') +
                  '<br/>'
            }
          })
          return v[0].data[0] + '<br/>' +result
        }
      },
      legend: {
        data: ['全网算力', '算力增量']
      }
    }
    return {
      dataEmpty: false,
      loading: true,
      lineData: {
        columns: ['timestamp', '全网算力', '算力增量'],
        rows: []
      },
      rawBytePowerArr: [],
      qualityAdjPowerDeltaArr: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    afterConfig(options) {
      options.yAxis[0] = {
        axisTick: {
          show: false
        },
        min: 0,
        max: Math.ceil(Math.max(...this.rawBytePowerArr) / 9.5) * 10,
        splitNumber: 5,
        interval: Math.ceil((Math.ceil(Math.max(...this.rawBytePowerArr) / 9.5) * 10 / 5)),  // max - min / 5
        // interval: (Math.ceil(Math.max(...this.rawBytePowerArr) / 9.5) * 10 -  Math.ceil(Math.min(...this.rawBytePowerArr) / 12) * 10) / 5,
        axisLabel: {
          formatter: (val) => {
            return val + ' Eib'
          }, //设置你的左侧y轴的数值展现形式
        }
      }
      options.yAxis[1] = {
        axisTick: {
          show: false
        },
        min: Math.ceil(Math.min(...this.qualityAdjPowerDeltaArr) / 7.5) * 10, // 避免最低值为坐标起点
        max: Math.ceil(Math.max(...this.qualityAdjPowerDeltaArr) / 9.5) * 10,
        splitNumber: 5,
        interval: Math.floor((Math.ceil(Math.max(...this.qualityAdjPowerDeltaArr) / 9.5) * 10 -  Math.ceil(Math.min(...this.qualityAdjPowerDeltaArr) / 7.5) * 10 ) / 5),
        axisLabel: {
          formatter: (val) => {
            return val + ' Pib'
          }, //设置你的左侧y轴的数值展现形式
        }
      }
      return options
    },
    getData() {
      getDatas.call(this, qurryStatsPower({
        samples: 30, // 数据条数
        duration: '30d' // 周期sp
      }), 'loading').then(res => {
        if (res.data) {
          this.lineData.rows = res.data.lists && res.data.lists.map(item => {
            const { rawBytePower, qualityAdjPowerDelta } = item
            let newRawBytePower = this.$utils.unitConversion(rawBytePower, 2, 6).split(' ')[0]
            let newQualityAdjPowerDelta = this.$utils.unitConversion(qualityAdjPowerDelta, 2, 5).split(' ')[0]
            this.rawBytePowerArr.push(newRawBytePower)
            this.qualityAdjPowerDeltaArr.push(newQualityAdjPowerDelta)
            return {
              timestamp: this.$moment(new Date(item.timestamp * 1000)).format('MM-DD'),
              '全网算力': newRawBytePower,
              '算力增量': newQualityAdjPowerDelta
            }
          })
          // console.log(this.qualityAdjPowerDeltaArr, Math.floor((Math.max(...this.qualityAdjPowerDeltaArr) -  Math.min(...this.qualityAdjPowerDeltaArr)) / 5),'xiexie')

          // console.log(Math.max(...this.qualityAdjPowerDeltaArr) / Math.max(...this.rawBytePowerArr))
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>