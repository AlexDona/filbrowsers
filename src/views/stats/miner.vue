<template>
  <div class="miner container">
    <div class="title mt-1:5">存储服务图表</div>
    <div class="mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span>存储提供者有效算力分布</span>
        </div>
        <powerCharts></powerCharts>
        <!--               <lineCharts item="powerDistribution" ref="powerDistribution"></lineCharts>-->
      </el-card>
    </div>
    <div class="power mt-1 mb-1">
      <el-card class="box-card" style="padding: 20px">
        <div slot="header" class="title-bar flex">
          <span>存储提供者算力增量走势</span>
        </div>
        <div id="powerMain" class="w-full" style="min-height: 400px"></div>
        <!--                <lineCharts item="power" ref="power"></lineCharts>-->
      </el-card>
    </div>
    <div class="mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar clearfix">
          <span class="fl">提供存储服务收益变化 (FIL/T)</span>
          <div class="fr">
            <el-radio-group v-model="gainTimeItem" size="mini" @change="changeItemGain">
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="1y">1年</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <lineCharts item="gain" ref="gain" :timeItem.sync="gainTimeItem"></lineCharts>
      </el-card>
    </div>
    <div class="mb-1 mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar clearfix">
          <span class="fl">扇区质押量变化 (FIL/32GiB)</span>
          <div class="fr">
            <el-radio-group v-model="pledgeTimeItem" size="mini" @change="changeItemPledge">
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="1y">1年</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <lineCharts item="pledge" ref="pledge" :timeItem="pledgeTimeItem"></lineCharts>
      </el-card>
    </div>
  </div>
</template>

<script>
import powerCharts from "@/views/home/components/lineCharts"
import minerCharts from '../components/minerCharts'
import lineCharts from '../components/lineCharts'
import * as echarts from 'echarts'
import {getDatas} from "@/utils/method";
import {fetchGasData, qurryGrowthMovements} from "@/api/common";

