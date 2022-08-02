<template>
  <div class="largeTransaction container">
    <div :class="{'mt-1': lg, 'mb-3': lg}">
      <el-card class="el-tableCard">
        <div slot="header" class="title-bar flex">
          <div>
            <span class="text-card-title"> 大额转账记录 </span> &nbsp;
            <span class="gray-color" :class="lg ? 'text-normal' : 'text-xs'"> 总共 <span class="bright-color">{{ this.$XEUils.commafy(total) }}</span> 条消息</span>
          </div>
          <div class="search fr xl:w-2/5 lg:w-3/8 hide-mini">
            <el-input
                class="searchInput"
                @keyup.enter.native="handleSearch"
                clearable
                size="small"
                placeholder="搜索发送方或接收方"
                v-model="searchText">
                <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <div style="min-height: 500px" v-loading="loading">
          <!--pc端-->
          <el-table class="w-full hide-mini mt-1.25" :data="transactionList">
            <el-table-column align="center" label="消息ID" width="160">
              <template slot-scope="{ row }">
                <div v-copy="row.cid" class="cp bright-color" @click="goPage('message', row.cid)">
                  {{ $utils.centerEllipsis(row.cid) || 'N/A' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="区块高度">
              <template slot-scope="{ row }">
                <span
                    class="cp hover-color bright-color"
                    @click="goPage('height', row.height)"
                >{{ row.height }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间" min-width="120">
              <template slot-scope="{ row }">
                <span
                >{{ $moment(row.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="发送方" width="150">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    v-copy="row.from"
                    @click="goPage('account', row.from)"
                >{{ row.from ? $utils.centerEllipsis(row.from) : 'N/A' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="接收方">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    v-copy="row.to"
                    @click="goPage('address', row.to)"
                >{{ $utils.centerEllipsis(row.to) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="数额">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.value, "ether", 4) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template>
                转账
              </template>
            </el-table-column>
          </el-table>
          <!--h5端-->
          <div class="show-mini mini-list">
            <div class="rows" v-for="(item, index) in  transactionList" :key="index">
              <div class="item text-mini flex justify-between">
                <div class="name">消息ID</div>
                <div class="text-link" :title="item.cid" @click="goPage('order', item.cid)">
                  {{ $utils.centerEllipsis(item.cid) || 'N/A' }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">区块高度</div>
                <div class="cp hover-color text-link"  @click="goPage('height', item.height)">{{ item.height }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">时间</div>
                <div>
                  {{ $moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">发送方</div>
                <div class="cp hover-color text-link" @click="goPage('account', item.from)">{{ item.from ? $utils.centerEllipsis(item.from) : 'N/A' }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">接收方</div>
                <div class="cp hover-color text-link" @click="goPage('account', item.to)">{{ $utils.centerEllipsis(item.to) | handleNullDatas }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">数额</div>
                <div>{{ $utils.fromWei(item.value, "ether", 4) }} FIL</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">类型</div>
                <div>转账</div>
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
import {largeTransaction} from "@/api/common"
import {mapState} from "vuex";

export default {
  name: 'transaction',
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
      },
      total: 0,
      searchText: '',
      loading: false,
      transactionList: [],
    }
  },
  computed: {
    ...mapState({
      'lg': state => state.modules.lg,
      'xs': state => state.modules.xs
    }),
  },
  mounted() {
    // window.scrollTo(0, document.body.scrollHeight)
    this.getLists()
  },
  methods: {
    handleSearch() {
      const searchText = this.searchText.trim()
      this.getLists('reset', searchText).then((res) => {
        if (res.data && res.data?.largeTransactions?.length) {
          this.total = res.data?.total
          this.transactionList = res.data?.largeTransactions || []
        } else {
          this.$message.error('无法搜到此内容')
        }
      })
    },
    // 获取订单列表
    async getLists(type, searchText = '') {
      if (type === "reset") {
        this.params.page = 1
      }
      const res = await getDatas
        .call(
          this,
          largeTransaction({
            page_index: this.params.page,
            page_size: this.params.page_size,
            addr: searchText
          }),
          "loading"
        )
      if (res.data) {
        this.total = res.data?.total
        this.transactionList = res.data?.largeTransactions || []
      }
      return res
    },
    fnSelectItem(val) {
      this.params.type = val
      this.getLists("reset")
    },
    goPage(name, id) {
      this.$router.push({ path: `/${name}/${id}` })
    },
  }
}
</script>
<style scoped lang="scss">
.order {
  .main {
    margin-bottom: 1rem;
  }
  .el-popover {
    background: none;
    position: relative;
    border: none;
    -webkit-box-shadow: unset;
    .tip-icon {
      margin-left: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 1rem;
    }
  }
}
</style>
