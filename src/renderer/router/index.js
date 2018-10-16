/* eslint-disable global-require */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Courses',
      component: require('../components/Courses/CourseTable.vue').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
