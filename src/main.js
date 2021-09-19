import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
}).$mount('#app')
