<template>
  <ve-histogram
      :data-empty="barData.rows.length === 0"
      :after-config="afterConfig"
      v-loading="loading"
      :extend="extend"
      :data.sync="barData"
      :legend-visible="legendVisible"
      :settings="barSettings"></ve-histogram>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
import 'v-charts/lib/style.css'
import {getDatas} from '@/utils/method'
import { queryPowerChangeList } from '@/api/common'

export default {
  components: {
    VeHistogram
  },
  props: {
    // 查询的日期类型
    timeItem: {
      type: String,
      default() {
        return '1'
      }
    },
    // powerGrowth 算力增长趋势
    item: {
      type: String,
      default() {
        return 'powerGrowth'
      }
    },
    // 是否显示图例
    legendVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
  },
  data() {
    const colors = ['#004DFF', '#51BBBA', '#E3674F', '#FDBF2C']
    this.barSettings = {
      xAxisType: 'category',
      showLine: this.timeItem === '1' ? ['算力增量', '全网算力', '算力增速', '算力损失'] : [ '全网算力', '算力增速', '算力损失'] // TODO: 首页不展示柱状图
    }
    this.extend = {
      color: colors,
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
      // yAxis: {
      //   axisLabel: {
      //     show: true,
      //     formatter: (val) => {
      //       return val
      //     }
      //   },
      // },
      // tip浮层自定义
      tooltip: {
        trigger: "axis",
        show: true,
        formatter: (v) => {
          let result = v[0].name
          let data = v.map((item) => {
            if (item.seriesName === '全网算力') {
              return {
                unit: 'Eib',
                value: item.data
              }
            } else {
              return {
                unit: 'Pib',
                value: item.data
              }
            }
          })
          v.forEach((item, index) => {
            if (Object.prototype.toString.call(item.data).slice(8, -1) === 'String') {
              result += '<br/>' +
                  item.marker +
                  item.seriesName + ': ' + data[index].value + ' ' + data[index].unit
            }
          })
          return result
        }
      },
      // series: {
      //   type: 'line',
      //   // label: {
      //   //   show: false,
      //   //   formatter: function (params) {
      //   //     console.log(params)
      //   //   }
      //   // },
      //
      // },w
      ...(this.item === 'powerGrowth' && {
        legend: {
          data: ['全网算力', '算力增速', '算力增量', '算力损失'],
        }
      })
      // legend: {
      //     bottom: 10
      // }
    }
    return {
      loading: true,
      yAxis1: [], // y轴第一条数据
      yAxis2: [], // y轴第二条数据
      barData: {
        columns: [],
        rows: []
      }
    }
  },
  watch: {
    timeItem: { // 更改时间周期
      handler(newVal, oldValue) {
        this.getBarData()
      }
    }
  },
  methods: {
    getFormatMax(val) {
      if (Object.prototype.toString.call(val).slice(8, -1) === 'Number') {
        const intLength = val.toString().split('.')[0]
        return Math.floor(val / 10 ** intLength) * 10 ** intLength
      } else {
        throw new Error("please pass Number instead")
      }
    },
    afterConfig(options) { // 双y轴
      const colors = ['#004DFFFF', '#51BBBAFF', '#E3674FFF', '#FDBF2C']
      if (this.item === 'powerGrowth') {
        options.yAxis[0] = {
          axisTick: {
            show: false
          },
          min: Math.ceil(Math.min(...this.yAxis1) / 7.5) * 10, // 避免最低值为坐标起点
          max: Math.ceil(Math.max(...this.yAxis1) / 9.5) * 10,
          splitNumber: 5,
          interval: Math.floor((Math.ceil(Math.max(...this.yAxis1) / 9.5) * 10 -  Math.ceil(Math.min(...this.yAxis1) / 7.5) * 10) / 5),
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
          min: 0,
          max: Math.ceil(Math.max(...this.yAxis2) / 9.5) * 10,
          splitNumber: 5,
          interval: Math.ceil((Math.ceil(Math.max(...this.yAxis2) / 9.5) * 10 / 5)),  // max - min / 5
          // interval: (Math.ceil(Math.max(...this.rawBytePowerArr) / 9.5) * 10 -  Math.ceil(Math.min(...this.rawBytePowerArr) / 12) * 10) / 5,
          axisLabel: {
            formatter: (val) => {
              return val + ' Pib'
            }, //设置你的左侧y轴的数值展现形式
          }
        }
      }
      return options
    },
    async getBarData() {
      getDatas.call(this, queryPowerChangeList({ duration: this.timeItem }), 'loading').then(res => {
        if (res.data) {
          const resData = res.data
          const [yAxis1, yAxis2] = [[], []]
          this.barData.columns = ['timestamp', '全网算力', '算力增速', '算力增量', '算力损失']
          this.barData.rows = resData.data && resData.data && resData.data.powerGrowth.growthStrList.map((item, index) => {
            yAxis1.push(item,  resData.data.powerLoss.lossStrList[index], resData.data.provingGrowth.provingStrList[index])
            yAxis2.push(resData.data.powerTotal.totalStrList[index])
            return {
              timestamp: this.timeItem !== '1' ? resData.data.timeList[index] : this.$moment(new Date(resData.data.timeList[index])).format(
                "MM-DD"
              ),
              '全网算力': resData.data.powerTotal.totalStrList[index],
              '算力增速': resData.data.provingGrowth.provingStrList[index],
              '算力增量': item,
              '算力损失':  resData.data.powerLoss.lossStrList[index]
            }
          })
          // this.barData.rows = res.data.data && res.data.data.map(item => {
          //   yAxis1.push(item.qualityAdjPowerGrowth / (1024 ** 2), item.qualityAdjPowerDelta / (1024 ** 2), item.powerLost / (1024 ** 2))
          //   yAxis2.push(item.totalPower / (1024 ** 3))
          //   return {
          //     timestamp: item.timestamp.toString(),
          //     '全网算力': item.totalPower / (1024 ** 3),
          //     '算力增速': item.qualityAdjPowerGrowth / (1024 ** 2),
          //     '算力增量': item.qualityAdjPowerDelta / (1024 ** 2),
          //     '算力损失': item.powerLost / (1024 ** 2)
          //   }
          // })
          this.yAxis1 = yAxis1
          this.yAxis2 = yAxis2
          // console.log(Math.max(...yAxis1), Math.min(...yAxis1), Math.max(...yAxis2), Math.min(...yAxis2), 'sss')
          // this.barData.rows = [{"timestamp":"1651017600","全网算力":"17663437911.31421","算力增速":"6280095.089874268","算力增量":"20421120","算力损失":"-45475201.065093994"},{"timestamp":"1651104000","全网算力":"17705988807.151062","算力增速":"42550895.83685303","算力增量":"21841664","算力损失":"-29618725.830352783"},{"timestamp":"1651190400","全网算力":"17733145055.797424","算力增速":"27156248.646362305","算力增量":"20877376","算力损失":"-21625342.509552002"}]
        }
      })
    }
  },
  mounted() {
    this.getBarData()
  }
}
</script>
