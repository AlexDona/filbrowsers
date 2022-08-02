<template>
  <div class="home container">
    <!--        <div class="banner mt-1"></div>-->
    <!-- 封装成本 -->
    <div class="overview w-full mt-1.8">
      <el-card class="box-card">
        <div slot="header" class="title-bar flex flex-wrap">
          <span class="flex text-card-title">
            封装成本
          </span>
          <el-radio-group class="ml-2" v-model="storageSize" size="mini" @change="changeItem">
            <el-radio-button label="32G">32GB</el-radio-button>
            <el-radio-button label="64G">64GB</el-radio-button>
          </el-radio-group>
<!--          <el-select-->
<!--              :popper-append-to-body="false"-->
<!--              @change="handleSelect"-->
<!--              v-model="selectOptions"-->
<!--              size="mini"-->
<!--              placeholder="请选择"-->
<!--          >-->
<!--            <el-option label="每个扇区" value=""></el-option>-->
<!--            <el-option label="每1TB" value="TB"></el-option>-->
<!--            <el-option label="每1PB" value="PB"></el-option>-->
<!--          </el-select>-->
        </div>
        <div class="flex section mt-1.25 justify-between w-full" :class="{'flex-col': xs, 'gap-1': xs, 'items-center': lg, 'gap-1.88': lg}">
          <div class="flex section-1 items-center" :class="{'flex-1': lg, 'section-padding': lg, 'justify-center': xs}">
            <div>
              <div>封装总成本/TiB</div>
              <div class="mt-0.88"><span class="font-1.75">{{ totalCost.cost }}</span><span> FIL</span></div>
            </div>
          </div>
          <div class="equal" :class="{'mx-auto': xs}"></div>
          <div class="flex section-3 items-center" :class="[...(lg ? ['flex-3', 'section-padding', 'gap-1.88'] : ['section-3-nobg','text-center','justify-center', 'gap-1'])]">
            <div>
              <div>封装质押费/TiB</div>
              <div class="mt-0.88"><span class="font-1.75">{{ totalCost.payment }}</span><span> FIL</span></div>
            </div>
            <div v-if="lg" class="add"></div>
            <i v-else class="el-icon-circle-plus-outline text-2xl"></i>
            <div>
              <div>封装 Gas 费/TiB</div>
              <div class="mt-0.88"><span class="font-1.75">{{ totalCost.gas }}</span><span> FIL</span></div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card mt-1 mt-1.8">
        <div slot="header" class="title-bar flex">
          <span class="flex text-card-title">
            <img class="icon" src="@/assets/icon/survey.svg" alt=""/>
            全网概览
          </span>
          <el-button
              class="hide-mini font-0.88"
              type="text"
              size="small"
              @click="fnOverviewExpand"
          >{{ spreadText }}
            <i :class="!overviewExpand ? 'el-icon-caret-bottom': 'el-icon-caret-top'"></i>
          </el-button
          >
        </div>
        <div
            :class="{ 'overview-expanded': !overviewExpand, 'mt-1.25': lg }"
            class="lg:grid-cols-5 lg:gap-4 grid-cols-2 gap-2 grid item-box"
        >
          <div class="item" v-for="(item, index) in tmp" :key="index">
            <div class="title text-center" style="position: relative">
              {{ item.label }}
              <el-popover
                  :append-to-body="false"
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="item.tips"
                  v-if="item.tips"
              >
                <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                />
              </el-popover>
            </div>
            <div class="number text-center" v-if="overviewData[item.key]">
              <!--                            {{overviewData[item.key]}}-->
              {{
                item.formatter
                    ? item.formatter(overviewData[item.key])
                    : overviewData[item.key]
              }}
            </div>
            <div class="number text-center" v-else>--</div>
          </div>
          <!--                    <div class="item" v-for="(item, index) in totalList">-->
          <!--                        <div class="title text-center">-->
          <!--                            {{item.title}}-->
          <!--                            <el-popover-->
          <!--                                v-if="item.tip"-->
          <!--                                placement="top"-->
          <!--                                width="200"-->
          <!--                                trigger="hover"-->
          <!--                                :content="item.tip">-->
          <!--                                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt=""  slot="reference">-->
          <!--                            </el-popover>-->
          <!--                        </div>-->
          <!--                        <div class="number text-center">{{item.number}}</div>-->
          <!--                    </div>-->
        </div>
        <div class="show-mini">
          <div class="flex justify-center">
            <el-button
                type="text"
                style="color: unset"
                class="mx-auto"
                round
                size="small"
                @click="fnOverviewExpand"
            >{{ spreadText }}
            </el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <el-row :gutter="15" class="chart">
      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="box-card pie-box">
          <div slot="header" class="title-bar flex">
            <span class="flex text-card-title items-center">
              <img class="icon" src="@/assets/icon/power.svg" alt=""/>
              每日全网算力走势图
            </span>
            <div>
              <div class="text-normal cp hover-color" @click="goPage('powerGrowth')">更多 <i
                  class="el-icon-arrow-right"></i></div>
            </div>
          </div>
          <histogram-charts class="mt-1" item="powerGrowth" ref="powerGrowth"></histogram-charts>
          <!--          <powerCharts></powerCharts>-->
        </el-card>
      </el-col>
      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="box-card line-box">
          <div slot="header" class="title-bar flex">
            <span class="flex text-card-title items-center">
              <img class="icon" src="@/assets/icon/gas.svg" alt=""/>
              GAS费趋势图
              <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="基础手续费率：由系统收取并销毁的手续费的实时费率"
              >
                <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                />
              </el-popover>
            </span>
            <div>
              <div class="text-normal cp hover-color" @click="goPage('gas')">更多 <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
          <lineCharts class="mt-1"></lineCharts>
        </el-card>
      </el-col>
    </el-row>
    <!--  行情 start  -->
