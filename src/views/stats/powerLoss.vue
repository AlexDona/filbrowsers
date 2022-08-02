<template>
  <div class="powerLoss container">
    <div class="main mt-1 mb-1">
      <el-card class="box-card">
        <div slot="header" class="title-bar" :class="{'flex': lg}">
          <div :class="{'fl': lg}">节点算力损失统计</div>
          <el-input
              class="show-mini"
              @keyup.enter.native="handleSearch"
              clearable
              size="mini"
              placeholder="请输入节点账户地址"
              suffix-icon="el-icon-search"
              v-model="params.addr">
          </el-input>
          <div class="flex items-center gap-1" :class="{'mt-1/2': xs}">
            <el-input
                class="hide-mini"
                @keyup.enter.native="handleSearch"
                clearable
                size="mini"
                placeholder="请输入节点账户地址"
                suffix-icon="el-icon-search"
                v-model="params.addr">
            </el-input>
            <el-radio-group class="flex" v-model="timeTable" size="mini" @change="changeDuration">
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
          <el-table-column align="center" label="矿工">
            <template slot-scope="{ row }">
              {{ row.miner || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="{ row }">
              {{ row.label || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="有效算力">
            <template slot-scope="{ row }">
              {{ row.qualityPower1 || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="算力损失">
            <template slot-scope="{ row }">
              {{ row.powerLost1 || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="算力损失占比" min-width="140">
            <template slot-scope="scope">
              <div class="flex justify-between items-center">
                <el-progress
                    class="flex progress1"
                    :show-text="false"
                    :percentage="
                      Math.abs($utils.setNumber(
                        scope.row.powerLost,
                        scope,
                        maxPowerLost
                      ))
                    "
                ></el-progress>
                <div class="flex">
                  {{
                    $utils.forMatNumber(scope.row.lostRate * 100, 2)
                  }}%
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="扇区大小">
            <template slot-scope="{ row }">
              {{ row.sectorSize || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="损失扇区数量">
            <template slot-scope="{ row }">
              {{ $XEUils.commafy(row.lostSectors) || 'N/A' }}
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
              <div class="name">有效算力:</div>
              <div>{{ item.qualityPower1 }}</div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">算力损失</div>
              <div>
                {{ item.powerLost1 }}
              </div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">算力损失占比</div>
              <div>
                {{ $utils.forMatNumber(item.lostRate * 100, 2) }}%
              </div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">扇区大小:</div>
              <div>{{ item.sectorSize | handleNullDatas }}</div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">损失扇区数量:</div>
              <div>{{ item.lostSectors | handleNullDatas }}</div>
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
import { queryPowerLossStatistics } from '@/api/common'
import { getDatas } from "@/utils/method"

export default {
  name: "powerLoss",
  data() {
    return {
      total: 0,
      maxPowerLost: 0,
      timeItem: '24h',
      timeTable: '24h',
      params: {
        page: 1,
        page_size: 20,
        duration: '24h',
        addr: ''
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
      this.params.addr = this.params.addr.trim()
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
          queryPowerLossStatistics(this.params),
          "loading"
        )
      if (res.data) {
        this.maxPowerLost = res.data?.data.maxPowerLost
        this.total = res.data?.data.total
        this.dataList = res.data?.data.miners || []
      }
      return res
    }
  }
}
</script>

<style scoped lang="scss">

</style>