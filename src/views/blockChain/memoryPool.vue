<template>
  <div class="rich container">
    <div class="mt-1 top-title">内存池消息列表</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span class="content-title">共 {{ $XEUils.commafy(total) | handleNullDatas }} 条消息</span>
          <el-select
              :popper-append-to-body="false"
              @change="fnSelectItem"
              v-model="methodType"
              size="mini"
              placeholder="请选择"
          >
            <el-option label="全部类型" value=""></el-option>
            <el-option v-for="(item, index) in methodList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div style="min-height: 500px" v-loading="loading">
          <!--pc端-->
          <el-table class="w-full hide-mini" :data="messageList">
            <el-table-column align="center" label="ID" min-width="140">
              <template slot-scope="{ row }" class="cp hover-color">
                <span class="cp hover-color" v-copy="row.id" @click="goPage('message', row.id)">{{ $utils.centerEllipsis(row.id) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="创建时间">
              <template slot-scope="{ row }">
                {{ row.getTime }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="发送方" min-width="140">
              <template slot-scope="{ row }">
                <span class="cp hover-color" v-copy="row.from" @click="goPage('account', row.from)">{{  $utils.centerEllipsis(row.from) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="接收方">
              <template slot-scope="{ row }">
                <span class="cp hover-color" v-copy="row.to" @click="goPage('address', row.to)">{{  $utils.centerEllipsis(row.to) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="方法" min-width="100">
              <template slot-scope="{ row }">
                {{ row.method }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="金额">
              <template slot-scope="{ row }">
                {{  $utils.fromWei(row.amount, 'ether', 4) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="Gas限额" min-width="100">
              <template slot-scope="{ row }">
                {{  $XEUils.commafy(row.gasLimit) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Gas Premium" min-width="100">
              <template slot-scope="{ row }">
                {{ $XEUils.commafy(row.gasPremium) }} attoFIL
              </template>
            </el-table-column>
          </el-table>
          <!--h5端-->
          <div class="show-mini mini-list">
            <div class="rows" v-for="(row, index) in messageList" :key="index">
              <div class="item text-mini flex justify-between">
                <div>ID</div>
                <div class="cp text-link hover-color" v-copy="row.id" @click="goPage('message', row.id)">{{ $utils.centerEllipsis(row.id) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">创建时间</div>
                <div>
                  {{ row.getTime }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">发送方</div>
                <div class="cp text-link hover-color" v-copy="row.from" @click="goPage('account', row.from)">{{  $utils.centerEllipsis(row.from) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">接收方</div>
                <div class="cp text-link hover-color" v-copy="row.to" @click="goPage('address', row.to)">{{  $utils.centerEllipsis(row.to) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">方法</div>
                <div>{{ row.method }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">金额</div>
                <div>{{  $utils.fromWei(row.amount, 'ether', 4) }} FIL</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">Gas限额</div>
                <div> {{  $XEUils.commafy(row.gasLimit) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">Gas Premium</div>
                <div>{{ $XEUils.commafy(row.gasPremium) }} attoFIL</div>
              </div>
            </div>
          </div>
        </div>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="params.page"
            :limit.sync="params.page_size"
            @pagination="getLists"
        />
      </el-card>
    </div>
  </div>
</template>
<script>
import { getDatas } from "@/utils/method"
import { qurryMemPoolList } from "@/api/common"

export default {
  name: 'memoryPool',
  data() {
    return {
      methodType: '',
      params: {
        page: 1,
        page_size: 20,
        type: "",
      },
      total: 0,
      totalSupply: 0,
      totalAccount: 0,
      loading: false,
      messageList: [],
      methodList: [],
    }
  },
  filters: {
    countTime(val) {
      this.timer = setInterval(() => {
        this.$utils.formatTime(val)
      }, 1000)
    },
  },
  mounted() {
    this.getLists()
  },
  methods: {
    // 获取富人榜
    getLists(type) {
      if (type === "reset") {
        this.params.page = 1
      }
      getDatas
        .call(
          this,
          qurryMemPoolList({
            page: this.params.page - 1,
            page_size: this.params.page_size,
            method: this.methodType || undefined
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.total = res.data?.totalMessage
            this.methodList = res.data?.methodList || []
            this.messageList = res.data?.messageList || []
            this.messageList.forEach(item => {
              this.$set(item, 'getTime', this.$utils.formatTime(item.createTime))
              item.timerId = setInterval(() => {
                this.$set(item, 'getTime', this.$utils.formatTime(item.createTime - 1000))
                // item.getTime = this.$utils.formatTime(item.createTime)
              }, 1000)
            })
          }
        })
    },
    fnSelectItem(val) {
      this.methodType = val
      this.getLists("reset")
    },
    goPage(name, id) {
      this.$router.push({ path: `/${name}/${id}` })
    },
  },
  beforeDestroy() { // clearInterval
    this.messageList.forEach(item => {
      window.clearInterval(item.timerId)
    })
  }
}
</script>
<style scoped lang="scss">
.main {
  margin-bottom: 1rem;
}
</style>
