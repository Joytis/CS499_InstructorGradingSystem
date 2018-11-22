/* eslint-disable global-require */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/sections',
      name: 'My Courses',
      component: require('../components/Sections/Sections.vue').default,
    },
    {
      path: '/sections/:courseId/:sectionId',
      name: 'Section page',
      component: require('../components/Sections/SectionPage.vue').default,
    },
    {
      path: '/sections/:courseId/:sectionId/whatIf',
      name: 'Student Page',
      component: require('../components/Sections/WhatIf.vue').default,
    },
    {
      path: '/sections/:courseId/:sectionId/:studentId',
      name: 'Student Page',
      component: require('../components/Sections/StudentPage.vue').default,
    },
    {
      path: '/enrollment',
      name: 'Enrollment',
      component: require('../components/Enrollment/GlobalEnrollment.vue').default,
    },
    {
      path: '/terms',
      name: 'Terms Testing',
      component: require('../components/Terms/Terms.vue').default,
    },
    {
      path: '/courses',
      name: 'Course Catalogue',
      component: require('../components/Courses/Courses.vue').default,
    },
    {
      path: '/docs',
      name: 'Documentation',
      component: require('../components/Documentation.vue').default,
    },
    {
      path: '*',
      redirect: '/sections',
    },
  ],
});
