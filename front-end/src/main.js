import Vue from 'vue'
import App from './App.vue'
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/lib/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/style.css';
import vueTable from 'vue-pagination-table';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.use(vueTable)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
