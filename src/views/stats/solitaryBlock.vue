<template>
  <div class="solitaryBlock container">
    <div class="title mt-1 top-title">孤块统计</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex">
          <span class="fl">全网新增孤块走势</span>
          <div class="fr">
            <el-radio-group v-model="timeItem" size="mini" @change="changeItem">
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <lineCharts item="solitaryBlock" :time-item.sync="timeItem" ref="powerDistribution"></lineCharts>
      </el-card>
    </div>
    <div class="main mt-1 mb-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar" :class="{'flex': lg}">
          <div :class="{'fl': lg}"> 节点孤块统计 </div>
          <el-input
              class="show-mini"
              @keyup.enter.native="handleSearch"
              clearable
              size="mini"
              placeholder="请输入节点账户地址"
              suffix-icon="el-icon-search"
              v-model="searchText">
          </el-input>
          <div class="flex items-center gap-1" :class="{'mt-1/2': xs}">
            <el-input
                class="hide-mini"
                @keyup.enter.native="handleSearch"
                clearable
                size="mini"
                placeholder="请输入节点账户地址"
                suffix-icon="el-icon-search"
                v-model="searchText">
            </el-input>
            <el-select
                :popper-append-to-body="false"
                class="right"
                @change="fnSelectItem"
                v-model="params.sort"
                size="mini"
                placeholder="请选择"
            >
              <el-option label="有效算力排序" value="power"></el-option>
              <el-option label="孤块数/占比排序" value="orphan-block"></el-option>
            </el-select>
            <el-radio-group v-model="timeTable" size="mini" @change="changeDuration">
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <!--  PC 端 start -->
        <el-table class="w-full hide-mini" :data="dataList">
          <el-table-column align="center" label="排名">
            <template slot-scope="scope">
              <img v-if="scope.$index+1 < 4 && params.page === 1" class="rank-icon"
                   :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
              <span v-else>{{ (params.page - 1) * params.page_size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="节点">
            <template slot-scope="{ row }">
              <div class="cp hover-color" @click="goPath({ path: 'address', id: row.miner })">{{ row.miner || 'N/A' }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="{ row }">
              {{ row.label || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="出块数">
            <template slot-scope="{ row }">
              {{ row.block || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="孤块数/占比" min-width="120">
            <template slot-scope="scope">
              <div class="flex justify-between items-center">
                <el-progress
                    class="flex progress1"
                    :show-text="false"
                    :percentage="
                      $utils.setNumber(
                        scope.row.orphanBlock,
                        scope,
                        scope.row.orphanBlock + scope.row.block
                      )
                    "
                ></el-progress>
                <div class="flex">
                  {{ scope.row.orphanBlock }} /
                  {{
                    $utils.forMatNumber(
                        $XEUils.divide(scope.row.orphanBlock, scope.row.orphanBlock + scope.row.block) *
                        100,
                        2
                    )
                  }}%
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="有效算力">
            <template slot-scope="{ row }">
              {{ row.qualityPower && $utils.unitConversion(row.qualityPower, 2) || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="扇区大小">
            <template slot-scope="{ row }">
              {{ row.sectorSize || 'N/A' }}
            </template>
          </el-table-column>
        </el-table>
        <!-- PC端 end   -->
        <!-- h5端 start  -->
        <div
            class="show-mini mini-list"
        >
          <div class="rows" :key="index" v-for="(item, index) in dataList">
            <div class="title text-mini text-link" @click="goPath({ path: 'address', id: item.miner })">
              <img v-if="index+1 < 4 && params.page === 1" class="icon" :src="require(`@/assets/icon/rank${index+1}.png`)"/>
              <span v-else class="rank-num text-center">{{
                  (params.page - 1) * params.page_size + index + 1
                }}</span>
              {{ item.miner | handleNullDatas }}
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">标签:</div>
              <div>
                {{ item.label | handleNullDatas }}
              </div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">出块数:</div>
              <div>{{ item.block }}</div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">孤块数/占比:</div>
              <div>
                {{ item.orphanBlock }} /
                {{
                  $utils.forMatNumber(
                      $XEUils.divide(item.orphanBlock, item.block + item.orphanBlock) *
                      100,
                      2
                  )
                }}%
              </div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">有效算力:</div>
              <div>{{ $utils.unitConversion(item.qualityPower, 2) | handleNullDatas }}</div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">扇区大小:</div>
              <div>{{ item.sectorSize | handleNullDatas }}</div>
            </div>
          </div>
        </div>
        <!-- h5端 end -->
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
import { mapState } from 'vuex'
import lineCharts from '../components/lineCharts'
import { queryOrphanStatistics } from '@/api/common'
import { getDatas } from "@/utils/method"

export default {
  name: "solitaryBlock",
  components: {
    lineCharts
  },
  data() {
    return {
      total: 0,
      timeItem: '24h',
      timeTable: '24h',
      timeDuration: '',
      searchText: '',
      params: {
        page: 1,
        page_size: 20,
        sort: 'power',
        duration: '24h',
        miner: undefined
      },
      dataList: []
    }
  },
  created() {
    this.getLists()
  },
  computed: {
    ...mapState({
      lg: state => state.modules.lg,
      xs: state => state.modules.xs
    })
  },
  methods: {
    goPath({ path, id }) {
      this.$router.push({ path: `/${path}/${id}` })
    },
    handleSearch() {
      this.params.miner = this.searchText.trim()
      this.getLists('reset')
    },
    changeDuration(val) {
      this.params.duration = val
      this.params.page = 1
      if (this.activeIndex !== 1) {
        this.getLists()
      }
    },
    fnSelectItem(val) {
      this.params.sort = val
      this.getLists("reset")
    },
    changeItem(val) {
      this.timeItem = val
    },
    async getLists(type) {
      if (type === "reset") {
        this.params.page = 1
      }
      const res = await getDatas
        .call(
          this,
          queryOrphanStatistics(this.params),
          "loading"
        )
      if (res.data) {
        this.total = res.data?.total
        this.dataList = res.data.miners || []
      }
      return res
    }
  }
}
</script>

<style scoped lang="scss">
.solitaryBlock {
  .el-input {
    width: auto;
  }
}
</style>
