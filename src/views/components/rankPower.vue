<template>
  <div class="ranks container">
    <el-card class="el-tableCard pie-box">
      <div slot="header" class="title-bar">
        <div class="flex  justify-between">
          <span class="flex text-card-title">
            <img class="icon" src="@/assets/icon/ranks.svg" alt=""/>
            存储服务排行榜
          </span>
          <div class="show-mini">
            <!-- 小屏幕选项 -->
            <el-select
              :popper-append-to-body="false"
              @change="changeTime"
              v-if="activeIndex == 2"
              style="width: 100px"
              size="mini"
              v-model="time"
              placeholder="请选择"
            >
              <el-option label="24小时" value="1"></el-option>
              <el-option label="7天" value="2"></el-option>
              <el-option label="30天" value="3"></el-option>
              <el-option label="1年" value="4"></el-option>
            </el-select>
            <div class="show-mini">
              <!-- 小屏幕选项 -->
              <el-select
                :popper-append-to-body="false"
                @change="changeTime"
                v-if="activeIndex == 3"
                style="width: 100px"
                size="mini"
                v-model="gasTime"
                placeholder="请选择"
              >
                <el-option label="24小时" value="24h"></el-option>
                <el-option label="7天" value="7d"></el-option>
                <el-option label="30天" value="30d"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="bar mt-1/2 justify-between" :class="{'flex': lg}">
          <div class="left flex" :class="{'flex-wrap': xs}">
            <el-button
              @click="cutoverRank(1)"
              :class="{ isplain: activeIndex === 1 }"
              round
              size="mini"
            >有效算力
            </el-button
            >
            <el-button
              @click="cutoverRank(2)"
              :class="{ isplain: activeIndex === 2 }"
              round
              size="mini"
            >出块数
            </el-button
            >
            <el-button
              @click="cutoverRank(3)"
              :class="{ isplain: activeIndex === 3 }"
              round
              size="mini"
            >幸运值
            </el-button
            >
            <el-button
              @click="cutoverRank(4)"
              :class="{ isplain: activeIndex === 4 }"
              round
              size="mini"
            >算力增速
            </el-button
            >
            <el-button
              @click="cutoverRank(5)"
              :class="{ isplain: activeIndex === 5 }"
              round
              size="mini"
            >Gas消耗
            </el-button
            >
          </div>
          <div class="right" v-if="activeIndex == 2">
            <el-radio-group
              class="hide-mini"
              v-model="time"
              size="mini"
              @change="changeTime"
            >
              <el-radio-button label="1">24时</el-radio-button>
              <el-radio-button label="2">7天</el-radio-button>
              <el-radio-button label="3">30天</el-radio-button>
              <el-radio-button label="4">1年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="right" v-if="activeIndex === 3">
            <el-radio-group
              class="hide-mini"
              v-model="gasTime"
              size="mini"
              @change="changeTime"
            >
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
            </el-radio-group>
          </div>
          <div class="right flex items-center gap-1" :class="{'mt-1/2': xs}" v-if="activeIndex === 4">
            <el-select
              :popper-append-to-body="false"
              class="right"
              @change="fnSelectItem"
              v-model="params.sector"
              size="mini"
              placeholder="请选择"
            >
              <el-option label="全部扇区" value=""></el-option>
              <el-option label="32G扇区" value="32GiB"></el-option>
              <el-option label="64G扇区" value="64GiB"></el-option>
            </el-select>
            <el-radio-group
              class="hide-mini"
              v-model="time"
              size="mini"
              @change="changeGasDuration"
            >
              <el-radio-button label="1">24时</el-radio-button>
              <el-radio-button label="2">7天</el-radio-button>
              <el-radio-button label="3">30天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div style="min-height: 300px" v-loading="loading">
        <!-- 缩略版小屏幕 -->
        <div class="show-mini w-full">
          <!-- 有效算力 缩略版 -->
          <el-table
            v-show="activeIndex === 1 && page === 'home'"
            class="w-full rank-table"
            :data="powerList"
          >
            <el-table-column align="center" prop="" width="50px" label="排名">
              <template slot-scope="scope">
                <img v-if="scope.$index+1 < 4" class="rank-icon"
                     :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者">
              <template slot-scope="scope">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: scope.row.storageProvider })">
                  {{ scope.row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="有效算力/占比">
              <template slot-scope="scope">
                {{ $utils.unitConversion(scope.row.effectivePower) }} /
                {{
                  $utils.forMatNumber(
                    $XEUils.divide(scope.row.effectivePower, totalPower) * 100,
                    2
                  )
                }}%
              </template>
            </el-table-column>
          </el-table>
          <!-- 有效算力 详细 -->
          <div
            class="show-mini mini-list"
            v-show="activeIndex === 1 && page === 'all'"
          >
            <div class="rows" v-for="(item, index) in powerList" :key="index">
              <div class="title text-mini" @click="goPath({ path: 'address', id: item.storageProvider })">
                <img v-if="index+1 < 4 && params.page === 1" class="icon"
                     :src="require(`@/assets/icon/rank${index+1}.png`)"/>
                <span v-else class="rank-num text-center">{{
                    (params.page - 1) * params.page_size + index + 1
                  }}</span>
                {{ item.storageProvider }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">有效算力</div>
                <div>{{ $utils.unitConversion(item.effectivePower, 2) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">有效算力占比:</div>
                <div>
                  {{
                    $utils.forMatNumber(
                      $XEUils.divide(item.effectivePower, totalPower) * 100,
                      2
                    )
                  }}%
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">24h出块奖励:</div>
                <div>{{ $utils.fromWei(item.twentyfourBlockReward) }} FIL</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">24h算力增量:</div>
                <div>
                  {{ $utils.unitConversion(item.twentyfourPowerIncrement, 2) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">24h存储效率:</div>
                <div>
                  {{
                    (
                      $utils.fromWei(item.twentyfourBlockReward) /
                      $utils.unitConversion(item.effectivePower, 6, 4, false)
                    ).toFixed(2)
                  }}
                  FiL/TiB
                </div>
              </div>
            </div>
          </div>
          <!-- 出块数 缩略版 -->
          <el-table
            v-show="activeIndex === 2 && page === 'home'"
            class="w-full rank-table"
            :data="blockList"
          >
            <el-table-column align="center" prop="" label="排名" width="50">
              <template slot-scope="scope">
                <img v-if="scope.$index+1 < 4" class="rank-icon"
                     :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者">
              <template slot-scope="{ row }" @click="goPath({ path: 'address', id: row.storageProvider })">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.storageProvider })">
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="出块份数/幸运值">
              <template slot-scope="{ row }">
                {{ row.blocksOutput }} /
                {{ $utils.forMatNumber(row.luckyValue * 100, 2) }}%
              </template>
            </el-table-column>
          </el-table>
          <!-- 出块数 详细 -->
          <div
            class="show-mini mini-list"
            v-show="activeIndex === 2 && page === 'all'"
          >
            <div class="rows" :key="index" v-for="(item, index) in blockList">
              <div class="title text-mini" @click="goPath({ path: 'address', id: item.storageProvider })">
                <img v-if="index+1 < 4 && params.page === 1" class="icon"
                     :src="require(`@/assets/icon/rank${index+1}.png`)"/>
                <span v-else class="rank-num text-center">{{
                    (params.page - 1) * params.page_size + index + 1
                  }}</span>
                {{ item.storageProvider }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">
                  出块份数
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="hover"
                    content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和"
                  >
                    <img
                      class="tip tip-icon"
                      src="@/assets/icon/tip1.svg"
                      alt=""
                      slot="reference"
                    />
                  </el-popover>
                  :
                </div>
                <div>{{ item.blocksOutput }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">幸运值:</div>
                <div>{{ $utils.forMatNumber(item.luckyValue * 100, 2) }}%</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">出块奖励:</div>
                <div>{{ $utils.fromWei(item.blockReward) }} FIL</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">出块奖励占比:</div>
                <div>
                  {{ ((item.blocksOutput / totalBlock) * 100).toFixed(2) }}%
                </div>
              </div>
            </div>
          </div>
          <!-- 幸运值 缩略版 -->
          <el-table
            v-show="activeIndex === 3 && page === 'home'"
            class="w-full rank-table"
            :data="blockList"
          >
            <el-table-column align="center" prop="" label="排名" width="50">
              <template slot-scope="scope">
                <img v-if="scope.$index+1 < 4" class="rank-icon"
                     :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者">
              <template slot-scope="{ row }" @click="goPath({ path: 'address', id: row.storageProvider })">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.storageProvider })">
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" label="出块份数/幸运值">
              <template slot-scope="{ row }">
                {{ row.blocksOutput }} /
                {{ $utils.forMatNumber(row.luckyValue * 100, 2) }}%
              </template>
            </el-table-column>
          </el-table>
          <!-- 幸运值 详细 -->
          <div
            class="show-mini mini-list"
            v-show="activeIndex === 3 && page === 'all'"
          >
            <el-radio-group class="mb-3/4" size="mini" v-model="orderValue" @change="changeOrder">
              <el-radio-button
                label="1"
              >
                升序
              </el-radio-button
              >
              <el-radio-button
                label="-1"
              >
                降序
              </el-radio-button
              >
            </el-radio-group>
            <div class="rows" :key="index" v-for="(item, index) in luckList">
              <div class="title text-mini" @click="goPath({ path: 'address', id: item.miner })">
                <img v-if="index+1 < 4 && params.page === 1" class="icon"
                     :src="require(`@/assets/icon/rank${index+1}.png`)"/>
                <span v-else class="rank-num text-center">{{
                    (params.page - 1) * params.page_size + index + 1
                  }}</span>
                {{ item.miner }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">
                  出块份数
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="hover"
                    content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和"
                  >
                    <img
                      class="tip tip-icon"
                      src="@/assets/icon/tip1.svg"
                      alt=""
                      slot="reference"
                    />
                  </el-popover>
                  :
                </div>
                <div>{{ item.minedBlocks }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">幸运值:</div>
                <div>{{ $utils.forMatNumber(item.luckyValue * 100, 2) }}%</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">出块奖励:</div>
                <div>{{ item.blockRewardStr }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">出块奖励占比:</div>
                <div>
                  {{ item.blockRewardPercent }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">有效算力:</div>
                <div>
                  {{ item.qualityPowerStr }}
                </div>
              </div>
            </div>
          </div>
          <!-- 算力增速 缩略版 -->
          <el-table
            v-show="activeIndex === 4 && page === 'home'"
            class="w-full rank-table"
            :data="speedList"
          >
            <el-table-column align="center" label="排名" width="50">
              <template slot-scope="scope">
                <img v-if="scope.$index+1 < 4" class="rank-icon"
                     :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.storageProvider })">
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="算力增速">
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.dailyPowerGrowth, 2, 4) }} / 天
              </template>
            </el-table-column>
          </el-table>

          <!-- 算力增速 详细 -->
          <div
            class="show-mini mini-list"
            v-show="activeIndex === 4 && page === 'all'"
          >
            <div class="rows" :key="index" v-for="(item, index) in speedList">
              <div class="title text-mini" @click="goPath({ path: 'address', id: item.storageProvider })">
                <img v-if="index+1 < 4 && params.page === 1" class="icon"
                     :src="require(`@/assets/icon/rank${index+1}.png`)"/>
                <span v-else class="rank-num text-center">{{
                    (params.page - 1) * params.page_size + index + 1
                  }}</span>
                {{ item.storageProvider }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">算力增速:</div>
                <div>
                  {{ $utils.unitConversion(item.dailyPowerGrowth, 2, 4) }} / 天
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">存储节点当量:</div>
                <div>{{ $utils.forMatNumber(item.storageNodeNumber, 2) }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">算力增量:</div>
                <div>
                  {{ $utils.unitConversion(item.powerIncrement, 2) }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">有效算力:</div>
                <div>{{ $utils.unitConversion(item.effectivePower, 2) }}</div>
              </div>
            </div>
          </div>
          <!-- gas消耗 缩略版 -->
          <el-table
            v-show="activeIndex === 5 && page === 'home'"
            class="w-full rank-table"
            :data="gasList"
          >
            <el-table-column align="center" label="排名" width="50">
              <template slot-scope="scope">
                <img v-if="scope.$index+1 < 4" class="rank-icon"
                     :src="require(`@/assets/icon/rank${scope.$index+1}.png`)"/>
                <span v-else>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="节点">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.miner })">
                  {{ row.miner | handleNullDatas }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标签">
              <template slot-scope="{ row }">
                {{ row.label || '--' }}
              </template>
            </el-table-column>
          </el-table>

          <!-- gas消耗 mini 详细 -->
          <div
            class="show-mini mini-list"
            v-show="activeIndex === 5 && page === 'all'"
          >
            <div class="rows" :key="index" v-for="(item, index) in gasList">
              <div class="title text-mini" @click="goPath({ path: 'address', id: item.miner })">
                <img v-if="index+1 < 4 && params.page === 1" class="icon"
                     :src="require(`@/assets/icon/rank${index+1}.png`)"/>
                <span v-else class="rank-num text-center">{{
                    (params.page - 1) * params.page_size + index + 1
                  }}</span>
                {{ item.miner }}
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">节点:</div>
                <div>
                  {{ item.miner | handleNullDatas }}
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">标签:</div>
                <div>{{ item.label | handleNullDatas }}</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">消耗gas占比:</div>
                <div>
                  {{ $utils.fromWei(item.minerGas, 'ether', 4) }} /
                  {{
                    $utils.forMatNumber(
                      $XEUils.divide(item.minerGas, maxMinerGasUsed),
                      2
                    )
                  }}%
                </div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">消耗Gas:</div>
                <div> {{ $utils.fromWei(item.minerGas, 'ether', 4) }} FIL / 天</div>
              </div>
              <div class="item text-mini flex justify-between">
                <div class="name">扇区大小:</div>
                <div> {{ item.sectorSize }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--  小屏幕结束      -->

        <!-- 大屏幕 -->
        <div class="hide-mini w-full">
          <!-- 有效算力 -->
          <el-table
            v-show="activeIndex === 1"
            class="w-full rank-table"
            min-height="300px"
            :data="powerList"
          >
            <el-table-column align="center" prop="" label="排名" width="100">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    (params.page - 1) * params.page_size + scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者" width="150">
              <template slot-scope="{ row }">
                <div
                  class="cp hover-color"
                  @click="goPath({ path: 'address', id: row.storageProvider })"
                >
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" width="80" label="标签">
              <template slot-scope="{ row }">
                <span v-if="row.tag">{{ row.tag }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              width="320"
              label="有效算力/占比"
            >
              <template slot-scope="scope">
                <div class="flex justify-between items-center">
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
                  <div>
                    {{ $utils.unitConversion(scope.row.effectivePower, 2) }} /
                    {{
                      $utils.forMatNumber(
                        $XEUils.divide(scope.row.effectivePower, totalPower) *
                        100,
                        2
                      )
                    }}%
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="120"
              label="24h出块奖励"
            >
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.twentyfourBlockReward) }} FIL
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              min-width="130"
              label="24h存储效率"
            >
              <template slot="header">
                24h存储效率
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="近24h存储服务提供者平均每T算力所产出的FIL数量"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
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
            <el-table-column
              align="center"
              prop="address"
              min-width="130"
              label="24h算力增量"
            >
              <template slot="header">
                24h算力增量
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="近24h存储服务提供者有效算力的增量"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.twentyfourPowerIncrement, 2) }}
              </template>
            </el-table-column>
          </el-table>

          <!--  出块数 -->
          <el-table
            v-show="activeIndex === 2"
            class="w-full rank-table"
            :data="blockList"
          >
            <el-table-column align="center" prop="" label="排名" width="100">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    (params.page - 1) * params.page_size + scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者" width="150">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.storageProvider })">
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60" label="标签">
              <template slot-scope="{ row }">
                <span v-if="row.tag">{{ row.tag }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              width="300"
              label="出块份数"
            >
              <template slot="header">
                出块份数
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="scope">
                <div class="flex justify-between items-center">
                  <el-progress
                    class="flex progress2"
                    :show-text="false"
                    :percentage="
                      $utils.setNumber(
                        scope.row.blocksOutput,
                        scope.$index,
                        blocksOutput
                      )
                    "
                  ></el-progress>
                  <div>{{ scope.row.blocksOutput }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" width="120" label="幸运值">
              <template slot="header">
                幸运值
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="实际爆块数量和理论爆块数量的比值。若存储提供者有效算力低于1PiB，则该值存在较大随机性，仅供参考。"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ $utils.forMatNumber(row.luckyValue * 100, 2) }}%
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="130"
              label="出块奖励/占比"
            >
              <template slot="header">
                出块奖励/占比
                <el-popover
                  placement="top"
                  min-width="220"
                  trigger="hover"
                  content="在选定周期内，存储提供者获得出块奖励与累计产出区块奖励的比值"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.blockReward) }} FIL/{{
                  ((row.blocksOutput / totalBlock) * 100).toFixed(2)
                }}%
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="100"
              label="有效算力"
            >
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.effectivePower, 2) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 幸运值 -->
          <el-table
            v-show="activeIndex === 3"
            class="w-full rank-table"
            :data="luckList"
            :default-sort="{prop: 'luckyValue', order: 'descending'}"
            @sort-change="changeTableOrder"
          >
            <el-table-column align="center" prop="" label="排名" width="100">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1 && orderValue === -1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    (params.page - 1) * params.page_size + scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者" width="150">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.miner })">
                  {{ row.miner }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60" label="标签">
              <template slot-scope="{ row }">
                <span v-if="row.tag">{{ row.tag }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              label="出块份数"
            >
              <template slot="header">
                出块份数
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="scope">
                {{ scope.row.minedBlocks }}
              </template>
            </el-table-column>
            <el-table-column sortable align="center" prop="luckyValue" width="120" label="幸运值">
              <template slot="header">
                幸运值
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="实际爆块数量和理论爆块数量的比值。若存储提供者有效算力低于1PiB，则该值存在较大随机性，仅供参考。"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ $utils.forMatNumber(row.luckyValue * 100, 2) }}%
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="130"
              label="出块奖励/占比"
            >
              <template slot="header">
                出块奖励/占比
                <el-popover
                  placement="top"
                  min-width="220"
                  trigger="hover"
                  content="在选定周期内，存储提供者获得出块奖励与累计产出区块奖励的比值"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ row.blockRewardStr }}/{{
                  row.blockRewardPercent
                }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="100"
              label="有效算力"
            >
              <template slot-scope="{ row }">
                {{ row.qualityPowerStr }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 算力增速 -->
          <el-table
            v-show="activeIndex === 4"
            class="w-full rank-table"
            :data="speedList"
          >
            <el-table-column align="center" label="排名" width="100">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    (params.page - 1) * params.page_size + scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="存储提供者" width="150">
              <template slot-scope="{ row }">
                <div class="cp hover-color" @click="goPath({ path: 'address', id: row.storageProvider })">
                  {{ row.storageProvider }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="60" label="标签">
              <template slot-scope="{ row }">
                <span v-if="row.tag">{{ row.tag }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" min-width="330">
              <template slot="header">
                算力增速
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="选定周期内，平均每天完成封装扇区的有效算力总和"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="scope">
                <div class="flex justify-between items-center">
                  <el-progress
                    class="flex progress2"
                    :show-text="false"
                    :percentage="
                      $utils.setNumber(
                        scope.row.dailyPowerGrowth,
                        scope.$index,
                        dailyPowerGrowth
                      )
                    "
                  ></el-progress>
                  <div>
                    {{
                      $utils.unitConversion(scope.row.dailyPowerGrowth, 2, 4)
                    }}
                    / 天
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" min-width="130">
              <template slot="header">
                存储节点当量
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="以官方Benchmark推荐配置（AMD Ryzen Threadripper 3970X、NVidia GTX 2080Ti、128GB 2133mhz）视为1台基准存储节点，存储节点当量为该存储提供者换算成标准存储节点的数量（存储提供者的算力增速与该基准存储节点增速的比值）。"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">{{
                  $utils.forMatNumber(row.storageNodeNumber, 2)
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="" min-width="120">
              <template slot="header">
                算力增量
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="在选定周期内，存储提供者的有效算力增量"
                >
                  <img
                    class="tip tip-icon"
                    src="@/assets/icon/tip1.svg"
                    alt=""
                    slot="reference"
                  />
                </el-popover>
              </template>
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.powerIncrement, 2) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop=""
              min-width="120"
              label="有效算力"
            >
              <template slot-scope="{ row }">
                {{ $utils.unitConversion(row.effectivePower, 2) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- gas消耗 详情页-->
          <el-table
            v-show="activeIndex === 5"
            class="w-full rank-table"
            :data="gasList"
          >
            <el-table-column align="center" label="排名" width="100">
              <template slot-scope="scope">
                <img
                  v-if="scope.$index + 1 < 4 && params.page === 1"
                  class="rank-icon"
                  :src="require(`@/assets/icon/rank${scope.$index + 1}.png`)"
                />
                <span v-else>
                  {{
                    (params.page - 1) * params.page_size + scope.$index + 1
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="节点">
              <template slot-scope="{ row }">
                <div class="cp color-block" @click="goPath({ path: 'address', id: row.miner })">
                  {{ row.miner | handleNullDatas }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标签">
              <template slot-scope="{ row }">
                {{ row.label || '--' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="消耗Gas占比" min-width="150">
              <template slot-scope="scope">
                <div class="flex justify-between items-center">
                  <el-progress
                    class="flex progress1"
                    :show-text="false"
                    v-bind:percentage="$utils.setNumber(
                        scope.row.minerGas,
                        scope,
                        maxMinerGasUsed
                      )"
                  ></el-progress>
                  <div class="flex">
                    {{ $utils.fromWei(scope.row.minerGas, 'ether', 4) }} /
                    {{
                      $utils.forMatNumber(
                        $XEUils.divide(scope.row.minerGas, maxMinerGasUsed),
                        2
                      )
                    }}%
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="消耗Gas">
              <template slot-scope="{ row }">
                {{ $utils.fromWei(row.minerGas, 'ether', 4) }} FIL / 天
              </template>
            </el-table-column>
            <el-table-column align="center" label="扇区大小">
              <template slot-scope="{ row }">
                {{ row.sectorSize }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0 && showPagination"
          :total="total"
          :page.sync="params.page"
          :limit.sync="params.page_size"
          @pagination="getLists"
        />
        <div class="text-center more" v-if="showMore">
          <el-button round size="mini" @click="goPage('ranks', activeIndex)"
          >查看更多
          </el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import {getDatas} from "@/utils/method"
import {mapState} from "vuex"
import {
  fetchPowerData,
  fetchPowerSpeedData,
  fetchBlockSumData, queryNodeGasUseRank, minerBlockList,
} from "@/api/common"

export default {
  name: "rankPower",
  props: {
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: false,
    },
    // 引用的父页面, home-首页，all-展示所有信息
    page: {
      type: String,
      default: "home",
    },
    // 是否显示更多
    showMore: {
      type: Boolean,
      default: true,
    },
    // 存储用户选择
    currentSelect: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      loading: true,
      dailyPowerGrowth: 0, // 排行第一算力增速
      blocksOutput: 0, // 排行第一出块数
      effectivePower: 0, // 排行第一有效算力
      totalPower: 0,
      total: 0,
      totalBlock: 0,
      params: {
        duration: '24h',
        sector: '',
        page: 1,
        page_size: 20,
      },
      time: 1,
      gasTime: '24h',
      maxMinerGasUsed: 0, // 第一gas消耗
      activeIndex: +this.$route.params.type || 1,
      powerList: [],
      blockList: [],
      luckList: [],
      speedList: [],
      gasList: [],
      orderValue: -1,
    }
  },
  computed: {
    ...mapState({
      lg: state => state.modules.lg,
      xs: state => state.modules.xs
    })
  },
  methods: {
    fnSelectItem(val) {
      this.params.method = val
      this.getLists("reset")
    },
    cutoverRank(index) {
      if (this.activeIndex === index) return
      this.activeIndex = index
      this.params.page = 1
      this.powerList = []
      this.blockList = []
      this.luckList = []
      this.speedList = []
      this.gasList = []
      this.total = 0
      this.getLists()
    },
    changeTableOrder({ order }) {
      if (order === 'descending') {
        this.orderValue = -1
      } else {
        this.orderValue = 1
      }
      this.getLists('reset')
    },
    changeOrder(val) {
      debugger
      this.orderValue = val
      this.getLists('reset')
    },
    getLists(type) {
      if (type === 'reset') {
        this.params.page = 1
      }
      if (this.activeIndex === 1) {
        // 获取有效算力
        getDatas
          .call(
            this,
            fetchPowerData({
              page: this.params.page - 1,
              page_size: this.params.page_size,
            }),
            "loading"
          )
          .then((res) => {
            if (res.data) {
              if (this.params.page === 1)
                this.effectivePower = res.data?.list[0]?.effectivePower // 第一页时获取排行第一有效算力
              this.totalPower = res.data.totalPower
              this.powerList = res.data.list || []
              this.total = res.data.totalCount
            }
            // console.log(this.powerList, 'this.powerList')
          })
      } else if (this.activeIndex === 2) {
        // 获取出块数
        // const params = Object.assign({}, this.params, {type: this.time})
        getDatas
          .call(
            this,
            fetchBlockSumData({
              page: this.params.page - 1,
              page_size: this.params.page_size,
              type: this.time,
            }),
            "loading"
          )
          .then((res) => {
            if (res.data) {
              if (this.params.page === 1)
                this.blocksOutput = res.data?.list[0]?.blocksOutput // 第一页时获取排行第一出块数
              this.totalBlock = res.data.totalBlock
              this.blockList = res.data.list || []
              this.total = res.data.totalCount
            }
          })
      } else if (this.activeIndex === 3) {
        // 获取幸运值
        // const params = Object.assign({}, this.params, {type: this.time})
        getDatas
          .call(
            this,
            minerBlockList({
              pageIndex: this.params.page,
              pageSize: this.params.page_size,
              statsType: this.gasTime,
              luckSort: +this.orderValue,
              sectorSize: ''
            }),
            "loading"
          )
          .then((res) => {
            if (res.data) {
              if (this.params.page === 1)
                this.blocksOutput = res.data?.miners[0]?.blocksOutput // 第一页时获取排行第一出块数
              this.totalBlock = res.data.totalBlock
              this.luckList = res.data.miners || []
              this.total = res.data.total
            }
          })

      } else if (this.activeIndex === 4) {
        // 获取算力增速
        // const params = Object.assign({}, this.params, {type: this.time})
        getDatas
          .call(
            this,
            fetchPowerSpeedData({
              page: this.params.page - 1,
              page_size: this.params.page_size,
              type: this.time,
            }),
            "loading"
          )
          .then((res) => {
            if (res.data) {
              if (this.params.page === 1)
                this.dailyPowerGrowth = res.data?.list[0]?.dailyPowerGrowth // 第一页时获取排行第一算力增速
              this.speedList = res.data.list || []
              this.total = res.data.totalCount
            }
          })
      } else {
        // 获取gas消耗
        getDatas
          .call(
            this,
            queryNodeGasUseRank({
              page: this.params.page,
              page_size: this.params.page_size,
              duration: this.params.duration,
              sector: this.params.sector
            }),
            "loading"
          )
          .then((res) => {
            if (res.data) {
              if (this.params.page === 1) {
                this.maxMinerGasUsed = res.data.maxMinerGasUsed // 获取总gas消耗
                this.gasList = res.data.miners || []
                this.total = res.data.total
                console.log(this.gasList, 'llll', this.activeIndex)

              }
            }
          })
      }
    },
    // 切换时间回调
    changeTime(val) {
      this.time = val
      this.gasTime = val
      this.params.page = 1
      if (this.activeIndex !== 1) {
        this.getLists('reset')
      }
    },
    changeGasDuration(val) {
      this.params.duration = val
      this.params.page = 1
      if (this.activeIndex !== 1) {
        this.getLists('reset')
      }
    },
    goPage(name, type) {
      this.$router.push({
        name,
        params: {activeIndex: this.activeIndex, time: this.time, type},
      })
    },
    goPath({path, id}) {
      this.$router.push({
        path: `/${path}/${id}`,
      })
    },
  },
  mounted() {
    this.activeIndex = this.currentSelect?.activeIndex || 1
    this.time = this.currentSelect?.time || "1"
    this.getLists()
  },
}
</script>
<style scoped lang="scss">
.rank-table {
  .progress1 {
    margin-left: 20px;
    width: 50%;
  }

  .progress2 {
    margin-left: 1rem;
    width: 63%;
  }
}

.more {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
