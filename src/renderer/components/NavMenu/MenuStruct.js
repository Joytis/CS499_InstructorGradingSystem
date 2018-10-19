const menu = [
  {
    title: 'Development',
    menuItems: [
      {
        itemTitle: 'Sign In',
        itemLink: '/signin',
      },
      {
        itemTitle: 'Sign Up',
        itemLink: '/signup',
      },
      {
        itemTitle: 'Server Communication Testing',
        itemLink: '/serverTesting',
      },
    ],
  },
  {
    title: 'General',
    menuItems: [
      {
        itemTitle: 'Dashboard',
        itemLink: '/dashboard',
      },
      {
        itemTitle: 'Courses',
        itemLink: '/courses',
      },
      {
        itemTitle: 'Documentation',
        itemLink: '/docs',
      },
    ],
  },
  {
    title: 'Administration',
    menuItems: [
      {
        itemTitle: 'Manage Enrollment',
        itemLink: '/enrollment',
      },
    ],
  },
  {
    title: 'Settings',
    menuItems: [
      {
        itemTitle: 'Account Settings',
        itemLink: '/account',
      },
    ],
  },
];

export default {
  menu,
};
