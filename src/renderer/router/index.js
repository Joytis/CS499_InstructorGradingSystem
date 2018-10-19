/* eslint-disable global-require */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: require('../components/ContentBodyMock.vue').default,
    },
    {
      path: '/courses',
      name: 'My Courses',
      component: require('../components/Courses/CourseTable.vue').default,
    },
    {
      path: '/courses/:id/sections',
      name: 'Sections',
      component: require('../components/OtherPage.vue').default,
    },
    {
      path: '/courses/:id/:section/',
      name: 'Section',
      component: require('../components/OtherPage.vue').default,
      props: ['id', 'section'],
    },
    {
      path: '/courses/:id/all/',
      name: 'All Sections',
      component: require('../components/OtherPage.vue').default,
    },
    {
      path: '/auth',
      name: 'All Sections',
      component: require('../components/AuthModal/AuthModal.vue').default,
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
});
