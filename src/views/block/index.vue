<template>
  <div class="block container">
    <div class="main mt-1">
      <el-card class="w-full hide-mini box-card">
        <div slot="header">
          <el-radio-group class="show-mini" size="mini" v-model="choose" @change="selectModule">
            <el-radio-button
              v-for="item in headerSelect"
              :label="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio-button
            >
          </el-radio-group>
          <div class="title-bar flex">
            <span class="content-title"
            >共 {{ totalAccount }} {{ showText }}</span
            >
            <el-select
              :popper-append-to-body="false"
              v-if="choose !== 'block'"
              @change="fnSelectItem"
              v-model="params.method"
              size="mini"
              placeholder="请选择"
            >
              <el-option value="" label="全部">全部</el-option>
              <el-option v-for="item in selectData" :value="item" :key="item">
                {{ item }}
              </el-option
              >
            </el-select>
          </div>
        </div>

        <div v-loading="loading">
          <!--pc端 消息列表-->
          <el-table
            v-if="choose === 'message'"
            class="w-full hide-mini"
            :data="blockList"
          >
            <el-table-column align="center" label="消息ID" width="150">
              <template slot-scope="{ row }">
                <span
                  v-copy="row.messageid"
                  class="cp hover-color"
                  :title="row.messageid"
                  @click="goPage('message', row.messageid)"
                >{{ $utils.centerEllipsis(row.messageid) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" label="区块高度">
              <template slot-scope="{ row }">
                <span
                  class="cp bright-color hover-color"
                  :title="row.height"
                  @click="goPage('height', row.height)"
                >
                  {{ $utils.centerEllipsis(row.height) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间">
              <template slot-scope="{ row }">
                {{
                  $moment(Number(row.timestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="发送方">
              <template slot-scope="{ row }">
                <span
                  v-copy="row.from"
                  class="cp hover-color"
                  :title="row.from"
                  @click="goPage('account', row.from)"
                >{{ $utils.centerEllipsis(row.from) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="接收方">
              <template slot-scope="{ row }">
                <span class="cp hover-color" :title="row.to" v-copy="row.to">
                  {{
                    $utils.centerEllipsis(row.to)
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="方法">
              <template slot-scope="{ row }">
                {{ row.method }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="金额">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.amount, "ether", 18) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{ row }">
                {{ transformStatus(row.status) }}
              </template>
            </el-table-column>
          </el-table>
          <!--pc端 区块链列表-->
          <el-table
            v-if="choose === 'block'"
            class="w-full hide-mini"
            :data="blockList"
          >
            <el-table-column align="center" label="区块高度" width="120">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color bright-color"
                  @click="goPage('height', row.height)"
                >{{ row.height }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" width="150" label="区块ID">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color"
                  @click="goPage('belong', row.cid)"
                  :title="row.cid"
                >{{ $utils.centerEllipsis(row.cid) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖励">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.reward, "ether", 18) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间">
              <template slot-scope="{ row }">
                {{
                  $moment(Number(row.timestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="消息数">
              <template slot-scope="{ row }">
                {{ row.messageCount }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="区块大小">
              <template slot-scope="{ row }"> {{ row.size }}Bytes</template>
            </el-table-column>
          </el-table>
          <!--pc端 转账列表-->
          <el-table
            v-if="choose === 'transfer'"
            class="w-full hide-mini"
            :data="blockList"
          >
            <el-table-column align="center" label="时间">
              <template slot-scope="{ row }">
                {{
                  $moment(Number(row.timestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="消息ID">
              <template slot-scope="{ row }">
                <span v-if="row.message" class="cp text-link" v-copy="row.message"
                      @click="goPage('message', row.message)">{{ $utils.centerEllipsis(row.message) }}</span>
                <span v-else>N/A</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="发送方">
              <template slot-scope="{ row }">
                <span
                  class="cp hover-color"
                  :title="row.from"
                  @click="goPage('account', row.from)"
                >{{ row.from ? $utils.centerEllipsis(row.from) : 'N/A' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" width="80">
              <template>
                <img class="rank-icon" :src="require(`@/assets/img/to.svg`)"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="接收方">
              <template slot-scope="{ row }">
                <span
                  v-copy="row.to"
                  class="cp hover-color"
                  :title="row.to"
                  @click="goPage('address', row.to)"
                >{{ $utils.centerEllipsis(row.to) }}</span
                >
              </template>
            </el-table-column>

            <el-table-column align="center" label="净收入">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.value) }} FIL
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="{ row }">
                {{ row.type !== 'genesis' ? transformType(row.type) : '创世块生成' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <!--h5端 消息列表-->
      <div class="show-mini mini-list">
        <div class="mini-card">
          <div class="py-1">
            <el-radio-group
              class="flex justify-center mt-1"
              size="mini"
              v-model="choose"
              @change="selectModule"
            >
              <el-radio-button
                v-for="item in headerSelect"
                :label="item.value"
                :key="item.value"
              >
                {{ item.label }}
              </el-radio-button
              >
            </el-radio-group>
            <div class="title-bar flex">
              <span class="content-title"
              >共 {{ totalAccount }} {{ showText }}</span
              >
              <el-select
                :popper-append-to-body="false"
                v-if="choose !== 'block'"
                @change="fnSelectItem"
                v-model="params.method"
                size="mini"
                placeholder="请选择"
              >
                <el-option value="" label="全部">全部</el-option>
                <el-option v-for="item in selectData" :value="item" :key="item">
                  {{ item }}
                </el-option
                >
              </el-select>
            </div>
          </div>
          <div v-if="choose === 'message'">
            <div class="rows" v-for="(item, index) in blockList" :key="index">
              <div class="item text-mini flex justify-between">
                <div class="name">消息ID</div>
                <div
                  v-copy="item.messageid"
                  class="cp hover-color"
                  :title="item.messageid"
                  @click="goPage('message', item.messageid)"
                >
                  {{ $utils.centerEllipsis(item.messageid) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">区块高度</div>
                <div
                  class="bright-color"
                  @click="goPage('height', item.height)"
                >
                  {{ item.height }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">时间</div>
                <div>
                  {{
                    $moment(Number(item.timestamp) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">发送方</div>
                <div
                  class="cp bright-color hover-color"
                  :title="item.from"
                  @click="goPage('account', item.from)"
                >
                  {{ $utils.centerEllipsis(item.from) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">接收方</div>
                <div
                  v-copy="item.to"
                  class="cp bright-color hover-color"
                  :title="item.to"
                  @click="goPage('account', item.to)"
                >
                  {{ $utils.centerEllipsis(item.to) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">方法</div>
                <div>{{ item.method }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">金额</div>
                {{ $utils.fromWei(item.amount, "ether", 18) }} FIL
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">状态</div>
                <div>{{ transformStatus(item.status) }}</div>
              </div>
            </div>
          </div>
          <div v-if="choose === 'block'">
            <div class="rows" v-for="(item, index) in blockList" :key="index">
              <div class="item text-mini flex justify-between">
                <div class="name">区块高度</div>
                <div
                  class="bright-color"
                  @click="goPage('height', item.height)"
                >
                  {{ item.height }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">区块ID</div>
                <div
                  class="cp hover-color"
                  :title="item.cid"
                  @click="goPage('belong', item.cid)"
                >
                  {{ $utils.centerEllipsis(item.cid) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">奖励</div>
                {{ $utils.fromWei(item.reward, "ether", 18) }} FIL
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">时间</div>
                <div>
                  {{
                    $moment(Number(item.timestamp) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">消息数</div>
                <div>{{ item.messageCount }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">区块大小</div>
                <div>{{ item.size }}Bytes</div>
              </div>
            </div>
          </div>
          <div v-if="choose === 'transfer'">
            <div class="rows" v-for="(item, index) in blockList" :key="index">
              <div class="item text-mini flex justify-between">
                <div class="name">时间</div>
                <div>
                  {{
                    $moment(Number(item.timestamp) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">消息ID</div>
                <div v-if="item.message" class="cp text-link" v-copy="item.message"
                     @click="goPage('message', item.message)">
                  {{ $utils.centerEllipsis(item.message) || 'N/A' }}
                </div>
                <div v-else>N/A</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">发送方</div>
                <div
                  class="cp bright-color hover-color"
                  :title="item.from"
                  @click="goPage('account', item.from)"
                >
                  {{ $utils.centerEllipsis(item.from) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">接收方</div>
                <div
                  v-copy="item.to"
                  class="cp bright-color hover-color"
                  :title="item.to"
                  @click="goPage('address', item.to)"
                >
                  {{ $utils.centerEllipsis(item.to) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">净收入</div>
                <div>{{ $utils.fromWei(item.value, "ether", 4) }} FIL</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">类型</div>
                <div>{{ transformType(item.type) }}</div>
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
    </div>
  </div>
</template>
<script>
import {getDatas} from "@/utils/method"
import {
  fetchAccountMessageList,
  fetchAccountBlockList,
  fetchAccountTransferList,
} from "@/api/common"
import {convertStatus, convertType} from "./blockMix.js"

export default {
  props: {
    // 头部
    tabList: {
      type: Array,
      default: () => [
        {label: "消息列表", value: "message"},
        {label: "区块列表", value: "block"},
        {label: "转帐列表", value: "transfer"},
      ],
    },
    // 头部tab 默认选择
    tabChoose: {
      type: String,
      default: "message",
    },
  },
  data() {
    return {
      params: {
        page: 1,
        page_size: 20,
        method: "",
      },
      total: 0,
      totalSupply: 0,
      totalAccount: 0,
      loading: false,
      blockList: [],
      choose: this.tabChoose,
      selectData: [],
      headerSelect: this.tabList,
      callMethod: Object.freeze({
        message: {
          callApi: fetchAccountMessageList,
          total: "totalMessage",
          count: "totalMessage",
          list: "messageList",
          text: "条消息",
          params: "method",
          selectData: "methodList",
        },
        block: {
          callApi: fetchAccountBlockList,
          total: "totalCount",
          count: "totalCount",
          list: "blocks",
          text: "个区块",
          params: "",
        },
        transfer: {
          callApi: fetchAccountTransferList,
          total: "totalCount",
          count: "totalCount",
          list: "transfers",
          text: "条转账",
          params: "type",
          selectData: "types",
        },
      }),
    }
  },
  computed: {
    showText() {
      return this.callMethod[this.choose].text
    },
  },
  mounted() {
    this.getLists()
  },
  methods: {
    // 获取消息列表
    getLists(type) {
      if (type === "reset") {
        this.params.page = 1
      }
      const {callApi, total, count, params, list, selectData} =
        this.callMethod[this.choose]
      getDatas
        .call(
          this,
          callApi({
            page: this.params.page - 1,
            page_size: this.params.page_size,
            account: this.$route.params.accountId,
            [params]: this.params.method,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.total = res.data?.[total]
            this.totalAccount = res.data?.[count]
            this.blockList = res.data?.[list] || []
            this.selectData = res.data?.[selectData]
          }
        })
    },
    fnSelectItem(val) {
      this.params.method = val
      this.getLists("reset")
    },
    selectModule() {
      this.total = 0
      this.totalAccount = 0
      this.blockList = []
      this.params.method = ""
      this.selectData = []
      this.getLists("reset")
    },
    goPage(name, id) {
      this.$router.push({path: `/${name}/${id}`})
    },
    transformStatus(status) {
      return convertStatus(status)
    },
    transformType(type) {
      return convertType(type)
    },
  },
}
</script>
<style scoped lang="scss">
.main {
  margin-bottom: 1rem;

  .el-card {
    border-bottom: none;
  }
}

.block {
  .rank-icon {
    width: 1rem;
  }

  .title-bar {
    line-height: 48px;
  }
}
</style>
