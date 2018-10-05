const menu = [
  {
    title: 'Development',
    menuItems: [
      {
        itemTitle: 'Login',
        itemLink: 'develop/login',
      },
      {
        itemTitle: 'Server Communication Testing',
        itemLink: 'develop/serverTesting',
      },
    ],
  },
  {
    title: 'General',
    menuItems: [
      {
        itemTitle: 'Dashboard',
        itemLink: 'general/dashboard',
      },
      {
        itemTitle: 'Courses',
        itemLink: 'general/courses',
      },
      {
        itemTitle: 'Documentation',
        itemLink: 'general/documentation',
      },
    ],
  },
  {
    title: 'Administration',
    menuItems: [
      {
        itemTitle: 'Course Settings',
        itemLink: 'administration/courses',
      },
      {
        itemTitle: 'Manage Enrollment',
        itemLink: 'administration/enrollment',
      },
    ],
  },
  {
    title: 'Settings',
    menuItems: [
      {
        itemTitle: 'Account Settings',
        itemLink: 'settings/account',
      },
      {
        itemTitle: 'Remote Storage Settings',
        itemLink: 'settings/remote',
      },
    ],
  },
];

export default {
  menu,
};
