import Layout from "@/layout/index.vue";

const constRouterList = [
  {
    path: "/login",
    name: 'login',
    hidden: true,
    component: () => import(/* webpackChunkName: "about" */  '@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    parent: true,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: '首页',
        }
      },
    ]
  },
  {
    path: '/partner',
    name: 'partner',
    component:Layout,
    // redirect: "/partner/company",
    meta: {
      title: '企业管理',
    },
    children:[
      {
        path:"/partner/company",
        name:"company",
        component: () => import(/* webpackChunkName: "about" */ '@/views/partner/company/index.vue'),
        meta: {
          title: '合作方管理',
        }
      },
      {
        path:"/partner/user",
        name:"user",
        component: () => import(/* webpackChunkName: "about" */ '@/views/partner/user/index.vue'),
        meta: {
          title: '商家管理',
        }
      },
      {
        path:"/partner/supplier",
        name:"supplier",
        component: () => import(/* webpackChunkName: "about" */ '@/views/partner/supplier/index.vue'),
        meta: {
          title: '供应商管理',
        }
      },
      {
        path:"/partner/agent",
        name:"agent",
        component: () => import(/* webpackChunkName: "about" */ '@/views/partner/agent/index.vue'),
        meta: {
          title: '代理商管理',
        }
      },
    ]
  },
  {
    path: '/billing',
    name: 'billing',
    component: Layout,
    meta: {
      title: '计费管理',
    },
    children: [
      {
        path: '/billing/rate',
        name: 'rate',
        component: () => import(/* webpackChunkName: "about" */ '@/views/billing/rate/index.vue'),
        meta: {
          title: '费率',
        },
      },
      {
        path: '/billing/combo',
        name: 'combo',
        component: () => import(/* webpackChunkName: "about" */ '@/views/billing/combo/index.vue'),
        meta: {
          title: '套餐',
        },
      },
      {
        path: '/billing/rechargeRecord',
        name: 'rechargeRecord',
        component: () => import(/* webpackChunkName: "about" */ '@/views/billing/rechargeRecord/index.vue'),
        meta: {
          title: '语音充值记录',
        },
      },
      {
        path: '/billing/smsRechargeRecord',
        name: 'smsRechargeRecord',
        component: () => import(/* webpackChunkName: "about" */ '@/views/billing/smsRechargeRecord/index.vue'),
        meta: {
          title: '短信充值记录',
        },
      },
    ]
  },
  {
    path: '/dataQuery',
    name: 'dataQuery',
    component: Layout,
    meta: {
      title: '数据查询',
    },
    children: [
      {
        path: '/dataQuery/callList',
        name: 'callList',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/callList/index.vue'),
        meta: {
          title: '外呼通话详单',
        },
      },
      {
        path: '/dataQuery/callList2',
        name: 'callList2',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/callList2/index.vue'),
        meta: {
          title: '坐席通话详单',
        },
      },
      {
        path: '/dataQuery/PhoneLog',
        name: 'PhoneLog',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/PhoneLog/index.vue'),
        meta: {
          title: '短信记录',
        },
      },
      {
        path: '/dataQuery/AIrecord',
        name: 'AIrecord',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/AIrecord/index.vue'),
        meta: {
          title: 'AI对话记录',
        },
      },
      {
        path: '/dataQuery/recording',
        name: 'recording',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataQuery/recording/index.vue'),
        meta: {
          title: '录音记录',
        },
      },
    ]
  },
  {
    path: '/line',
    name: 'line',
    component: Layout,
    meta: {
      title: '语音线路管理',
    },
    children: [
      {
        path: '/line/lineDocking',
        name: 'lineDocking',
        component: () => import(/* webpackChunkName: "about" */ '@/views/line/lineDocking/index.vue'),
        meta: {
          title: '线路对接',
        },
      },
      {
        path: '/line/secretFriend',
        name: 'secretFriend',
        component: () => import(/* webpackChunkName: "about" */ '@/views/line/secretFriend/index.vue'),
        meta: {
          title: '呼入配置',
        },
      },
    ]
  },
  {
    path: '/IVR',
    name: 'IVR',
    component: Layout,
    meta: {
      title: 'IVR管理',
    },
    children: [
      {
        path: '/IVR/IVRIndex',
        name: 'IVRIndex',
        component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/IVRIndex/index.vue'),
        meta: {
          title: 'IVR管理',
        },
      },
      {
        path: '/IVR/AI',
        name: 'AI',
        hidden: true,
        component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/AI/index.vue'),
        meta: {
          title: 'AI机器学习',
        },
      },
      {
        path: '/IVR/AI/detail',
        name: 'AIDetail',
        hidden:true,
        component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/IVRIndex/components/details.vue'),
        meta: {
          title: 'AI机器学习',
          keepAliveNo:true,
        },
      },
    ]
  },
  {
    path: '/B-Call',
    name: 'B-Call',
    component: Layout,
    meta: {
      title: '批量外呼',
    },
    children: [
      // {
      //   path: '/B-Call/outbound',
      //   name: 'outbound',
      //   component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/outbound/index.vue'),
      //   meta: {
      //     title: '外呼任务',
      //   },
      // },
      {
        path: '/B-Call/incomeCallManage',
        name: 'incomeCallManage',
        component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/incomeCallManage/index.vue'),
        meta: {
          title: '任务管理',
        },
      },
      {
        path: '/B-Call/callMataManagement',
        name: 'callMataManagement',
        component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/callMataManagement/index.vue'),
        meta: {
          title: '外呼数据管理',
        },
      },

      {
        path: '/B-Call/callDataImportLog',
        name: 'callDataImportLog',
        component: () => import(/* webpackChunkName: "about" */ '@/views/B-Call/callDataImportLog/index.vue'),
        meta: {
          title: '导入记录',
        },
      },
    ]
  },
  {
    path: '/dataSheet',
    name: 'dataSheet',
    component: Layout,
    meta: {
      title: '数据表',
    },
    children: [
      {
        path: '/dataSheet/table',
        name: 'table',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataSheet/table/index.vue'),
        meta: {
          title: '数据表管理',
        },
      },
      {
        path: '/dataSheet/tableData',
        name: 'tableData',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataSheet/tableData/index.vue'),
        meta: {
          title: '表数据管理',
        },
      },
    ]
  },
  {
    path: '/warningTone',
    name: 'warningTone',
    component: Layout,
    meta: {
      title: '提示音管理',
    },
    children: [
      {
        path: '/warningTone/tone',
        name: 'tone',
        component: () => import(/* webpackChunkName: "about" */ '@/views/warningTone/tone/index.vue'),
        meta: {
          title: '系统提示音',
        },
      },
    ]
  },
  {
    path: '/seats',
    name: 'seats',
    component: Layout,
    meta: {
      title: '坐席管理',
    },
    children: [
      {
        path: '/seats/extension',
        name: 'extension',
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/extension/index.vue'),
        meta: {
          title: '分机',
        },
      },
      {
        path: '/seats/seatsIndex',
        name: 'seats',
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/seatsIndex/index.vue'),
        meta: {
          title: '坐席',
        },
      },
      {
        path: '/seats/permission',
        name: 'permission',
        hidden: false,
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/permission/index.vue'),
        meta: {
          title: '坐席权限',
        },
      },
      {
        path: '/seats/skillGroups',
        name: 'skillGroups',
        hidden: false,
        component: () => import(/* webpackChunkName: "about" */ '@/views/seats/skillGroups/index.vue'),
        meta: {
          title: '技能组',
        },
      },
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    meta: {
      title: '系统管理',
    },
    children: [
      {
        path: '/system/account',
        name: 'account',
        component: () => import(/* webpackChunkName: "about" */ '@/views/system/account/index.vue'),
        meta: {
          title: '账号管理',
        },
      },
      {
        path: '/system/permission',
        name: 'permission',
        component: () => import(/* webpackChunkName: "about" */ '@/views/system/permission/index.vue'),
        meta: {
          title: '角色及权限',
        },
      },
      {
        path: '/system/operationLog',
        name: 'operationLog',
        component: () => import(/* webpackChunkName: "about" */ '@/views/system/operationLog/index.vue'),
        meta: {
          title: '操作记录',
        },
      },
      
    ]
  },
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    component: Layout,
    meta: {
      title: '数据统计',
    },
    children: [
      {
        path: '/dataStatistics/trafficCondition',
        name: 'trafficCondition',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataStatistics/trafficCondition/index.vue'),
        meta: {
          title: '每日话务情况',
        },
      },
      {
        path: '/dataStatistics/trafficAnalyse',
        name: 'trafficAnalyse',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataStatistics/trafficAnalyse/index.vue'),
        meta: {
          title: '分时话务分析',
        },
      },
      {
        path: '/dataStatistics/trafficStatistics',
        name: 'trafficStatistics',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataStatistics/trafficStatistics/index.vue'),
        meta: {
          title: '技能组话务统计',
        },
      },
      {
        path: '/dataStatistics/seatTrafficStatistics',
        name: 'seatTrafficStatistics',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataStatistics/seatTrafficStatistics/index.vue'),
        meta: {
          title: '坐席话务统计',
        },
      },
      {
        path: '/dataStatistics/trafficChargeStatistics',
        name: 'trafficChargeStatistics',
        component: () => import(/* webpackChunkName: "about" */ '@/views/dataStatistics/trafficChargeStatistics/index.vue'),
        meta: {
          title: '话务费用统计',
        },
      },
    ]
  },
  
  
]

export default constRouterList

