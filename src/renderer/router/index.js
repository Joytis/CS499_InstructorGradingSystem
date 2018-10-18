/* eslint-disable global-require */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OtherPage',
      component: require('../components/OtherPage.vue').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
