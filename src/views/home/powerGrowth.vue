<template>
  <div class="solitaryBlock container">
    <div class="title mt-1 top-title">全网算力增长</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span class="fl">算力变化趋势</span>
          <div class="fr">
            <el-radio-group v-model="timeItem" size="mini" @change="changeItem">
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="180d">180天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <histogram-charts item="powerGrowth" :time-item.sync="timeItem" ref="powerGrowth"></histogram-charts>
      </el-card>
    </div>
  </div>
</template>

<script>
import HistogramCharts from "@/views/components/histogramCharts"

export default {
  name: "powerGrowth",
  components: {
    HistogramCharts,
  },
  data() {
    return {
      timeItem: '30d',
    }
  },
  methods: {
    changeItem(val) {
      this.timeItem = val
    },
  }
}
</script>

<style scoped>

</style>