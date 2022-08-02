<template>
    <ve-line
        :data-empty="lineData.rows.length === 0"
        :after-config="afterConfig"
        v-loading="loading"
        :extend="extend"
        :data.sync="lineData"
        :legend-visible="legendVisible"
        :settings="lineSettings">
    </ve-line>
</template>

<script>
import 'v-charts/lib/style.css'
import {getDatas} from '@/utils/method'
import { queryGasFreeChart, qurryLonelyBlock, qurryMineRewardChange, qurryPledgeChange, queryPowerChangeList } from '@/api/common'

export default {
  props: {
    // 查询的日期类型
    timeItem: {
      type: String,
      default() {
        return 'day'
      }
    },
    // fee-基础手续费率走势, power-存储提供者算力增量走势, gain-提供存储服务收益变化, pledge-扇区质押量变化
    item: {
      type: String,
      default() {
        return 'fee'
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
    this.lineSettings = {
      xAxisType: 'category',
      labelMap: {
        'baseFee': '基础手续费率',
        'gasFee32': '32GB扇区GAS消耗',
        'gasFee64': '64GB扇区GAS消耗'
      },
    }
    this.extend = {
      color: colors,
      ...(this.item === 'fee' && {
        legend: {
          data: ['基础手续费率', '32GB扇区GAS消耗', '64GB扇区GAS消耗'],
        }
      }),
      // X轴自定义
      xAxis: {
        axisLabel: {
          show: true,
          formatter: (val) => {
            if (['gain', 'pledge', 'solitaryBlock'].includes(this.item)) {
              if (this.timeItem === '24h') {
                // 24小时
                return this.$moment(Number(val)*1000).format('HH:mm')
              } else {
                // 7天，30天，一年
                return this.$moment(Number(val)*1000).format('MM-DD HH:mm')
              }
            } else if (this.item === 'fee') { // gas 费
              return this.$moment(new Date(val)).format('HH:mm')
            } else {
              return this.$moment(Number(val)*1000).format('YYYY-MM-DD')
              // console.log(val)
              // return this.$moment(Number(val)*1000).format('MM-DD')
            }
          }
        }
      },
      // Y轴自定义
      yAxis: {
        axisLabel: {
          show: true,
          formatter: (val) => {
            if (this.item === 'fee') {
              return `${val} nanoFIL`
            } else if (this.item === 'power') {
              return `${val / 1024/1024/1024/1024} TiB`
            } else if (this.item === 'gain') {
              return val + ' FIL/TiB'
            } else if (this.item === 'pledge') {
              return val + ' FIL/32GiB' // change GiBytes type
            } else {
              return val
            }
          }
        },
      },
      // tip浮层自定义
      tooltip: {
        trigger: "axis",
        show: true,
        formatter: (v) => {
          let result = this.item === 'fee' ? v[0].axisValue : this.$moment(Number(v[0].name) * 1000).format('YYYY-MM-DD HH:mm'),
            title = ''
          let data = v.map((item, index) => {
            const {data} = item
            if (this.item === 'fee') {
              return {
                unit: index === 0 ? 'nanoFIL' : 'FIL',
                value: this.$utils.forMatNumber(data[1], 3)
              }
            } else if (this.item === 'gain') {
              title = '提供存储服务收益变化'
              return {
                unit: 'FIL/TiB',
                value: this.$utils.forMatNumber(data[1], 4)
              }
            } else if (this.item === 'pledge') {
              title = '扇区质押变化'
              return {
                unit: 'FIL/32GiB',
                value: data[1]
              }
            } else {
              title = '孤块数'
              return {
                unit: '',
                value: data[1]
              }
            }
          })
          v.forEach((item, index) => {
            if (item.data) {
              result += '<br/>' +
                        item.marker +
                        (!title? item.seriesName:title) + ': ' + data[index].value + ' ' + data[index].unit
            }
          })
          return result
        }
      },
      series: {
        type: 'line',
        ...(this.item === 'solitaryBlock' && { // todo: 孤块统计单独处理
          itemStyle: {
            normal: {
              // color: 'green', // 折线条的颜色
              // borderColor: '#289df5', // 拐点边框颜色
              areaStyle: {
                type: 'default',
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#47ecce' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#fff' // 100% 处的颜色
                  }],
                  globalCoord: false, // 缺省为 false
                  opacity: 0.3,
                }
              }
            }
          },
        })
      },
      // legend: {
      //     bottom: 10
      // }
    }
    return {
      loading: true,
      yAxis1: [], // y轴第一条数据
      yAxis2: [], // y轴第二条数据
      lineData: {
        columns: [],
        rows: []
      }
    }
  },
  watch: {
    timeItem: { // 更改时间周期
      handler(newVal, oldValue) {
        if (['fee', 'gain', 'pledge', 'solitaryBlock'].includes(this.item)) {
          this.getLineData()
        }
      }
    }
  },
  methods: {
    afterConfig(options) { // 双y轴
      if (this.item === 'fee') {
        options.yAxis[0] = {
          axisTick: {
            show: false
          },
          min: 0, // 避免最低值为坐标起点
          max: Math.ceil(Math.max(...this.yAxis1) / 9.5) * 10,
          splitNumber: 5,
          axisLabel: {
            formatter: (val) => {
              return val + ' nanoFIL'
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
              return val + ' FIL/TiB'
            }, //设置你的左侧y轴的数值展现形式
          }
        }
      }
      return options
    },
    async getLineData() {
      if (this.item === 'fee') {
        this.lineData.columns = ['timeList', 'baseFee', 'gasFee32', 'gasFee64']
        // 获取费率
        getDatas.call(this, queryGasFreeChart({
          duration: this.timeItem
        }), 'loading').then(res => {
          const { data } = res
          const [yAxis1, yAxis2] = [[], []]
          if (data) {
            this.lineData.rows = data?.baseFee?.feeList.map((item, index) => {
              yAxis1.push(item)
              yAxis2.push(data?.gasFee32?.feeList[index], data?.gasFee64?.feeList[index])
              return {
                timeList: data?.timeList[index],
                baseFee: item,
                gasFee32: data?.gasFee32?.feeList[index],
                gasFee64: data?.gasFee64?.feeList[index]
              }
            }) ?? []
            this.yAxis1 = yAxis1
            this.yAxis2 = yAxis2
            // console.log(this.yAxis1, 'yAxis1')
          }
        })
      } else if (this.item === 'gain') {
        const res = await getDatas.call(this, qurryMineRewardChange({ duration: this.timeItem }), 'loading')
        if (res.data) {
          this.lineData.columns = ['timestamp', 'rewardPerByte']
          let newArr = []
          newArr = res.data.map(item => {
            return {
              height: item.height,
              timestamp: item.timestamp.toString(),
              rewardPerByte: item.rewardPerByte
            }
          })
          this.lineData.rows = newArr
        }


      } else if (this.item === 'pledge') {
        getDatas.call(this, qurryPledgeChange({ duration: this.timeItem }), 'loading').then(res => {
          if (res.data) {
            this.lineData.columns = ['timestamp', 'initialPledge']
            this.lineData.rows = res.data.map(item => {
              return {
                timestamp: item.timestamp.toString(),
                height: item.height,
                initialPledge: this.$utils.fromWei((item.initialPledge * 1024 ** 3 * 32).toString(), 'ether', 2)
              }
            })
          }
        })
      } else {
        getDatas.call(this, qurryLonelyBlock({ duration: this.timeItem }), 'loading').then(res => {
          if (res.data) {
            this.lineData.columns = ['timestamp', 'total']
            this.lineData.rows = res.data.data ? res.data.data.map(item => {
              return {
                timestamp: item.timestamp.toString(),
                total: item.total
              }
            }) : []
          }
        })
      }
    }
  },
  mounted() {
    this.getLineData()
  }
}
</script>

<style scoped lang="scss">

</style>