export default {
  components: {
    powerCharts,
    lineCharts
  },
  data() {
    return {
      gainTimeItem: '24h',
      pledgeTimeItem: '24h',
      powerData: []
    }
  },
  methods: {
    changeItemGain(val) {
      this.gainTimeItem = val
    },
    changeItemPledge(val) {
      this.pledgeTimeItem = val
    },
    init() {
      // getDatas.call(this, qurryGrowthMovements({ duration: this.timeItem }), 'loading').then(res => {
      //   this.powerData.map(item => {
      //     return {
      //       height: item.height,
      //       timestamp: item.timestamp,
      //       miners: item.miners
      //     }
      //   })
      // })

      const res = [{
        "height": 981839,
        "timestamp": 1627761570,
        "miners": [{"address": "f01108594", "powerGrowth": "1176202563813376"}, {
          "address": "f01036920",
          "powerGrowth": "990453818195968"
        }, {"address": "f0807383", "powerGrowth": "882495520243712"}, {
          "address": "f0127616",
          "powerGrowth": "1132703135039488"
        }, {"address": "f023627", "powerGrowth": "463856467968000"}]
      }, {
        "height": 984719,
        "timestamp": 1627847970,
        "miners": [{"address": "f01108594", "powerGrowth": "1132909293469696"}, {
          "address": "f01036920",
          "powerGrowth": "1026668982435840"
        }, {"address": "f0807383", "powerGrowth": "1085836451905536"}, {
          "address": "f0127616",
          "powerGrowth": "1078277309464576"
        }, {"address": "f023627", "powerGrowth": "632219185971200"}]
      }, {
        "height": 987599,
        "timestamp": 1627934370,
        "miners": [{"address": "f01108594", "powerGrowth": "1130710270214144"}, {
          "address": "f01036920",
          "powerGrowth": "1148302456258560"
        }, {"address": "f0807383", "powerGrowth": "943724574015488"}, {
          "address": "f0127616",
          "powerGrowth": "1063777499873280"
        }, {"address": "f023627", "powerGrowth": "852121511526400"}]
      }, {
        "height": 990479,
        "timestamp": 1628020770,
        "miners": [{"address": "f01108594", "powerGrowth": "1090715534753792"}, {
          "address": "f01036920",
          "powerGrowth": "1154074892304384"
        }, {"address": "f0807383", "powerGrowth": "959598773141504"}, {
          "address": "f0127616",
          "powerGrowth": "918160928669696"
        }, {"address": "f023627", "powerGrowth": "855557485363200"}]
      }, {
        "height": 993359,
        "timestamp": 1628107170,
        "miners": [{"address": "f01108594", "powerGrowth": "1096625409753088"}, {
          "address": "f01036920",
          "powerGrowth": "1006396736798720"
        }, {"address": "f0807383", "powerGrowth": "988598392324096"}, {
          "address": "f0127616",
          "powerGrowth": "756326560956416"
        }, {"address": "f023627", "powerGrowth": "858993459200000"}]
      }, {
        "height": 996239,
        "timestamp": 1628193570,
        "miners": [{"address": "f01108594", "powerGrowth": "1123151127773184"}, {
          "address": "f01036920",
          "powerGrowth": "941388111806464"
        }, {"address": "f0807383", "powerGrowth": "1030998309470208"}, {
          "address": "f0127616",
          "powerGrowth": "748836137992192"
        }, {"address": "f023627", "powerGrowth": "855557485363200"}]
      }, {
        "height": 999119,
        "timestamp": 1628279970,
        "miners": [{"address": "f01108594", "powerGrowth": "1112705767309312"}, {
          "address": "f01036920",
          "powerGrowth": "982963395231744"
        }, {"address": "f0807383", "powerGrowth": "923727206285312"}, {
          "address": "f0127616",
          "powerGrowth": "719218043518976"
        }, {"address": "f023627", "powerGrowth": "858993459200000"}]
      }]
      let xArr = [],
        labelArr = [],
        list = []
      for (var i = 0; i < res[0].miners.length; i++) {
        list[i] = []
      }
      for (let i = 0; i < res.length; i++) {
        xArr.push(res[i].timestamp)
        for (let j = 0; j < res[i].miners.length; j++) {
          list[j].push(res[i].miners[j].powerGrowth)
        }
      }
      for (let i = 0; i < res[0].miners.length; i++) {
        labelArr.push(res[0].miners[i].address)
      }
      let chartDom = window.document.getElementById('powerMain');
      let chart = echarts.init(chartDom);
      const _this = this
      let option;
      option = {
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //     type: 'cross',
          //     //xy轴十字架指示数值背景区域色
          //     label: {
          //         backgroundColor: '#6a7985'
          //     }
          // },
          formatter: (v) => {
            let result = this.$moment(Number(v[0].name) * 1000).format('YYYY-MM-DD HH:mm')
            v.forEach((item, index) => {
              result +=
                  '<br/>' +
                  item.marker +
                  item.seriesName + ': ' + `${_this.$utils.unitConversion(item.value, 2, 4)} `
            })
            return result
          }
        },
        legend: {
          data: labelArr
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xArr,
          axisLabel: {
            formatter: (val) => {
              return _this.$moment(Number(val) * 1000).format('MM-DD')
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {show: false},
          axisTick: {show: false},
          // interval: 200,
          axisLabel: {
            formatter: (v) => {
              return `${_this.$utils.unitConversion(v, 0, 4)} `
            }
          }
        },
        series: [
          {
            "name": "f01108594",
            "type": "line",
            "data": list[0]
          },
          {
            "name": "f01036920",
            "type": "line",
            "data": list[1]
          },
          {
            "name": "f0807383",
            "type": "line",
            "data": list[2]
          },
          {
            "name": "f0127616",
            "type": "line",
            "data": list[3]
          },
          {
            "name": "f023627",
            "type": "line",
            "data": list[4]
          },
        ] || this.powerData
      }
      option && chart.setOption(option);
      // 响应式调整
      window.onresize = function () {
        chart.resize();
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.power .box-card {
  padding: 10px;
}
</style>
