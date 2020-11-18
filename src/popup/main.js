import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css'
Vue.use(SuiVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
