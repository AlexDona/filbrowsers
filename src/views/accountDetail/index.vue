<template>
  <div class="address container">
    <div class="flex items-center mt-6">
      <div class="font-medium hide-mini"> 账户 {{ storageId | handleNullDatas }}</div>
      <div class="font-medium show-mini ml-1/2"> 账户 {{ storageId | handleNullDatas }}</div>
      <!--       <div class="apply-tag"> 申领账户&gt; </div>
        <span>
          <span>
            <div>
              <i data-v-39a6dbbd="" class="el-icon-message-solid pr-1"></i>
              监控账户变动
            </div>
          </span>
        </span>-->
    </div>
    <div class="w-full mt-1">
      <el-card class=" no-boders">
        <div slot="header" class="title-bar flex">
          <span class="flex">存储提供者概览</span>
        </div>
        <!--  PC 端 -->
        <div class="hide-mini">
          <div class="lg:grid-cols-2 lg:gap-4 gap-2 grid mx-1/2">
            <div class="flex border rounded-sm">
              <pieCharts v-loading="loading" class="piecharts" :chartData.sync="chartData"
                         style="width: 200px"></pieCharts>
              <div class="py-1">
                <p class="text-sm mt-1"> 账户余额 </p>
                <p class="font-medium text-2xl">
                  {{ $utils.fromWei(chartData.balance, 'ether', 4) | handleNullDatas }} </p>
                <div class="flex items-center text-sm mt-1/2">
                  可用余额：{{
                    $utils.fromWei(chartData.miner && chartData.miner.availableBalance, 'ether', 4) | handleNullDatas
                  }}
                  FIL
                  <div class="title text-center">
                    <el-popover
                      placement="top"
                      width="200"
                      trigger="hover"
                      content="可用余额 = 账户余额 - 扇区抵押 - 提供存储服务锁仓">
                      <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                    </el-popover>
                  </div>
                </div>
                <p class="text-sm mt-1/2"> 扇区抵押: {{ initialPledgeRequirement | handleNullDatas }} FIL</p>
                <p class="text-sm mt-1/2"> 提供存储服务锁仓:
                  {{ $utils.fromWei(chartData.miner && chartData.miner.vestingFunds, 'ether', 4) | handleNullDatas }}
                  FIL </p>
              </div>
            </div>
            <div class="flex border rounded-sm">
              <div class="py-1 mx-2 w-full">
                <p class="text-sm mt-1"> 有效算力 </p>
                <div class="flex items-center justify-between w-full">
                  <p class="font-medium text-2xl"> {{
                      $utils.unitConversion(chartData.miner && chartData.miner.qualityAdjPower, 2) | handleNullDatas
                    }} </p>
                  <p class="text-sm"> 占比: {{
                      $utils.forMatNumber($XEUils.divide(chartData.miner && chartData.miner.qualityAdjPower, chartData.miner && chartData.miner.networkQualityAdjPower) * 100, 2) | handleNullDatas
                    }}% </p>
                  <p class="text-sm"> 排名:
                    {{ chartData.miner && chartData.miner.qualityAdjPowerRank | handleNullDatas }} </p>
                </div>
                <div class="flex items-center justify-between w-full mt-1">
                  <p class="text-sm"> 原值算力: {{
                      $utils.unitConversion(chartData.miner && chartData.miner.rawBytePower, 2) | handleNullDatas
                    }} </p>
                  <div class="text-sm items-center justify-end flex">
                    累计出块份数
                    <div class="title text-center">
                      <el-popover
                        placement="top"
                        width="200"
                        trigger="hover"
                        content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和">
                        <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                      </el-popover>
                    </div>
                    : {{ chartData.miner && chartData.miner.weightedBlocksMined | handleNullDatas }}
                  </div>
                </div>
                <div class="flex items-center justify-between w-full mt-1/2">
                  <p class="text-sm"> 累计出块奖励:
                    {{ $utils.fromWei(chartData.miner && chartData.miner.totalRewards, 'ether', 2) | handleNullDatas }}
                    FIL </p>
                  <p class="text-sm"> 扇区大小:
                    {{ $utils.unitConversion(chartData.miner && chartData.miner.sectorSize) | handleNullDatas }} </p>
                </div>
                <div class="text-sm mt-1/2 items-center justify-between flex">
                  <p> 扇区状态: </p>
                  <div>
                    <span> {{ chartData.miner && chartData.miner.sectors.active }} 全部, </span>
                    <span class=" text-green-600"> {{
                        chartData.miner && chartData.miner.sectors.live | handleNullDatas
                      }} 有效, </span>
                    <span class=" text-red-700"> {{
                        chartData.miner && chartData.miner.sectors.faulty | handleNullDatas
                      }} 错误, </span>
                    <span class=" text-yellow-500"> {{
                        chartData.miner && chartData.miner.sectors.recovering | handleNullDatas
                      }} 恢复中 </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  h5 端      -->
        <div class="show-mini">
          <div class="flex border rounded-sm mb-3/4">
            <pieCharts v-loading="loading" id="miniChart" class="piecharts" :chartData.sync="chartData"
                       style="width: 200px"></pieCharts>
            <div class="py-1 text-right mr-5/4">
              <div class="text-sm mt-1"> 账户余额</div>
              <div class="font-medium text-2xl">
                {{ chartData.balance && $utils.fromWei(chartData.balance, 'ether', 4) | handleNullDatas }}
              </div>
              <div class="text-xs mt-1/2">
                可用余额：
                {{
                  chartData.miner && $utils.fromWei(chartData.miner && chartData.miner.availableBalance, 'ether', 4) | handleNullDatas
                }} FIL
              </div>
              <p class="text-xs mt-1/2"> 扇区抵押: {{ initialPledgeRequirement | handleNullDatas }} FIL</p>
              <p class="text-xs mt-1/2"> 提供存储服务锁仓:
                {{ chartData.miner && $utils.fromWei(chartData.miner.vestingFunds, 'ether', 4) | handleNullDatas }}
                FIL </p>
            </div>
          </div>
          <div class="flex border rounded-sm">
            <div class="p-1 w-full">
              <p class="text-sm mt-1"> 有效算力 </p>
              <div class="flex items-center justify-between w-full">
                <p class="font-medium text-2xl"> {{
                    chartData.miner && $utils.unitConversion(chartData.miner.qualityAdjPower, 2) | handleNullDatas
                  }} </p>
                <p class="text-sm"> 占比: {{
                    chartData.miner && $utils.forMatNumber($XEUils.divide(chartData.miner.qualityAdjPower, chartData.miner.networkQualityAdjPower) * 100, 2) | handleNullDatas
                  }}% </p>
                <p class="text-sm"> 排名: {{
                    chartData.miner && chartData.miner.qualityAdjPowerRank | handleNullDatas
                  }} </p>
              </div>
              <div class="flex items-center justify-between mt-1/2">
                <p class="text-xs"> 原值算力: </p>
                <p class="text-xs">
                  {{ chartData.miner && $utils.unitConversion(chartData.miner.rawBytePower, 2) | handleNullDatas }}</p>
              </div>
              <div class="flex items-center justify-between mt-1/2">
                <div class="title text-xs text-center">累计出块份数
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="hover"
                    content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和">
                    <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                  </el-popover>
                  ：
                </div>
                <p class="text-xs">{{ chartData.miner && chartData.miner.weightedBlocksMined | handleNullDatas }}</p>
              </div>
              <div class="flex items-center justify-between mt-1/2">
                <p class="text-xs"> 累计出块奖励:</p>
                <p class="text-xs">
                  {{ $utils.fromWei(chartData.miner && chartData.miner.totalRewards, 'ether', 2) | handleNullDatas }}
                  FIL </p>
              </div>
              <div class="flex items-center justify-between mt-1/2">
                <p class="text-xs"> 扇区大小:</p>
                <p class="text-xs">{{
                    chartData.miner && $utils.unitConversion(chartData.miner && chartData.miner.sectorSize) || '--'
                  }}</p>
              </div>
              <div class="flex items-center justify-between mt-1/2">
                <p class="text-xs"> 扇区状态: </p>
                <p class="text-xs">
                  <span> {{ chartData.miner && chartData.miner.sectors.active }} 全部, </span>
                  <span class=" text-green-600"> {{ chartData.miner && chartData.miner.sectors.live | handleNullDatas }} 有效, </span>
                  <span class=" text-red-700"> {{ chartData.miner && chartData.miner.sectors.faulty | handleNullDatas }} 错误, </span>
                  <span class=" text-yellow-500"> {{
                      chartData.miner && chartData.miner.sectors.recovering | handleNullDatas
                    }} 恢复中 </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="show-mini">
          <div class="flex justify-center">
            <el-button type="text" style="color: unset" class="mx-auto" round size="small"></el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!--   提供存储服务统计  -->
    <div class="w-full mt-1">
      <el-card class=" no-boders">
        <div slot="header" class="title-bar flex">
          <span class="flex">提供存储服务统计</span>
          <div class="fr">
            <el-radio-group class="hide-mini" v-model="timeItem" size="mini" @change="changeItem">
              <el-radio-button label="24h">24时</el-radio-button>
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="1y">1年</el-radio-button>
            </el-radio-group>
            <!-- 小屏幕选项 -->
            <el-select
              :popper-append-to-body="false"
              class="show-mini"
              @change="changeItem"
              style="width: 100px" size="mini" v-model="timeItem">
              <el-option label="24小时" value="24h"></el-option>
              <el-option label="7天" value="7d"></el-option>
              <el-option label="30天" value="30d"></el-option>
              <el-option label="1年" value="1y"></el-option>
            </el-select>
          </div>
        </div>
        <!--  PC 提供存储服务统计  -->
        <div class="border rounded-sm p-1 hide-mini mx-1/2">
          <div class="grid grid-cols-3 mb-1/2">
            <p class="text-sm text-left"> 算力增量:
              {{ $utils.unitConversion(storageData.qualityAdjPowerDelta, 2) | handleNullDatas }} </p>
            <p class="text-sm text-left"> 算力增速:
              {{ $utils.unitConversion(storageData.qualityAdjPowerDelta / timeZone[timeItem], 2) | handleNullDatas }} /
              天 </p>
            <div class="text-sm flex flex-row items-center justify-end">
              <div class="title text-sm text-center">存储节点当量
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="以官方Benchmark推荐配置（AMD Ryzen Threadripper 3970X、NVidia GTX 2080Ti、128GB 2133mhz）视为1台基准存储节点，存储节点当量为该存储提供者换算成标准存储节点的数量（存储提供者的算力增速与该基准存储节点增速的比值）。">
                  <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                </el-popover>
              </div>
              : {{ storageData.equivalentMiners | handleNullDatas }}
            </div>
          </div>
          <div class="grid grid-cols-3 mb-1/2">
            <div class="text-sm w-5/12 text-left flex items-center justify-start">
              <div class="title text-sm text-center">
                出块数量
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="出块数 = 提供存储服务出块数量（block）的总和">
                  <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                </el-popover>
              </div>
              : {{ storageData.blocksMined | handleNullDatas }}
            </div>
            <div class="text-sm w-1/4 text-left flex flex-row items-center">
              <div class="title text-sm text-center">
                出块份数
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和">
                  <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                </el-popover>
              </div>
              : {{ storageData.weightedBlocksMined | handleNullDatas }}
            </div>
            <p class="text-sm w-1/3 text-right justify-end"> 出块奖励 (占比):
              {{ $utils.fromWei(storageData.totalRewards, 'ether', 4) | handleNullDatas }} FIL ({{
                $utils.forMatNumber((storageData.totalRewards / storageData.networkTotalRewards) * 100, 2) | handleNullDatas
              }}%) </p>
          </div>
          <div class="grid grid-cols-3 mb-1/2">
            <div class="text-sm w-5/12 text-left flex justify-start items-center">
              <div class="title text-sm text-center">
                存储服务效率
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="选定周期内，存储提供者累计出块奖励与有效算力的比值">
                  <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                </el-popover>
              </div>
              : {{ efficiency }} FIL/TiB
            </div>
            <div class="text-sm w-5/12 text-left flex items-center">
              <div class="title text-sm text-center">
                幸运值
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  content="实际爆块数量和理论爆块数量的比值。若存储提供者有效算力低于1PiB，则该值存在较大随机性，仅供参考。">
                  <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
                </el-popover>
              </div>
              : {{ $utils.forMatNumber(storageData.luckyValue * 100, 2) | handleNullDatas }} %
            </div>
          </div>
        </div>
        <!--  h5 提供存储服务统计  -->
        <div class="border rounded-sm p-1 show-mini">
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 算力增量: </p>
            <p class="text-xs">{{ $utils.unitConversion(storageData.qualityAdjPowerDelta, 2) | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 算力增速: </p>
            <p class="text-xs">
              {{ $utils.unitConversion(storageData.qualityAdjPowerDelta / timeZone[timeItem], 2) | handleNullDatas }} /
              天</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 存储节点当量
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="以官方Benchmark推荐配置（AMD Ryzen Threadripper 3970X、NVidia GTX 2080Ti、128GB 2133mhz）视为1台基准存储节点，存储节点当量为该存储提供者换算成标准存储节点的数量（存储提供者的算力增速与该基准存储节点增速的比值）。">
                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
              </el-popover>
              :
            </p>
            <p class="text-xs">{{ storageData.equivalentMiners | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 出块数量
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="以官方Benchmark推荐配置（AMD Ryzen Threadripper 3970X、NVidia GTX 2080Ti、128GB 2133mhz）视为1台基准存储节点，存储节点当量为该存储提供者换算成标准存储节点的数量（存储提供者的算力增速与该基准存储节点增速的比值）。">
                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
              </el-popover>
              :
            </p>
            <p class="text-xs">{{ storageData.blocksMined | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 出块奖励: </p>
            <p class="text-xs">{{ $utils.fromWei(storageData.totalRewards, 'ether', 4) | handleNullDatas }} FIL</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 出块奖励占比: </p>
            <p class="text-xs">{{ $utils.fromWei(storageData.totalRewards, 'ether', 4) | handleNullDatas }} FIL ({{
                $utils.forMatNumber((storageData.totalRewards / storageData.networkTotalRewards) * 100, 2) | handleNullDatas
              }} %)</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs"> 出块份数
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="Filecoin提供存储服务模型中，一个高度（tipset）下可能有多个区块（block），每个区块可能获得多份奖励（win count）。累计出块份数=每次出块获得奖励份数的总和">
                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
              </el-popover>
              :
            </p>
            <p class="text-xs">{{ storageData.weightedBlocksMined | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-xs">存储服务效率
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="选定周期内，存储提供者累计出块奖励与有效算力的比值">
                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
              </el-popover>
              :
            </p>
            <p class="text-xs">{{ efficiency }} FIL/TiB</p>
          </div>
          <div class="flex items-center justify-between mt-1/2">
            <p class="text-sm">幸运值
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                content="实际爆块数量和理论爆块数量的比值。若存储提供者有效算力低于1PiB，则该值存在较大随机性，仅供参考。">
                <img class="tip tip-icon" src="@/assets/icon/tip1.svg" alt="" slot="reference">
              </el-popover>
              :
            </p>
            <p class="text-xs">{{ $utils.forMatNumber(storageData.luckyValue * 100, 2) | handleNullDatas }} %</p>
          </div>
        </div>
      </el-card>
    </div>

    <!--  账户变化  PC-->
    <div class="hide-mini">
      <div class="flex mt-1 justify-between">
        <el-card class="card-content mr-1/2 flex-1">
          <div slot="header" class="title-bar flex">
            <span class="flex">账户变化</span>
          </div>
          <chartsAccount :account="accountId"></chartsAccount>
        </el-card>
        <el-card class="card-content ml-1/2 flex-1">
          <div slot="header" class="title-bar flex">
            <span class="flex">算力变化</span>
          </div>
          <chartsPower :account="accountId"></chartsPower>
        </el-card>
      </div>
    </div>
    <!--  账户变化  h5  -->
    <div class="show-mini">
      <div class="flex mt-1">
        <el-card class="card-content flex-1">
          <div slot="header" class="flex">
            <span class="flex">账户变化</span>
          </div>
          <chartsAccount :account="accountId"></chartsAccount>
        </el-card>
      </div>
      <div class="flex mt-1">
        <el-card class="card-content flex-1">
          <div slot="header" class="flex">
            <span class="flex">算力变化</span>
          </div>
          <chartsPower :account="accountId"></chartsPower>
        </el-card>
      </div>
    </div>


    <!--账户概览  PC-->
    <div class="mt-1 w-full hide-mini">
      <el-card>
        <div slot="header" class="title-bar flex">
          <span class="flex">账户概览</span>
        </div>
        <div class="grid grid-rows-1 grid-cols-2 gap-1 mx-1 my-1">
          <div class="mr-1/2">
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> 地址: </p>
              <p class="text-sm mt-1/2">{{ chartData.robust | handleNullDatas }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> 消息数: </p>
              <p class="text-sm mt-1/2">{{ chartData.messageCount | handleNullDatas }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> 类型: </p>
              <p class="text-sm mt-1/2">{{ actor[chartData.actor] | handleNullDatas }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> 创建时间: </p>
              <p class="text-sm mt-1/2">
                {{ $moment(chartData.createTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss') | handleNullDatas }}</p>
            </div>
          </div>
          <div class="ml-1/2">
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> 节点ID: </p>
              <p class="text-sm mt-1/2">{{ miner.peerId | handleNullDatas }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> Owner: </p>
              <p class="text-sm mt-1/2 text-link" @click="goPage('account', miner.owner.address)">
                {{ $utils.centerEllipsis(miner.owner && miner.owner.address) | handleNullDatas }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm mt-1/2"> Worker: </p>
              <p class="text-sm mt-1/2 text-link" @click="goPage('account', miner.worker.address)">
                {{ $utils.centerEllipsis(miner.owner && miner.worker.address) | handleNullDatas }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!--账户概览  H5-->
    <div class="show-mini">
      <div class="flex mt-1">
        <el-card class="card-content flex-1">
          <div slot="header" class="flex">
            <span class="flex">账户概览</span>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs"> 地址: </p>
            <p class="text-xs">{{ chartData.robust | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> 消息数: </p>
            <p class="text-xs mt-1/2">{{ chartData.messageCount | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> 类型: </p>
            <p class="text-xs mt-1/2">{{ actor[chartData.actor] | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> 创建时间: </p>
            <p class="text-xs mt-1/2">
              {{ $moment(chartData.createTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss') | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> 节点ID: </p>
            <p class="text-xs mt-1/2 text-link">{{ $utils.centerEllipsis(miner.peerId) | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> Owner: </p>
            <p class="text-xs mt-1/2 text-link" @click="goPage('account', miner.owner.address)">
              {{ $utils.centerEllipsis(miner.owner && miner.owner.address) | handleNullDatas }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-xs mt-1/2"> Worker: </p>
            <p class="text-xs mt-1/2 text-link" @click="goPage('account', miner.worker.address)">
              {{ $utils.centerEllipsis(miner.worker && miner.worker.address) | handleNullDatas }}</p>
          </div>
        </el-card>
      </div>
    </div>
    <Block/>
  </div>
</template>

<script>
import Block from "@/views/block/index.vue"
import pieCharts from "@/views/components/pieCharts"
import chartsAccount from "./components/chartsAccount"
import chartsPower from "./components/chartsPower"
import {getDatas} from "@/utils/method"
import {qurryAccountDetail, qurryStorageStatistics} from "@/api/common"

export default {
  name: "addressDetail",
  components: {
    pieCharts,
    chartsAccount,
    chartsPower,
    Block
  },
  data() {
    return {
      initialPledgeRequirement: 0, // 扇区抵押
      storageId: '',
      accountId: this.$route.params.accountId,
      loading: true,
      timeItem: '24h',
      getEfficiency: 0, // 获取24h 服务效率
      rewardPerByte: 1, // 24h 每字节奖励出块
      timeZone: {
        '24h': 1,
        '7d': 7,
        '30d': 30,
        '1y': 365
      },
      chartData: {},
      storageData: {}, // 存储服务统计
      miner: {},
      actor: {
        'storageminer': '存储提供者账户',
        'account': '普通账户'
      }
    }
  },
  created() {
    this.handleData()
    this.getStorageData()
  },
  computed: {
    efficiency: {
      get() {
        let val = 0
        if (this.chartData.miner && this.chartData.miner.qualityAdjPower) {
          if (this.timeItem === '24h') {
            val = this.getEfficiency
          } else {
            const rate = this.$XEUils.divide(this.storageData.rewardPerByte, this.rewardPerByte)
            val = this.$utils.forMatNumber(this.getEfficiency * rate, 4)
          }
        }
        return val
      }
    }
  },
  methods: {
    goPage(name, id) {
      this.$router.push({path: `/${name}/${id}`})
    },
    handleData() {
      getDatas.call(this, qurryAccountDetail({account: this.accountId}), 'loading').then(res => {
        if (res.data) {
          this.storageId = res.data.id
          this.chartData = res.data
          if (res.data.miner) {
            this.miner = res.data.miner
            const balance = this.$utils.fromWei(res.data.balance, 'ether', 4)
            const vestingFunds = this.$utils.fromWei(this.miner.vestingFunds, 'ether', 4)
            const availableBalance = this.$utils.fromWei(this.miner.availableBalance, 'ether', 4)
            this.initialPledgeRequirement = balance - vestingFunds - availableBalance
          }
        }
      })
    },
    getStorageData() {
      getDatas.call(this, qurryStorageStatistics({account: this.accountId, duration: this.timeItem})).then(res => {
        if (res.data) {
          this.storageData = res.data
          if (this.timeItem === '24h') {
            this.rewardPerByte = res.data.rewardPerByte
            let timerId = null
            const getData = () => {
              timerId = setTimeout(() => {
                if (this.chartData.miner) {
                  clearTimeout(timerId)
                  // console.log(this.getEfficiency, 'getEfficiency')
                  this.getEfficiency = this.$utils.forMatNumber(this.$utils.fromWei(res.data.totalRewards, 'ether', 4) / this.$utils.unitConversion(this.chartData.miner.qualityAdjPower, 2, 4).split(' ')[0], 4)
                } else {
                  getData()
                }
              }, 10)
            }
            getData()
          }
        }
      })
    },
    changeItem(val) {
      this.timeItem = val
      this.getStorageData()
    },
  }
}
</script>

<style scoped lang="scss">
.address {
  .piecharts {
    max-width: 200px;
  }

  .flex-1 {
    flex: 1;
  }

  ::v-deep .no-boders {
    .el-card__header {
      border: none;
    }
  }
}
</style>