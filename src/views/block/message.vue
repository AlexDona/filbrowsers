<template>
  <div class="message container" v-loading="loading">
    <!-- 消息详情 -->
    <div class="mt-1 top-title w-full hide-mini">消息详情</div>
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header">消息概览</div>
        <div class="w-full hide-mini">
          <dl class="region-row">
            <dt class="region-key">消息ID</dt>
            <dd class="cp region-value">
              {{ messageConfig.cid }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">高度</dt>
            <dd
                :class="{ 'cp': messageConfig.height, 'bright-color': messageConfig.height }"
                class="region-value"
                @click="messageConfig.height ? goPage('height', messageConfig.height) : null"
            >
              {{ messageConfig.height || 'N/A' }}
            </dd>
          </dl>
          <dl class="region-row" v-if="messageConfig.height">
            <dt class="region-key">时间</dt>
            <dd class="cp region-value">
              {{
                $moment(Number(messageConfig.timestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl v-else class="region-row">
            <dt class="region-key">创建时间</dt>
            <dd class="cp region-value">
              {{
                $moment(Number(messageConfig.createTimestamp) * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </dd>
          </dl>
          <dl class="region-row" v-if="messageConfig.height">
            <dt class="region-key">所属区块</dt>
            <dd class="cp region-value">
              <a
                  v-for="item in messageConfig.blocks"
                  :key="item"
                  class="bright-color hover-color"
                  @click="goPage('belong', item)"
              >
                {{ item }}
              </a>
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">发送方</dt>
            <dd
                class="cp region-value bright-color"
                @click="goPage('account', messageConfig.from)"
            >
              {{ messageConfig.from }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">接收方</dt>
            <dd
                class="cp region-value bright-color"
                @click="goPage('address', messageConfig.to)"
            >
              {{ messageConfig.to }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">方法</dt>
            <dd class="region-value">
              {{ messageConfig.method }}
            </dd>
          </dl>
          <dl class="region-row">
            <dt class="region-key">金额</dt>
            <dd class="region-value">
              {{ $utils.fromWei(messageConfig.value, "ether", 18) }}FIL
            </dd>
          </dl>
          <dl class="region-row" v-if="messageConfig.height">
            <dt class="region-key">状态</dt>
            <dd class="region-value">
              {{
                convertExitCode(
                    messageConfig.receipt && messageConfig.receipt.exitCode
                )
              }}
            </dd>
          </dl>
        </div>
        <!--h5端-->
        <div class="show-mini mini-list">
          <div>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">消息ID</dt>
              <dd class="cp region-value line-one">
                {{ messageConfig.cid }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">高度</dt>
              <dd
                  class="cp region-value"
                  @click="goPage('height', messageConfig.height)"
              >
                {{ messageConfig.height }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between" v-if="messageConfig.height">
              <dt class="name region-key">时间</dt>
              <dd class="region-value">
                {{
                  $moment(Number(messageConfig.timestamp) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between" v-else>
              <dt class="name region-key">创建时间</dt>
              <dd class="region-value">
                {{
                  $moment(Number(messageConfig.createTimestamp) * 1000).format(
                      "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">所属区块</dt>
              <dd class="cp region-value">
                <a
                    v-for="item in messageConfig.blocks"
                    :key="item"
                    class="bright-color hover-color line-one"
                    @click="goPage('belong', item)"
                >
                  {{ item }}
                </a>
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">发送方</dt>
              <dd
                  class="cp region-value hover-color bright-color line-one"
                  @click="goPage('account', messageConfig.from)"
              >
                {{ messageConfig.from }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">接收方</dt>
              <dd
                  class="cp region-value hover-color bright-color line-one"
                  @click="goPage('address', messageConfig.to)"
              >
                {{ messageConfig.to }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">方法</dt>
              <dd class="region-value">
                {{ messageConfig.method }}
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">金额</dt>
              <dd class="region-value">
                {{ $utils.fromWei(messageConfig.value, "ether", 18) }}FIL
              </dd>
            </dl>
            <dl class="item region-row text-mini flex justify-between">
              <dt class="name region-key">状态</dt>
              <dd class="region-value">
                {{
                  convertExitCode(
                      messageConfig.receipt && messageConfig.receipt.exitCode
                  )
                }}
              </dd>
            </dl>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 转账信息 -->
    <div class="main mt-1" v-if="messageConfig.transfers">
      <el-card class="box-card">
        <div slot="header">转账信息</div>
        <el-table class="w-full hide-mini" :data="messageConfig.transfers">
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
          <el-table-column align="center" width="80">
            <template slot-scope="{ row }">
              <img class="rank-icon" :src="require(`@/assets/img/to.svg`)"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="接收方">
            <template slot-scope="{ row }">
              <span
                  class="cp hover-color"
                  :title="row.to"
                  @click="goPage('address', row.to)"
              >{{ $utils.centerEllipsis(row.to) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="金額">
            <template slot-scope="{ row }">
              {{ formatValue(row.value) }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="类型">
            <template slot-scope="{ row }">
              {{ transformType(row.type) }}
            </template>
          </el-table-column>
        </el-table>
        <!--h5端-->
        <div class="show-mini mini-list">
          <div
              class="rows"
              v-for="(item, index) in messageConfig.transfers"
              :key="index"
          >
            <div class="item text-mini flex justify-between">
              <div class="name">发送方</div>
              <div class="cp hover-color" :title="item.from">
                {{ $utils.centerEllipsis(item.from) }}
              </div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">接收方</div>
              {{ $utils.centerEllipsis(item.to) }}
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">金额</div>
              <div>{{ formatValue(item.value) }}</div>
            </div>
            <div class="item text-mini flex justify-between">
              <div class="name">类型</div>
              <div class="cp">
                {{ transformType(item.type) }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 其他信息 -->
    <div class="main mt-1">
      <el-card class="box-card">
        <div slot="header">其他信息</div>
        <div class="w-full hide-mini">
          <dl
              class="region-row"
              v-for="(item, index) in otherInfo"
              :key="index"
          >
            <dt class="region-key">
              {{ item.label }}
              <span v-if="item.API" class="cp hover-color bright-color"
              >(API)</span
              >
              <el-popover
                  v-if="item.tips"
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="item.tips"
              >
                <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                />
              </el-popover>
            </dt>
            <dd class="region-value" :class="{ 'bright-color': item.isBright }">
              <pre v-if="item.label === '参数'" class="pre-wrap">{{
                  item.value
                }}</pre>
              <span v-else>{{ item.value || 'N/A' }}</span>
            </dd>
          </dl>
        </div>
        <!--h5端-->
        <div class="show-mini mini-list">
          <div>
            <div
                class="region-row item flex justify-between text-mini"
                v-for="(item, index) in otherInfo"
                :key="index"
            >
              <div class="name region-key">
                {{ item.label }}
                <el-popover
                    v-if="item.tips"
                    placement="top"
                    width="200"
                    trigger="hover"
                    :content="item.tips"
                >
                  <img
                      class="tip tip-icon"
                      src="@/assets/icon/tip1.svg"
                      alt=""
                      slot="reference"
                  />
                </el-popover>
              </div>
              <div class="cp region-value">
                <pre v-if="item.label === '参数'" class="pre-wrap">{{
                    item.value
                  }}</pre>
                <span v-else>{{ item.value | handleNullDatas }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import {getDatas} from "@/utils/method"
import {fetchMessageDetail} from "@/api/common"
import {convertType} from "./blockMix"

export default {
  props: {
    accountId: {
      type: String,
      default: "f049911",
    },
  },
  data() {
    return {
      loading: false,
      messageInfo: [],
      otherInfo: [],
      messageConfig: {},
    }
  },
  computed: {},
  mounted() {
    this.getLists()
  },
  methods: {
    // 获取消息详情
    getLists() {
      getDatas
        .call(
          this,
          fetchMessageDetail({
            messageid: this.$route.params.messageId,
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            const result = res.data
            this.resultData(result)
          }
        })
    },
    // 转换数据
    resultData(result = {}) {
      this.messageConfig = result
      this.messageInfo = [
        {label: "消息ID", value: result.cid},
        {label: "高度", value: result.height, isBright: true},
        {
          label: "时间",
          value: this.$moment(Number(result.timestamp) * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        },
        {
          label: "所属区块",
          value: result.blocks,
          isBright: true,
          path: "belong",
        },
        {label: "发送方", value: result.from, isBright: true},
        {label: "接收方", value: result.to, isBright: true},
        {label: "方法", value: result.method},
        {
          label: "金额",
          value: `${this.$utils.fromWei(result.value)} FIL`,
        },
        // { label: "状态", value: convertStatus(result.status) },
      ]
      console.log(result.height,'hhh')
      this.otherInfo = [
        {label: "版本", value: result.version, API: "#"},
        {label: "Nonce", value: result.nonce},
        {
          label: "Gas Fee Cap",
          value: `${this.$utils.formatNum(
            result.gasFeeCap,
            1000000000
          )} nanoFIL`,
          tips: "用户选择支付的总手续费率",
        },
        {
          label: "Gas Premium",
          value: `${this.$utils.formatNum(result.gasPremium)} attoFIL`,
          tips: "用户选择支付给存储提供者的手续费率",
        },
        {
          label: "Gas 限额",
          value: `${this.$utils.formatNum(result?.gasLimit)} `,
          tips: "该笔交易能消耗的最大Gas量",
        },
        ...(result.height ?
          [{ // 有区块高度展示
            label: "Gas 使用量",
            value: `${this.$utils.formatNum(result?.receipt?.gasUsed)} `,
            tips: "完成这笔交易真实消耗的Gas量",
          }] : []),
        ...(result.height ? [{
          label: "Base Fee",
          value: `${this.$utils.formatNum(result.baseFee, 1000000000)} nanoFIL`,
          tips: "根据区块链网络拥堵状况实时更新的基础手续费率",
        }] : []),
        {
          label: "参数",
          value: result.height ? result.decodedParams : result.params,
        },
        ...(result.height ? [{label: "返回值", value: result.decodedReturnValue}] : [])
      ]
    },
    formatValue(value) {
      if (value.length > 13) {
        return `${this.$utils.fromWei(value, "ether", 18)} FIL`
      } else {
        return `${this.$utils.formatNum(value, 1000000000)} nanoFIL`
      }
    },
    goPage(path, id) {
      if (!path) return
      this.$router.push({path: `/${path}/${id}`})
    },
    transformType(status) {
      return convertType(status)
    },
    // 转换状态
    convertExitCode(status) {
      return status === 0 ? "OK" : "N/A"
    },
  },
}
</script>
<style scoped lang="scss">
.main {
  margin-bottom: 1rem;
}

.message {
  .rank-icon {
    width: 1rem;
  }

  .el-table {
    min-height: auto;
  }

  .show-mini {
    .region-value {
      text-align: right;
    }
  }
}
</style>
