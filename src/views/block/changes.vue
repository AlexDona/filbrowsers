<template>
  <div class="gas container">
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar clearfix">
          <span class="fl">账户变化</span>
          <div class="fr">
            <el-radio-group
              class="hide-mini"
              v-model="timeItem"
              size="mini"
              @change="changeItem"
            >
              <el-radio-button
                v-for="item in timeList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
            <!-- 小屏幕选项 -->
            <el-select
              :popper-append-to-body="false"
              class="show-mini"
              @change="changeItem"
              style="width: 100px"
              size="mini"
              v-model="timeItem"
            >
              <el-radio-button
                v-for="item in timeList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-select>
          </div>
        </div>
        <div>
          <ve-line
            :data="chartData"
            :extend="percentExtend"
            :settings="lineSettings"
          ></ve-line>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDatas } from "@/utils/method"
import { fetchAccountChangeList } from "@/api/common"
export default {
  components: {},
  data() {
    this.percentExtend = {
      // X轴自定义
      xAxis: {
        // axisLabel: {
        //   show: true,
        //   formatter: (val) => {
        //     return this.$moment(Number(val) * 1000).format(
        //       "YYYY-MM-DD HH:mm:ss"
        //     );
        //   },
        // },
      },
      // Y轴自定义
      yAxis: {
        axisLabel: {
          show: true,
          formatter: (val) => {
            return `${val} FIL`
          },
        },
      },
      // tip浮层自定义
      tooltip: {
        trigger: "axis",
        show: true,
        formatter: (v) => {
          let result = v[0].name,
            title = ""
          let data = v.map((item) => {
            const { data } = item
            title = "总余额"
            return {
              unit: "FIL",
              value: data[1],
            }
          })
          v.forEach((item, index) => {
            if (item.data) {
              result +=
                "<br/>" +
                item.marker +
                (!title ? "总余额" : title) +
                ": " +
                data[index].value +
                " " +
                data[index].unit
            }
          })
          return result
        },
      },
      series: {
        type: "line",
        label: {
          formatter: function (params) {
            // console.log(params)
          },
        },
      },
      legend: {
        show: false,
      },
    }
    return {
      timeList: Object.freeze([
        {
          value: "24h",
          label: "24小时",
        },
        {
          value: "7d",
          label: "7天",
        },
        {
          value: "30d",
          label: "30天",
        },
        {
          value: "1y",
          label: "1年",
        },
      ]),
      timeItem: "24h",
      lineData: {
        columns: [],
        rows: [],
      },
      gasList: [],
      chartData: {
        columns: [],
        rows: [],
      },

      lineSettings: {
        xAxisType: "category",
      },
      loading: false,
    }
  },
  computed: {},
  methods: {
    changeItem(val) {
      this.timeItem = val
      this.getLineChart()
    },
    getLineChart() {
      getDatas
        .call(
          this,
          fetchAccountChangeList({
            account: this.$route.params.accountId,
            duration: this.timeItem,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.chartData.columns = ["timestamp", "账户余额"]
            const chartRow = []
            res.data?.forEach((item) => {
              chartRow.push({
                timestamp: this.$moment(Number(item.timestamp) * 1000).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                '账户余额': this.$utils.fromWei(item.balance, "ether", 1),
              })
            })
            this.chartData.rows = chartRow
          }
        })
    },
  },
  mounted() {
    this.getLineChart()
  },
}
</script>

<style scoped lang="scss">
.table-box {
  min-height: 500px;
  padding: 15px;
  background-color: #fff;
}
</style>
