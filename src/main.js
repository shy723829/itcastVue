// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import moment from 'moment'
import router from './router'
import '@/assets/css/index.css'
import axios from 'axios'
axios.defaults.baseURL='http://localhost:8888/api/private/v1/'
Vue.prototype.axios=axios

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.filter('fmtDate',(value,fmtString)=>{
  return moment(value).format(fmtString)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
