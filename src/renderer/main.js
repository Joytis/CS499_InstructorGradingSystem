import Vue from 'vue';
import axios from 'axios';
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

import App from './App.vue';
import router from './router';
import store from './store';

/* eslint-disable global-require */
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

/* eslint-disable no-multi-assign */
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(Buefy);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
