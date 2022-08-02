<template>
  <ve-line
      :data-empty="dataEmpty"
      v-loading="loading"
      :extend="percentExtend"
      :data="lineData"
      :legend-visible="legendVisible"
      :settings="lineSettings"></ve-line>
</template>

<script>
import 'v-charts/lib/style.css'
import { qurryAccountVariety } from '@/api/common'
import {getDatas} from "@/utils/method";
export default {
  name: "chartsAccount",
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
            return this.$XEUils.commafy(val) + ' FIL'
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
                  item.seriesName + '：' +  item.data[1] +
                  '<br/>'
            }
          })
          return v[0].data[0] + '<br/>' +result
        }
      },
      legend: {
        data: ['总余额', '可用余额', '扇区抵押', '提供存储服务锁仓']
      }
    }
    return {
      dataEmpty: false,
      loading: true,
      lineData: {
        columns: ['timestamp', '总余额', '可用余额', '扇区抵押', '提供存储服务锁仓'],
        rows: []
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData() {
      getDatas.call(this, qurryAccountVariety({account: this.account}), 'loading').then(res => {
        if (res.data) {
          this.lineData.rows = res.data.map(item => {
            const { balance, availableBalance, sectorPledgeBalance, vestingFunds } = item
            return {
              timestamp: this.$moment(new Date(item.timestamp * 1000)).format('YYYY-MM-DD HH:mm:ss'),
              '总余额': this.$utils.fromWei(balance, 'ether', 2),
              '可用余额': this.$utils.fromWei(availableBalance, 'ether', 2),
              '扇区抵押': this.$utils.fromWei(sectorPledgeBalance, 'ether', 2),
              '提供存储服务锁仓': this.$utils.fromWei(vestingFunds, 'ether', 2)
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