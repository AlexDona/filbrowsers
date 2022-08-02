<template>
  <div class="order container">
    <div class="mt-1 top-title">订单列表</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span :class="lg ? 'text-normal' : 'text-xs'">共 {{ this.$XEUils.commafy(total) }} 个订单</span>
          <div class="search fr xl:w-2/5 lg:w-3/8 hide-mini">
            <el-input
                @keyup.enter.native="handleSearch"
                clearable
                size="small"
                placeholder="搜索 客户/托管者"
                suffix-icon="el-icon-search"
                v-model="searchText">
            </el-input>
          </div>
        </div>
        <div style="min-height: 500px" v-loading="loading">
          <!--pc端-->
          <el-table class="w-full hide-mini" :data="orderList">
            <el-table-column align="center" label="订单ID" width="120">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPage('order', row.orderId)">
                  {{ row.orderId || 'N/A' }}
                  <el-popover
                      class="el-popover"
                      placement="top"
                      width="200"
                      trigger="hover"
                      content="表示官方认证客户发起的文件订单，该订单有效算力约等于十倍原算力"
                  >
                    <img
                        class="tip tip-icon"
                        src="@/assets/icon/verified.svg"
                        alt=""
                        slot="reference"
                    />
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="创建时间">
              <template slot-scope="{ row }">
                {{ $moment(Number(row.startTime) * 1000).format(
                  "YYYY-MM-DD HH:mm"
              ) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="客户">
              <template slot-scope="{ row }">
                <span
                    v-copy="row.customer"
                    class="cp hover-color"
                    :title="row.accountName"
                    @click="goPage('account', row.customer)"
                >{{ $utils.centerEllipsis(row.customer) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="托管者">
              <template slot-scope="{ row }">
                <span class="cp hover-color" @click="goPage('address', row.provider)">{{ row.provider }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文件大小">
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.fileSize) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="已验证">
              <template slot-scope="{ row }"> {{ row.verifiedStatus }} </template>
            </el-table-column>
            <el-table-column align="center" label="存储费用">
              <template slot-scope="{ row }"> {{ ~~row.stroageCost ? $utils.unitConversion(row.stroageCost) : 'N/A' }} </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{ row }"> {{ row.status || 'N/A' }} </template>
            </el-table-column>
          </el-table>
          <!--h5端-->
          <div class="show-mini mini-list">
            <div class="rows" v-for="(item, index) in orderList" :key="index">
              <div class="item text-mini flex justify-between">
                <div class="name">订单ID</div>
                <div class="text-link" @click="goPage('order', item.orderId)">
                  {{ item.orderId || 'N/A' }}
                  <el-popover
                      class="el-popover"
                      placement="top"
                      width="200"
                      trigger="hover"
                      content="表示官方认证客户发起的文件订单，该订单有效算力约等于十倍原算力"
                  >
                    <img
                        class="tip tip-icon"
                        src="@/assets/icon/verified.svg"
                        alt=""
                        slot="reference"
                    />
                  </el-popover>
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">创建时间</div>
                <div>{{ $moment(Number(item.startTime) * 1000).format(
                    "YYYY-MM-DD HH:mm"
                ) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">客户</div>
                <div class="cp hover-color text-link" @click="goPage('account', item.customer)">
                  {{ $utils.centerEllipsis(item.customer) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">托管者</div>
                <div class="cp hover-color text-link" @click="goPage('address', item.customer)">{{ item.provider }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">文件大小</div>
                <div>{{ $utils.unitConversion(item.fileSize) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">已验证</div>
                <div>{{ item.verifiedStatus }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">存储费用</div>
                <div>{{ ~~item.stroageCost ? $utils.unitConversion(item.stroageCost) : 'N/A' }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">状态</div>
                <div>{{ item.status || 'N/A' }}</div>
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
import {qurryOrderList, fetchSearch} from "@/api/common"
import {mapState} from "vuex";

export default {
  name: 'order',
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
        type: "",
      },
      total: 0,
      searchText: '',
      loading: false,
      orderList: [],
    }
  },
  computed: {
    ...mapState({
      'lg': state => state.modules.lg,
      'xs': state => state.modules.xs
    }),
  },
  mounted() {
    this.getLists()
  },
  methods: {
    handleSearch() {
      const searchText = this.searchText.trim()
      this.getLists('reset', searchText).then((res) => {
        if (res.data) {
          this.total = res.data?.totalCount
          this.orderList = res.data.OrderList || []
        } else {
          this.$message.error('无法搜到此内容')
        }
      })
    },
    // 获取订单列表
    async getLists(type) {
      if (type === "reset") {
        this.params.page = 1
      }
      const res = await getDatas
        .call(
          this,
          qurryOrderList({
            page: this.params.page - 1,
            page_size: this.params.page_size,
            address: this.searchText.trim()
          }),
          "loading"
        )
      if (res.data) {
        this.total = res.data?.totalCount
        this.orderList = res.data.OrderList || []
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
