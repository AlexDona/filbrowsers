<template>
  <div class="gas container">
<!--    <div class="title mt-1 top-title">Gas统计</div>-->
    <div class="main mt-1.8">
      <el-card class="box-card">
        <div slot="header" class="title-bar clearfix">
          <span class="fl">基础费率走势</span>
          <div class="fr">
            <el-radio-group class="hide-mini" v-model="timeItem" size="mini" @change="changeItem">
              <el-radio-button label="day">24时</el-radio-button>
              <el-radio-button label="week">7天</el-radio-button>
              <el-radio-button label="month">30天</el-radio-button>
              <el-radio-button label="halfYear">180天</el-radio-button>
            </el-radio-group>
              <!-- 小屏幕选项 -->
              <el-select
                  :popper-append-to-body="false"
                  class="show-mini"
                  @change="changeItem"
                  style="width: 100px" size="mini" v-model="timeItem">
                  <el-option label="24小时" value="day"></el-option>
                  <el-option label="7天" value="week"></el-option>
                  <el-option label="30天" value="month"></el-option>
                  <el-option label="180天" value="halfYear"></el-option>
              </el-select>
          </div>
        </div>
        <div class="mt-1">
         <lineCharts :timeItem.sync="timeItem"></lineCharts>
        </div>
      </el-card>
    </div>
    <div class="title mt-1:5 mb-1 top-title">24h Gas 数据</div>
    <div class="table-box mb-1" v-loading="loading">
      <el-table
          class="w-full gas-table hide-mini"
          :data="gasList">
        <el-table-column
            align="center"
            label="消息类型"
            min-width="140">
          <template slot-scope="{row}">
            {{row.MessageType}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="Gas Premium"
            width="180">
          <template slot-scope="{row}">
              {{row.GasPremium}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="130"
            label="平均Gas限额">
          <template slot-scope="{row}">
              {{row.AverageGasLimit}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="130"
            label="平均Gas消耗">
          <template slot-scope="{row}">
              {{row.AverageGasUse}}
          </template>
        </el-table-column>
        <el-table-column
            width="100"
            align="center"
            label="平均手续费">
          <template slot-scope="{row}">
              {{row.AverageGasFee}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="180"
            label="手续费合计/占比">
          <template slot-scope="{row}">
              {{row.GasFeeSum}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="120"
            label="消息数合计/占比">
          <template slot-scope="{row}">
              {{row.MessageSum}}
          </template>
        </el-table-column>
      </el-table>
        <div class="show-mini mini-list">
            <div class="rows" v-for="(item, index) in gasList" :key="index">
                <div class="item text-mini flex justify-between">
                    <div class="name">消息类型:</div>
                    <div>{{item.MessageType}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">Gas Premium:</div>
                    <div>{{item.GasPremium}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">平均Gas限额:</div>
                    <div>{{item.AverageGasLimit}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">平均Gas消耗:</div>
                    <div>{{item.AverageGasUse}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">平均手续费:</div>
                    <div>{{item.AverageGasFee}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">手续费合计/占比:</div>
                    <div>{{item.GasFeeSum}}</div>
                </div>
                <div class="item text-mini flex justify-between">
                    <div class="name">消息数合计/占比:</div>
                    <div>{{item.MessageSum}}</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {getDatas} from '@/utils/method'
import {fetchGas24} from '@/api/common'
import lineCharts from '../components/lineCharts'

export default {
  name: 'gas',
  components: {
    lineCharts
  },
  data() {
    return {
      timeItem: 'day',
      gasList: [],
      loading: false
    }
  },
  computed: {},
  methods: {
    changeItem(val) {
      this.timeItem = val
    },
    getGas24() {
      getDatas.call(this, fetchGas24(), 'loading').then(res => {
        if (res.data) {
          this.gasList = res.data
        }
      })
    }
  },
  mounted() {
    console.log(document.body.scrollTop)
    this.getGas24()
  }
}
</script>

<style scoped lang="scss">
.table-box {
  min-height: 500px;
  padding: 15px;
  background-color: #fff;
}
</style>
