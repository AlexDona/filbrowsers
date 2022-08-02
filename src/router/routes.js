import Vue from 'vue'
import Layout from '@/layout/layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '',
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/home/index'),
      },
      {
        path: '/powergrowth',
        name: 'powerGrowth',
        meta: {
          title: '全网算力增长'
        },
        component: () => import('@/views/home/powerGrowth'),
      },
      {
        path: '/rich',
        name: 'rich',
        meta: {
          title: '富豪榜'
        },
        component: () => import('@/views/blockChain/rich'),
      },
      {
        path: '/transaction',
        name: 'transaction',
        meta: {
          title: '大额转账记录'
        },
        component: () => import('@/views/transaction/index'),
      },
      {
        path: '/block',
        name: 'block',
        meta: {
          title: '富豪榜'
        },
        component: () => import('@/views/block/index'),
      },
      {
        path: '/message/:messageId',
        name: 'message',
        meta: {
          title: '消息详情'
        },
        component: () => import('@/views/block/message'),
      },
      {
        path: '/height/:blockhigh',
        name: 'bHeight',
        meta: {
          title: '区块高度'
        },
        component: () => import('@/views/block/bHeight'),
      },
      {
        path: '/belong/:belongId',
        name: 'belong',
        meta: {
          title: '所属区块'
        },
        component: () => import('@/views/block/belong'),
      },
      {
        path: '/account/:accountId',
        name: 'account',
        meta: {
          title: '账户详情'
        },
        component: () => import('@/views/block/account'),
      },
      {
        path: '/address/:accountId',
        name: 'address',
        meta: {
          title: '账户'
        },
        component: () => import('@/views/accountDetail/index'),
      },
      {
        path: '/rich',
        name: 'rich',
        meta: {
          title: '富豪榜'
        },
        component: () => import('@/views/blockChain/rich'),
      },
      {
        path: '/order',
        name: 'order',
        meta: {
          title: '订单'
        },
        component: () => import('@/views/blockChain/order'),
      },
      {
        path: '/memoryPool',
        name: 'memoryPool',
        meta: {
          title: '内存池'
        },
        component: () => import('@/views/blockChain/memoryPool'),
      },
      {
        path: '/order/:orderId',
        name: 'orderDetail',
        meta: {
          title: '订单详情'
        },
        component: () => import('@/views/blockChain/orderDetail'),
      },
      {
        path: '/ranks',
        name: 'ranks',
        meta: {
          title: '排行榜'
        },
        component: () => import('@/views/ranks/index'),
      },
      {
        path: '/gas',
        name: 'gas',
        meta: {
          title: 'Gas统计'
        },
        component: () => import('@/views/stats/gas'),
      },
      {
        path: '/miner',
        name: 'miner',
        meta: {
          title: '存储服务图表'
        },
        component: () => import('@/views/stats/miner'),
      },
      {
        path: '/solitaryblock',
        name: 'solitaryBlock',
        meta: {
          title: '孤块统计'
        },
        component: () => import('@/views/stats/solitaryBlock'),
      },
      {
        path: '/powerLoss',
        name: 'powerLoss',
        meta: {
          title: '节点算力损失统计'
        },
        component: () => import('@/views/stats/powerLoss'),
      },
      {
        path: '/commonTools',
        name: 'commonTools',
        meta: {
          title: '常用工具'
        },
        component: () => import('@/views/source/commonTools'),
      },
      {
        path: '/tools',
        name: 'tools',
        meta: {
          title: '工具'
        },
        component: () => import('@/views/tools/index'),
      },
      {
        path: '/404',
        meta: {
          title: '404'
        },
        component: () => import('@/views/404'),
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
  },
]

export default routes
