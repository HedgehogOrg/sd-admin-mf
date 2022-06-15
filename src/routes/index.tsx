import { lazy } from 'react';
import { MenuDataItem } from '@ant-design/pro-layout';

const Dashboard = lazy(() => import('@/modules/dashboard/pages/Dashboard'));

// 合并路由
const allRoutes: MenuDataItem[] = [
  {
    path: '/dashboard',
    name: 'DASHBOARD',
    component: <Dashboard />,
  },
];

export default allRoutes;