<!--    <el-card class="quotations mt-1 mt-1.8">-->
<!--      <div slot="header" class="title-bar flex mb-1">-->
<!--          <span class="flex text-card-title">-->
<!--            <img class="icon" src="@/assets/icon/quotations.svg" alt=""/>-->
<!--            FIL 行情-->
<!--          </span>-->
<!--      </div>-->
<!--      <div class="grid mt-1 gap-1" :class="{ 'grid-cols-3': lg, 'grid-area': xs }">-->
<!--        <div class="quotations-flex1 flex-1">-->
<!--          <span class="flex text-card-title flex items-center lg:text-2xl row1">-->
<!--            <img class="icon icon-right" src="@/assets/icon/token_fil.svg" alt=""/>-->
<!--             FIL（Filecoin）-->
<!--          </span>-->
<!--        </div>-->
<!--        <div class="flex items-center" :class="lg ? ['text-2xl', 'quotations-flex-c'] : null">-->
<!--          $98.222-->
<!--        </div>-->
<!--        <div>-->
<!--          <span class="flex text-card-title text-right justify-end">-->
<!--            <img class="icon" src="@/assets/icon/up.svg" alt=""/>-->
<!--             +￥2.6345（ +2.35%）-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="quotations-bg"></div>-->
<!--      <div class="grid">-->
<!--        <div>FIL流通市值：$105.67亿</div>-->
<!--        <div>流通量：$105.67亿</div>-->
<!--        <div>流通率：$105.67亿</div>-->
<!--      </div>-->
<!--    </el-card>-->
    <!--  行情 end  -->
    <!--    <div class="ranking mt-1 mt-1.8">-->
    <!--      <rankPower page="home"></rankPower>-->
    <!--    </div>-->
    <!--  节点排行 start  -->
    <el-row :gutter="15" class="other-rank mb-1.8">
      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="el-tableCard">
          <div slot="header" class="title-bar flex">
            <span class="flex text-card-title">
              <img class="icon" src="@/assets/icon/rank.svg" alt=""/>
              节点排行
            </span>
            <div class="text-normal cp hover-color" @click="goPage('ranks', 1)">更多 <i class="el-icon-arrow-right"></i>
            </div>
            <!--                        <el-button round size="small" >更多</el-button>-->
          </div>
          <el-table
              header-cell-class-name="table-header"
              v-loading="loading"
              height="464"
              class="w-full hide-mini mt-1.25"
              :data="powerList"
          >
            <el-table-column
                align="center"
                prop="height"
                label="排名"
                width="100"
            >
              <template slot-scope="scope">
                <img
                    v-if="scope.$index + 1 < 4"
                    class="rank-icon"
                    :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                width="120"
                label="节点ID"
            >
              <template slot-scope="{ row }">
                <span class="cp bright-color" @click="goPath('address', row.storageProvider)">
                  {{ row.storageProvider }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="address"
                width="80"
                label="标签"
            >
              <template slot-scope="{ row }">
                <span>{{ row.tag | handleNullDatas }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="address"
                label="有效算力/占比"
            >
              <template slot-scope="scope">
                <el-progress
                    class="flex progress1"
                    :show-text="false"
                    :percentage="
                      $utils.setNumber(
                        scope.row.effectivePower,
                        scope,
                        effectivePower
                      )
                    "
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="address"
                label="24h存储效率"
            >
              <template slot-scope="{ row }">
                {{
                  (
                      $utils.fromWei(row.twentyfourBlockReward) /
                      $utils.unitConversion(row.effectivePower, 6, 4, false)
                  ).toFixed(2)
                }}
                FiL/TiB
              </template>
            </el-table-column>
          </el-table>
          <!--   h5节点排行   -->
          <el-table class="w-full show-mini" :data="powerList">
            <el-table-column align="center" prop="height" label="排名" width="50">
              <template slot-scope="scope">
                <img
                    v-if="scope.$index + 1 < 4"
                    class="rank-icon"
                    :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="节点ID">
              <template slot-scope="{row}">
                <span @click="goPath('address', row.storageProvider)">{{ row.storageProvider }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="标签">
              <template slot-scope="{ row }">
                <span>{{ row.tag | handleNullDatas }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!--  节点排行 end  -->

      <!--   转账排行 start    -->
      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-card class="el-tableCard">
          <div slot="header" class="title-bar flex">
            <span class="flex text-card-title">
              <img class="icon" src="@/assets/icon/rich.svg" alt=""/>
              转账排行
            </span>
            <div class="text-normal cp hover-color" @click="goPage('transaction')">更多 <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <el-table
              v-loading="loading"
              height="464px"
              class="w-full hide-mini mt-1.25"
              :data="transactionList"
          >
            <el-table-column align="center" label="发送方" width="160">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    :title="row.from"
                    @click="goPath('account', row.from)"
                >{{ row.from ? $utils.centerEllipsis(row.from) : 'N/A' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" width="100">
              <template>
                <img style="width: 1.56rem;" :src="require('@/assets/icon/promtion.png')" alt=""/>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" label="接收方">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    :title="row.to"
                    @click="goPath('address', row.to)"
                >{{ $utils.centerEllipsis(row.to) }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="区块高度">
              <template slot-scope="{ row }">
                <span
                    class="cp hover-color bright-color"
                    @click="goPath('height', row.height)"
                >{{ row.height }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="数额">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.value, "ether", 0) }} FIL
              </template>
            </el-table-column>
          </el-table>
          <!--   h5转账排行   -->
          <el-table class="w-full show-mini" :data="transactionList">
            <el-table-column align="center" label="发送方" min-width="120">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    :title="row.from"
                    @click="goPath('account', row.from)"
                >{{ row.from ? $utils.centerEllipsis(row.from) : 'N/A' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template>
                <img style="width: 1.56rem;" :src="require('@/assets/icon/promtion.png')" alt=""/>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width="120" label="接收方">
              <template slot-scope="{ row }">
                <span
                    class="cp bright-color"
                    :title="row.to"
                    @click="goPath('address', row.to)"
                >{{ $utils.centerEllipsis(row.to) }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!--  转账排行 end  -->
    </el-row>
    <!--    <el-row :gutter="15" class="other-rank mb-1.8">-->
    <!--      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">-->
    <!--        <el-card class="box-card">-->
    <!--          <div slot="header" class="title-bar flex">-->
    <!--            <span class="flex">-->
    <!--              <img class="icon" src="@/assets/icon/line-chart.svg" alt="" />-->
    <!--              最新区块-->
    <!--            </span>-->
    <!--            &lt;!&ndash;                        <el-button round size="small" >更多</el-button>&ndash;&gt;-->
    <!--          </div>-->
    <!--          <el-table-->
    <!--            v-loading="loading"-->
    <!--            height="464"-->
    <!--            class="w-full hide-mini"-->
    <!--            :data="blockList"-->
    <!--          >-->
    <!--            <el-table-column-->
    <!--              align="center"-->
    <!--              prop="height"-->
    <!--              label="高度"-->
    <!--              min-width="120"-->
    <!--            >-->
    <!--              <template slot-scope="scope">-->
    <!--                <div-->
    <!--                  @click="goPath('height', scope.row.blockHighDegree)"-->
    <!--                  class="cp color-block"-->
    <!--                >-->
    <!--                  {{ scope.row.blockHighDegree }}-->
    <!--                </div>-->
    <!--                <div>{{ time(scope.row.timestamp, scope.$index) }}</div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              align="center"-->
    <!--              prop="name"-->
    <!--              width="120"-->
    <!--              label="区块ID"-->
    <!--            >-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  <div-->
    <!--                    class="cp hover-color"-->
    <!--                    :title="item.cid"-->
    <!--                    @click="goPath('belong', item.cid)"-->
    <!--                  >-->
    <!--                    {{ $utils.centerEllipsis(item.cid, 4) }}-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              align="center"-->
    <!--              prop="address"-->
    <!--              min-width="100"-->
    <!--              label="存储提供者"-->
    <!--            >-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  <div-->
    <!--                    class="cp hover-color"-->
    <!--                    @click="goPath('address', item.provider)"-->
    <!--                  >-->
    <!--                    {{ item.provider }}-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              align="center"-->
    <!--              prop="address"-->
    <!--              width="60"-->
    <!--              label="标签"-->
    <!--            >-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  {{ "&#45;&#45;" }}-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              align="center"-->
    <!--              prop="address"-->
    <!--              width="60"-->
    <!--              label="消息"-->
    <!--            >-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  {{ item.messageCount }}-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              width="100"-->
    <!--              align="center"-->
    <!--              prop="address"-->
    <!--              label="奖励"-->
    <!--            >-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  {{ $utils.fromWei(item.reward, "ether", 2) }} FIL-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--          <el-table class="w-full show-mini" :data="blockList">-->
    <!--            <el-table-column align="center" prop="height" label="高度">-->
    <!--              <template slot-scope="scope">-->
    <!--                <div-->
    <!--                  class="color-block"-->
    <!--                  @click="goPath('height', scope.row.blockHighDegree)"-->
    <!--                >-->
    <!--                  {{ scope.row.blockHighDegree }}-->
    <!--                </div>-->
    <!--                <div>{{ time(scope.row.timestamp, scope.$index) }}</div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="center" prop="address" label="存储提供者">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  <div-->
    <!--                    class="cp hover-color"-->
    <!--                    @click="goPath('account', item.provider)"-->
    <!--                  >-->
    <!--                    {{ item.provider }}-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="center" prop="address" label="奖励">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <div v-for="(item, index) in row.Blocks" :key="index">-->
    <!--                  {{ $utils.fromWei(item.reward, "ether", 2) }} FIL-->
    <!--                </div>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--      <el-col class="mt-1 mt-1.8" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">-->
    <!--        <el-card class="box-card">-->
    <!--          <div slot="header" class="title-bar flex">-->
    <!--            <span class="flex">-->
    <!--              <img class="icon" src="@/assets/icon/rich.svg" alt="" />-->
    <!--              富豪榜-->
    <!--            </span>-->
    <!--            <el-button round size="small" @click="goPage('rich')"-->
    <!--              >更多</el-button-->
    <!--            >-->
    <!--          </div>-->
    <!--          <el-table-->
    <!--            v-loading="loading"-->
    <!--            height="464px"-->
    <!--            class="w-full hide-mini"-->
    <!--            :data="richList"-->
    <!--          >-->
    <!--            <el-table-column align="center" label="排名" width="60">-->
    <!--              <template slot-scope="scope">-->
    <!--                <img-->
    <!--                  v-if="scope.$index + 1 < 4"-->
    <!--                  class="rank-icon"-->
    <!--                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"-->
    <!--                />-->
    <!--                <span v-else>{{ scope.$index + 1 }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="center" min-width="100" label="地址">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <span-->
    <!--                  class="cp hover-color"-->
    <!--                  @click="goPath('account', row.accountName)"-->
    <!--                  >{{ $utils.centerEllipsis(row.accountName, 5) }}</span-->
    <!--                >-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column width="80" align="center" label="标签">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <span v-if="row.tag">{{ row.tag }}</span>-->
    <!--                <span v-else>&#45;&#45;</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="center" label="余额">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                {{ $utils.fromWei(row.balance, "ether", 0) }} FIL-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column width="80" align="center" label="余额占比">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                {{-->
    <!--                  $utils.forMatNumber(-->
    <!--                    $XEUils.divide(row.balance, totalSupply) * 100,-->
    <!--                    2-->
    <!--                  )-->
    <!--                }}%-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--          <el-table class="w-full show-mini" :data="richList">-->
    <!--            <el-table-column align="center" label="排名" width="50">-->
    <!--              <template slot-scope="scope">-->
    <!--                <img-->
    <!--                  v-if="scope.$index + 1 < 4"-->
    <!--                  class="rank-icon"-->
    <!--                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"-->
    <!--                />-->
    <!--                <span v-else>{{ scope.$index + 1 }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column width="120" align="center" label="地址">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                <span-->
    <!--                  class="cp hover-color"-->
    <!--                  @click="goPath('account', row.accountName)"-->
    <!--                  >{{ $utils.centerEllipsis(row.accountName, 5) }}</span-->
    <!--                >-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="center" label="余额/占比">-->
    <!--              <template slot-scope="{ row }">-->
    <!--                {{ $utils.fromWei(row.balance, "ether", 0) }} FIL/{{-->
    <!--                  $utils.forMatNumber(-->
    <!--                    $XEUils.divide(row.balance, totalSupply) * 100,-->
    <!--                    2-->
    <!--                  )-->
    <!--                }}%-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>
<script>
import {mapState} from "vuex"
import rankPower from "../components/rankPower"
import lineCharts from "../components/lineCharts"
import powerCharts from "./components/lineCharts"
import {getDatas} from "@/utils/method"
import {fetchAllData, fetchRichData, fetchBlockData, packConst, fetchPowerData, largeTransaction} from "@/api/common"
import HistogramCharts from "@/views/components/histogramCharts"

export default {
  components: {
    // rankPower,
    lineCharts,
    HistogramCharts
  },
  data() {
    const vm = this
    // const formatter = (v) => {
    //     console.log(Number(Number(v).toFixed(2)).toLocaleString())
    // }
    return {
      effectivePower: 0, // 排行第一有效算力
      totalPower: 0,
      params: {
        page: 1,
        page_size: 10,
      },
      transactionList: [], // 转账排行
      powerList: [], // 节点排行
      encapsulationData: {},
      selectOptions: 'TB',
      storageSize: '32G',
      spreadText: "展开全部",
      loading: true,
      overviewExpand: false,
      activeIndex: 1,
      tmp: [],
      spreadTmp: [], // 展开数据
      totalSupply: 0,
      overviewData: {},
      richList: [],
      blockList: [],
      timer: "",
      overviewTimer: "",
      blockTimer: "",
      columns: [
        {
          key: "blockHigh",
          formatter(v) {
            return vm.$XEUils.commafy(v)
          },
        },
        {
          key: "blockRecentTime",
          formatter(v) {
            return vm.$utils.formatTime(v)
          },
        },
        {
          key: "powerAllNet",
          formatter(v) {
            return vm.$utils.unitConversion(v, 4)
          },
        },
        {
          key: "rewardsPerBolck",
          formatter(v) {
            return `${Number(v).toFixed(4)} FIL`
          },
        },
        {
          key: "averageBlockInterval",
          formatter(v) {
            return `${Number(v).toFixed(2)} 秒`
          },
        },
        {
          key: "PowerIn24H",
        },
        {
          key: "blockRewardIn24h",
          formatter(v) {
            return `${Number(v).toFixed(4)} FIL/TiB`
          },
        },
        {
          key: "totalAccounts",
        },
        {
          key: "recentTwentyfourOutput",
          formatter(v) {
            return `${Number(v).toFixed(0)} FIL`
          },
        },
        {
          key: 'activeProvider'
        },
        {
          key: "twentyfourMessageCount",
        },
        {
          key: "averageBlocksPerHeight",
          formatter(v) {
            return `${Number(v).toFixed(2)}`
          },
        },
        {
          key: "avgMessagesTipSet",
          formatter(v) {
            return `${Number(v).toFixed(4)}`
          },
        },
        {
          key: "avgGasPremium",
          formatter(v) {
            return `${Number(v).toFixed(4)}`
          },
        },
        // {
        //   key: "totalAccounts",
        // },
        // {
        //   key: "recentTwentyfourOutput",
        //   formatter(v) {
        //     return `${Number(v).toFixed(0)} FIL`
        //   },
        // },
        // {
        //   key: "currentSectorPledgeAmount",
        //   formatter(v) {
        //     return `${v} FIL/32GiB`
        //   },
        // },
        // {
        //   key: "filPledgeAmount",
        //   formatter(v) {
        //     return `${Number(v).toFixed(0)} FIL`
        //   },
        // },
        // {
        //   key: "filCirculation",
        //   formatter(v) {
        //     return `${v} FIL`
        //   },
        // },
        // {
        //   key: "costAddPower",
        //   formatter(v) {
        //     return `${Number(v).toFixed(2)} FIL/TiB`
        //   },
        // },
        // {
        //   key: "currentBaseRate",
        // },
        // {
        //   key: "filDestroyed",
        //   formatter(v) {
        //     return `${v} FIL`
        //   },
        // },
        // {
        //   key: "filTotalSupply",
        //   formatter(v) {
        //     return `${v} FIL`
        //   },
        // },
        // {
        //   key: "filCirculationRate",
        //   formatter(v) {
        //     return `${(Number(v) * 100).toFixed(2)} %`
        //   },
        // },
        // {
        //   key: "gasIn32GB",
        //   formatter(v) {
        //     return `${ Number(v) } FIL/TiB`
        //   },
        // },
        // {
        //   key: "gasIn64GB",
        //   formatter(v) {
        //     return `${ Number(v) } FIL/TiB`
        //   }
        // },
      ],
      type: ''
    }
  },
  computed: {
    ...mapState({
      locale: (state) => state.modules.locale,
      lg: state => state.modules.lg,
      xs: state => state.modules.xs
    }),
    totalCost() {
      const resData = this.encapsulationData
      switch (this.selectOptions) {
        case 'TB':
          return this.storageSize === '32G' ?
            {
              cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas32T, resData.payment32T), 4),
              gas: this.$utils.forMatNumber(resData.gas32T, 4),
              payment: this.$utils.forMatNumber(resData.payment32T, 4)
            }
            :
            {
              cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas64T, resData.payment32T), 4),
              gas: this.$utils.forMatNumber(resData.gas64T, 4),
              payment: this.$utils.forMatNumber(resData.payment32T, 4)
            }
        // case 'PB':
        //   return this.storageSize === '32G' ?
        //     {
        //       cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas32P, resData.payment32P), 4),
        //       gas: this.$utils.forMatNumber(resData.gas32P, 4),
        //       payment: this.$utils.forMatNumber(resData.payment32P, 4)
        //     }
        //     :
        //     {
        //       cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas64P, resData.payment64P), 4),
        //       gas: this.$utils.forMatNumber(resData.gas64P, 4),
        //       payment: this.$utils.forMatNumber(resData.payment64P, 4)
        //     }
        // default:
        //   return this.storageSize === '32G' ?
        //     {
        //       cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas32, resData.payment32), 4),
        //       gas: this.$utils.forMatNumber(resData.gas32, 4),
        //       payment: this.$utils.forMatNumber(resData.payment32, 4)
        //     }
        //     :
        //     {
        //       cost: this.$utils.forMatNumber(this.$XEUils.add(resData.gas64, resData.payment64), 4),
        //       gas: this.$utils.forMatNumber(resData.gas64, 4),
        //       payment: this.$utils.forMatNumber(resData.payment64, 4)
        //     }
      }

    }
  },
  watch: {
    locale: {
      handler(newVal, oldValue) {
        this.columnsLabel()
      },
    },
    overviewExpand(val) {
      if (val) this.spreadText = "收起"
      else this.spreadText = "展开"
    },
  },
  mounted() {
    this.getData()
    this.getAllData()
    this.columnsLabel()
    this.getRichData()
    this.getBlockData()
    this.getPowerList()
    this.getLargeTransaction()
    // 小于1024全不显示概述
    window.onresize = () => {
      if (document.body.clientWidth <= 1024) {
        this.overviewExpand = true
      }
    }
    const _this = this
    // 最新区块计时
    this.timer = setInterval(this.columnsLabel, 1000)
    // 最新区块列表计时
    this.blockTimer = setInterval(this.newBlockList, 1000)
    // 全网概述
    this.overviewTimer = setInterval(this.getAllData, 30000)
    // 最新区块
    this.blockTimer = setInterval(this.getBlockData, 30000)
  },
  beforeDestroy() {
    // 销毁定时器
    window.clearInterval(this.timer)
    window.clearInterval(this.blockTimer)
    window.clearInterval(this.overviewTimer)
    window.clearInterval(this.blockTimer)
  },
  methods: {
    changeItem(val) {
      this.storageSize = val
    },
    handleSelect(val) {
      this.selectOptions = val
    },
    getPowerList() {
      getDatas
        .call(
          this,
          fetchPowerData(this.params),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            if (this.params.page === 1)
              this.effectivePower = res.data?.list[0]?.effectivePower // 第一页时获取排行第一有效算力
            this.totalPower = res.data.totalPower
            this.powerList = res.data.list || []
          }
          // console.log(this.powerList, 'this.powerList')
        })
    },
    getLargeTransaction() {
      getDatas
        .call(
          this,
          largeTransaction({
            addr: '',
            page_index: 1,
            page_size: 10
          }),
          "loading"
        )
        .then((res) => {
          if (res.data) {
            this.transactionList = res.data?.largeTransactions ?? []
          }
          // console.log(this.powerList, 'this.powerList')
        })
    },
    async getData() {
      const res = await packConst({
        type: this.storageSize
      })
      if (res.data) {
        this.encapsulationData = res.data
      }
    },
    newBlockList() {
      let list = []
      for (let i = 0; i < this.blockList.length; i++) {
        list.push(Object.assign({}, this.blockList[i]))
      }
      this.blockList = list
    },
    time(val) {
      return this.$utils.formatTime(val)
    },
    fnOverviewExpand() {
      this.overviewExpand = !this.overviewExpand
    },
    // 获取全网概述
    getAllData() {
      getDatas.call(this, fetchAllData()).then((res) => {
        if (res.data) {
          this.overviewData = res.data
        }
      })
    },
    // 获取富人榜
    getRichData() {
      getDatas
        .call(this, fetchRichData({page: 0, page_size: 10}), "loading")
        .then((res) => {
          if (res.data) {
            this.totalSupply = res.data.totalSupply
            this.richList = res.data.list || []
          }
        })
    },
    // 获取最新区块列表
    getBlockData() {
      getDatas
        .call(this, fetchBlockData({page: 0, page_size: 10}), "loading")
        .then((res) => {
          if (res.data) {
            this.blockList = res.data?.list
          }
        })
    },
    // 获取全网概述标题
    columnsLabel() {
      const labels = this.$t("home.meta")
      let tmp = this.columns.map((col, index) => {
        return {
          ...col,
          label: labels[index].label,
          tips: labels[index].tips,
        }
      })
      tmp = this.extend ? tmp.slice(0, 10) : tmp
      this.tmp = tmp
    },
    goPage(name) {
      this.$router.push({name})
    },
    goPath(name, id) {
      this.$router.push({path: `/${name}/${id}`})
    },
  },
}
</script>
<style scoped lang="scss">
.overview {
  .item-box {
    .item {
      padding: 1.5rem 10px;
      background-color: #F6F9FCFF;
      border-radius: 0.56rem;

      .title {
        line-height: 20px;
        color: #a0aec0;
        font-size: 1rem;

        .tip {
          margin-left: 3px;
        }
      }

      .number {
        margin-top: 1rem;
        font-size: 1.5rem;
        color: #000;
      }
    }
  }
  .gap-1\.88 {
    gap: 1.88rem;
  }
  .gap-1 {
    gap: 1rem;
  }
  .section {
    color: #fff;
    padding-bottom: 0.8rem;

    .mt-0\.88 {
      margin-top: 0.88rem;
    }

    .font-1\.75 {
      font-size: 1.75rem;
    }

    .section-1 {
      border-radius: 0.56rem;
      overflow: hidden;
      background: url('../../assets/img/section1.png') no-repeat right 2.8rem / 8.8rem, linear-gradient(122deg, #3ca2ff 57%, #45a9ff 33%);
      height: 147px;
      position: relative;
    }

    .section-3-nobg {
      background: linear-gradient(122deg, #3c82ff 70%, #4579ff 33%) !important;
    }
    .section-3 {
      border-radius: 0.56rem;
      overflow: hidden;
      background: url('../../assets/img/section2.png') no-repeat right 2.8rem / 8.8rem 8.8rem, linear-gradient(122deg, #3c82ff 70%, #4579ff 33%);
      height: 147px;
      position: relative;
    }

    .section-padding {
      padding-left: 3.75rem;
      padding-right: 3.75rem;
    }
    .equal {
      width: 1.88rem;
      height: 1.94rem;
      background: url('../../assets/icon/equals.svg') no-repeat center;
    }

    .add {
      width: 1.88rem;
      height: 1.94rem;
      background: url('../../assets/icon/add.svg') no-repeat center;
    }
  }
}

.color-block {
  color: #409eff;
}

.other-rank {
  padding-bottom: 1rem;
}

.overview-expanded:nth-child(n + 11) {
  display: none;
}

.overview-expanded > :nth-child(n + 11) {
  display: none;
}
.quotations {
  ::v-deep {
    .el-card__header {
      border-bottom: 1px solid #EBEEF5 !important;
    }
  }
  .grid-area {
    grid-template-areas: 'grid-top grid-top'
    'grid-left grid-right';
  }
  .grid-top {
    grid-area: grid-top;
  }
  .grid-left {
    grid-area: grid-left;
  }
  .grid-right {
    grid-area: grid-right;
  }
  .quotations-flex-l {
    flex: 1;
  }
  .quotations-flex-c {
    flex: 2;
  }
  .quotations-bg {
    height: 0;
    position: relative;
    &:after {
      content: "";
      display: block;
      height: 20px;
      width: 108%;
      top: 0;
      left: -5%;
      right: 0;
      position: absolute;
      background: #F2F6FC;
    }
  }
}
</style>
