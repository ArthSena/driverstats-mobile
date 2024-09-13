
import HomePage from '../pages/home.f7';
import RegistryListPage from '../pages/registry-list.f7';
import RegistryPage from '../pages/registry.f7';
import ExpenseListPage from '../pages/expense-list.f7';
import ExpensePage from '../pages/expense.f7';
import ProfilePage from '../pages/profile.f7';

import NotFoundPage from '../pages/404.f7';

var routes = [
  {
    path: '/',
    component: HomePage,
    on: {
      pageInit: function (event, page) {
        $.getScript("js/home.js");
      },
    }
  },
  {
    path: '/registry-list/',
    component: RegistryListPage,
  },
  {
    path: '/registry/:id/',
    component: RegistryPage,
  },
  {
    path: '/expense-list/',
    component: ExpenseListPage,
  },
  {
    path: '/expense/:id/',
    component: ExpensePage,
  },
  {
    path: '/profile/',
    component: ProfilePage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;