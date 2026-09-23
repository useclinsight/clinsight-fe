interface Page {
  name: string;
  path: string;
  icon: string;
  svg?: string;
}

export const pages: { [key: string]: Page[] } = {
  Doctor: [
    {
      name: 'Overview',
      path: '/user',
      icon: 'DashboardSquare03Icon',
    },
    {
      name: 'Case',
      path: '/user/case',
      icon: 'Folder03Icon',
    },
    {
      name: 'Messages',
      path: '/user/messages',
      icon: 'Stethoscope02Icon',
    },
    {
      name: 'Earnings',
      path: '/user/earnings',
      icon: '',
      svg: '/assets/dashboard/wallet-01.svg',
    },
    {
      name: 'Settings',
      path: '/user/settings',
      icon: '',
      svg: '/assets/dashboard/setting-01.svg',
    },
  ],
};
