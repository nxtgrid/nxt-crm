import { createRouter, createWebHistory } from 'vue-router';
import { stringify, parse } from 'qs';

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { pageTitle: '%s dashboard' },
    component: () => import('@/views/HomeView.vue'),
  },

  {
    path: '/transactions',
    name: 'transactions',
    meta: { pageTitle: '%s transactions' },
    component: () => import('@/views/TransactionsView.vue'),
  },

  {
    path: '/members',
    name: 'members',
    meta: { pageTitle: '%s members' },
    component: () => import('@/views/MembersView.vue'),
  },

  {
    path: '/search',
    name: 'search',
    meta: { pageTitle: 'Search' },
    component: () => import('@nxt/components/dashboard/global-search/GlobalSearchView.vue'),
  },


  /**
   * Grid Routes
  **/

  {
    path: '/grid/:gridId/dashboard',
    alias: '/grid/:gridId',
    name: 'grid--dashboard',
    meta: { noCrumbs: true, pageTitle: '%s dashboard' },
    component: () => import('@/views/Grid/GridDashboardView.vue'),
  },

  {
    path: '/grid/:gridId/issues',
    name: 'grid--issues',
    meta: { pageTitle: '%s issues' },
    component: () => import('@/views/Grid/Issues/IssuesView.vue'),
  },

  {
    path: '/grid/:gridId/issues/commissioning',
    name: 'grid--issues--commissioning',
    meta: { pageTitle: '%s commissioning meters' },
    component: () => import('@/views/Grid/Issues/InstallIssuesView.vue'),
  },

  {
    path: '/grid/:gridId/customers',
    name: 'grid--customers',
    meta: { pageTitle: '%s customers' },
    component: () => import('@/views/Grid/Customers/CustomersView.vue'),
  },

  {
    path: '/grid/:gridId/customer/:customerId',
    name: 'grid--customer',
    meta: { pageTitle: 'Customer' },
    component: () => import('@/views/Grid/Customers/CustomerView.vue'),
  },

  {
    path: '/grid/:gridId/customer/:customerId/top-ups/:meterId',
    name: 'grid--customer--top-ups',
    meta: { pageTitle: 'Customer top-ups' },
    component: () => import('@/views/Grid/Customers/Topups/TopupsView.vue'),
  },

  {
    path: '/grid/:gridId/customer/:customerId/interactions/:meterId',
    name: 'grid--customer--interactions',
    meta: { pageTitle: 'Meter commands' },
    component: () => import('@/views/Grid/Customers/Interactions/InteractionsView.vue'),
  },

  {
    path: '/grid/:gridId/agents',
    name: 'grid--agents',
    meta: { pageTitle: '%s agents' },
    component: () => import('@/views/Grid/Agents/AgentsView.vue'),
  },

  {
    path: '/grid/:gridId/agent/:agentId',
    name: 'grid--agent',
    component: () => import('@/views/Grid/Agents/AgentView.vue'),
  },

  {
    path: '/grid/:gridId/top-ups',
    name: 'grid--top-ups',
    meta: { pageTitle: '%s top-ups' },
    component: () => import('@/views/Grid/Topups/TopupsView.vue'),
  },

  {
    path: '/grid/:gridId/full-service-control',
    name: 'grid--fs-control',
    meta: { pageTitle: '%s full service control' },
    component: () => import('@/views/Grid/FsControl/FsControlView.vue'),
  },

  {
    path: '/grid/:gridId/walkaround',
    name: 'grid--walkaround',
    meta: { noCrumbs: true, pageTitle: '%s walkaround' },
    component: () => import('@/views/Grid/Walkaround/WalkaroundView.vue'),
  },


  /**
   * Other routes
   */

  {
    path: '/my-profile',
    name: 'my--profile',
    meta: { noCrumbs: true, pageTitle: 'My profile' },
    component: () => import('@nxt/components/dashboard/views/MyProfileView.vue'),
  },


  /**
   * Public routes
  **/

  {
    path: '/login',
    name: 'login',
    meta: { pageTitle: 'Log in' },
    component: { render: () => null },
  },

  {
    path: '/account/forgot-password',
    name: 'account--forgot-password',
    meta: { public: true, pageTitle: 'Forgot password' },
    component: () => import('@/views/Account/ForgotPasswordView.vue'),
  },

  {
    path: '/account/verify',
    name: 'account--verify',
    meta: { public: true, isReset: false, pageTitle: 'Set password' },
    component: () => import('@/views/Account/SetPasswordView.vue'),
  },

  {
    path: '/account/reset-password',
    name: 'account--reset-password',
    meta: { public: true, isReset: true, pageTitle: 'Reset password' },
    component: () => import('@/views/Account/SetPasswordView.vue'),
  },


  /**
   * Site submission
  **/

  {
    path: '/site-submission',
    name: 'site-submission',
    meta: { public: true, pageTitle: 'Site submission' },
    component: () => import('@/views/pd/submission/SiteSubmission.vue'),
    children: [
      {
        path: '',
        name: 'site-submission-start',
        meta: { step: 1 },
        component: () => import('@/views/pd/submission/SiteStartView.vue'),
      },
      {
        path: 'outline',
        name: 'site-submission-outline',
        meta: { step: 2 },
        component: () => import('@/views/pd/submission/SiteOutlineView.vue'),
      },
      {
        path: 'details',
        name: 'site-submission-details',
        meta: { step: 3 },
        component: () => import('@/views/pd/submission/SiteDetailsView.vue'),
      },
      {
        path: 'done',
        name: 'site-submission-done',
        meta: { step: 4 },
        component: () => import('@/views/pd/submission/SiteSubmittedView.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  parseQuery: parse,
  stringifyQuery: stringify,
  routes,
});

export default router;
