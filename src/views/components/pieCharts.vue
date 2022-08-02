<template>
  <div id="pieCharts" class="w-full"></div>
</template>

<script>
import * as echarts from "echarts";
import {getDatas} from "@/utils/method";
import {fetchPowerData} from "@/api/common";

export default {
  name: "pieCharts",
  props: {
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  watch: {
    chartData(val) {
      if (val) {
        this.init(this.chartData)
      }
    }
  },
  methods: {
    init(data) {
      let chartDom = document.getElementById('pieCharts')
      let miniChart = document.getElementById('miniChart')

      let chart = echarts.init(chartDom)
      let miniCharts = echarts.init(miniChart)
      let option = {
        title: {
          show: !data.miner, // 是否显示title
          text: '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#888',
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'item',
          position: [20, 40],
          formatter: (v) => {
            const vData = v.data
            // return this.$utils.forMatNumber(this.$XEUils.divide(value, this.$utils.fromWei(data.balance, 'ether', 0)) * 100, 2) + '%'
            return `${vData.name}：${vData.value} FIL (${this.$utils.forMatNumber(this.$XEUils.divide(vData.value, this.$utils.fromWei(data.balance, 'ether', 0)) * 100, 2)}%)`
          }
        },
        color: ['#ff7993', '#1be9bf', '#63c2ff'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            minAngle: 5,
            data: [
              { value: this.$utils.fromWei(data?.miner?.vestingFunds, 'ether', 4), name: '提供存储服务锁仓' },
              { value: this.$utils.fromWei(data?.miner?.availableBalance, 'ether', 4), name: '可用余额' },
              { value: this.$utils.fromWei(data?.miner?.initialPledgeRequirement, 'ether', 4), name: '扇区抵押' }
            ]
          }
        ]
      }
      option && chart.setOption(option)
      option && miniCharts.setOption(option)
      window.onresize = function () {
        chart.resize()
        miniCharts.resize()
      }
    },
  },
  beforeDestroy() {
    // echarts.init(document.getElementById('pieCharts')).dispose()
    // echarts.init(document.getElementById('miniChart')).dispose()
  }
}
</script>

<style scoped lang="scss">
</style>