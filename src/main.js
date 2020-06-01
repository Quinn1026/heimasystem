import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 导入路由组件
import router from '@/router'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')