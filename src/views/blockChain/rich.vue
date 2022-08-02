<template>
  <div class="rich container">
    <div class="mt-1 top-title">富豪榜</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span class="content-title">共 {{ totalAccount }} 个账户</span>
          <el-select
            :popper-append-to-body="false"
            @change="fnSelectItem"
            v-model="params.type"
            size="mini"
            placeholder="请选择"
          >
            <el-option label="全部类型" value="">全部类型</el-option>
            <el-option label="存储提供者账户" value="storageminer"
            >存储提供者账户
            </el-option
            >
            <el-option label="普通账户" value="account">普通账户</el-option>
          </el-select>
        </div>
        <div style="min-height: 500px" v-loading="loading">
          <!--pc端-->
          <el-table class="w-full hide-mini" :data="richList">
            <el-table-column align="center" label="排名" width="120">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    params.page > 1
                      ? (params.page - 1) * params.page_size + scope.$index + 1
                      : scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="账户名">
              <template slot-scope="{ row }">
                <span
                  v-copy="row.accountName"
                  class="cp hover-color"
                  :title="row.accountName"
                  @click="goPage('account', row.accountName)"
                >{{ $utils.centerEllipsis(row.accountName) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="标签">
              <template slot-scope="{ row }">
                <span v-if="row.Tag">{{ row.Tag }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="余额">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.balance, "ether", 4) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="余额占比">
              <template slot-scope="{ row }">
                {{
                  $utils.forMatNumber(
                    $XEUils.divide(row.balance, totalSupply) * 100,
                    2
                  )
                }}%
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="{ row }">
                {{ row.type }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="{ row }">
                {{
                  $moment(Number(row.createTime) * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="最新交易">
              <template slot-scope="{ row }">
                {{
                  $moment(Number(row.recentlyTrade) * 1000).format(
                    "YYYY-MM-DD HH:mm"
                  )
                }}
              </template>
            </el-table-column>
          </el-table>
          <!--h5端-->
          <div class="show-mini mini-list">
            <div class="rows" v-for="(item, index) in richList" :key="index">
              <div class="title text-mini">
                <img
                  v-if="index + 1 < 4 && params.page === 1"
                  class="icon"
                  :src="require(`@/assets/icon/rank${index + 1}.png`)"
                />
                <span
                  class="rank-num text-center"
                  v-else
                  @click="goPage('account', row.accountName)"
                >
                  {{
                    params.page > 1
                      ? (params.page - 1) * params.page_size + index + 1
                      : index + 1
                  }}
                </span>
                {{ $utils.centerEllipsis(item.accountName) }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">余额/占比</div>
                <div>
                  {{ $utils.fromWei(item.balance, "ether", 4) }} FIL /
                  {{
                    $utils.forMatNumber(
                      $XEUils.divide(item.balance, totalSupply) * 100,
                      2
                    )
                  }}%
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">类型</div>
                <div>{{ item.type }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">创建时间</div>
                <div>
                  {{
                    $moment(Number(item.createTime) * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">最新交易</div>
                <div>
                  {{
                    $moment(Number(item.recentlyTrade) * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  }}
                </div>
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
import {getDatas} from "@/utils/method"
import {fetchRichData} from "@/api/common"

export default {
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
        type: "",
      },
      total: 0,
      totalSupply: 0,
      totalAccount: 0,
      loading: false,
      richList: [],
    }
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
          fetchRichData({
            page: this.params.page - 1,
            page_size: this.params.page_size,
            type: this.params.type,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.total = res.data?.totalCount
            this.totalAccount = res.data?.totalCount
            this.totalSupply = res.data?.totalSupply
            this.richList = res.data.list || []
          }
        })
    },
    fnSelectItem(val) {
      this.params.type = val
      this.getLists("reset")
    },
    goPage(name, id) {
      this.$router.push({path: `/${name}/${id}`})
    },
  },
}
</script>
<style scoped lang="scss">
.main {
  margin-bottom: 1rem;
}
</style>
