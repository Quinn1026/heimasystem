import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 导入基本样式
import '@/style/base.less'
// 导入路由组件
import router from '@/router'
// 导入axios
import '@/utils/request.js'
// 导入element-ui组件
import '@/plugins/elementUI.js'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')