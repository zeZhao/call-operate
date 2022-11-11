import Vue from 'vue'
import App from './App.vue'
import router from './router/setting.js'
import element from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/index.scss"

Vue.config.productionTip = false
Vue.use(element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
