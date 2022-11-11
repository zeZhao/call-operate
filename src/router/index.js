import Layout from "@/layout/index.vue";

const constRouterList = [
  {
    path: "/login",
    name: 'login',
    hidden: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */  '@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: '首页',
        }
      },
      {
        path: '/partner',
        name: 'partner',
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
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: '计费管理',
        }
      },
      {
        path: '/line',
        name: 'line',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: '语音线路管理',
        }
      },
      {
        path: '/IVR',
        name: 'IVR',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue'),
        meta: {
          title: 'IVR管理',
        }
      },
    ]
  }
]

export default constRouterList

