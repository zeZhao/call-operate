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
      title: '合作方管理',
    },
    children:[
      {
        path:"/partner/company",
        name:"company",
        component: () => import(/* webpackChunkName: "about" */ '@/views/partner/company/index.vue'),
        meta: {
          title: '企业管理',
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
          title: '充值记录',
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
          title: '号码管理',
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
        component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/AI/index.vue'),
        meta: {
          title: 'AI机器学习',
        },
      },
      {
        path: '/IVR/AI/detail',
        name: 'AIDetail',
        hidden:true,
        component: () => import(/* webpackChunkName: "about" */ '@/views/IVR/AI/components/details.vue'),
        meta: {
          title: 'AI机器学习',
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
      
    ]
  },
  
  
]

export default constRouterList

