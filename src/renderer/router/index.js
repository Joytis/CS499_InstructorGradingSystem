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
      path: '/courses/:id',
      name: 'Course Page',
      component: require('../components/Courses/CoursePage.vue').default,
    },
    {
      path: '/courses/:courseId/:sectionId',
      name: 'Section page',
      component: require('../components/Sections/SectionPage.vue').default,
    },
    // {
    //   path: '/courses/:id/:section/enrollment',
    //   name: 'Section Enrollment',
    //   component: require('../components/Enrollment/SectionEnrollment.vue'),
    // },
    // {
    //   path: '/courses/:id/:section/settings',
    //   name: 'Section Settings',
    //   component: require('../components/Sections/SectionSettings.vue').default,
    // },
    // {
    //   path: '/courses/:id/:section/assignments',
    //   name: 'Assignment Management',
    //   component: require('../components/Sections/AssignmentMngr.vue').default,
    // },
    // {
    //   path: '/courses/:id/:section/grades',
    //   name: 'Section Grades',
    //   component: require('../components/Sections/SectionGrades.vue').default,
    // },
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
    // {
    //   path: '/docs',
    //   name: 'Documentation',
    //   component: require('../components/Documentation/Documentation.vue').default,
    // },
    {
      path: '/auth',
      name: 'Auth Testing',
      component: require('../components/AuthModal/AuthModal.vue').default,
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
});
