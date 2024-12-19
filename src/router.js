// router.js
import { createRouter, createWebHistory } from 'vue-router';
import SignUp from './auth/SignUp.vue';
import DashboardView from './views/Dashboard.vue';
import DashboardHead from './views/head/Dashboard.vue';
import DashboardMember from './views/member/Dashboard.vue';
import DashboardInventory from './views/inventory/Dashboard.vue';
import ViewUsers from './views/inventory/components/ViewUsers.vue';
import Product_list from './views/inventory/components/Product.vue';
import UnauthorizedPage from './Unauthorized.vue';
import Product_Public from './views/member/components/Product.vue';
import Request_Member from './views/member/components/Requests.vue';
import Product_Head from './views/head/components/Product.vue';
import Request_Head from './views/head/components/Requests.vue';
import Approval_Head from './views/head/components/Approval.vue';
import Approval_Inventory from './views/inventory/components/Approval.vue';
import Transfered_Inventory from './views/inventory/components/Transfered.vue';
import Buy_Product_Inventory from './views/inventory/components/BuyProduct.vue';
import Buy_Product_Member from './views/member/components/BuyProduct.vue';
import Buy_Product_Head from './views/head/components/BuyProduct.vue';
import Arrange_Product_Inventory from './views/inventory/components/ArrangeProduct.vue';


const routes = [
  {
    path: '/',
    name: 'SignUp',
    component: SignUp,
    meta: {
      title: 'Sign Up Page',
      requiresAuth: false, // Update requiresAuth to false for SignUp page
      requiresNoAuth: true, // Add requiresNoAuth meta field
    },
  },
  {
    path: '/dashboard',
    name: 'DashboardView',
    component: DashboardView,
    meta: {
      title: 'DashBoard Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/head',
    name: 'DashboardHead',
    component: DashboardHead,
    meta: {
      title: 'DashBoard Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/member',
    name: 'DashboardMember',
    component: DashboardMember,
    meta: {
      title: 'DashBoard Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/inventory',
    name: 'DashboardInventory',
    component: DashboardInventory,
    meta: {
      title: 'DashBoard Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/users',
    name: 'ViewUsers',
    component: ViewUsers,
    meta: {
      title: 'ViewUsers Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/product',
    name: 'Product_list',
    component: Product_list,
    meta: {
      title: 'Product Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/product_public',
    name: 'Product_Public',
    component: Product_Public,
    meta: {
      title: 'Product_Public Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/request_member',
    name: 'Request_Member',
    component: Request_Member,
    meta: {
      title: 'Request_Member Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/product_head',
    name: 'Product_Head',
    component: Product_Head,
    meta: {
      title: 'Product_Head Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/request_head',
    name: 'Request_Head',
    component: Request_Head,
    meta: {
      title: 'Request_Head Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/approval_head',
    name: 'Approval_Head',
    component: Approval_Head,
    meta: {
      title: 'Approval_Head Page',
      requiresAuth: true,
    },
  },
    {
    path: '/dashboard/approval_inventory',
    name: 'Approval_Inventory',
    component: Approval_Inventory,
    meta: {
      title: 'Approval_Inventory Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/transfered_inventory',
    name: 'Transfered_Inventory',
    component: Transfered_Inventory,
    meta: {
      title: 'Transfered_Inventory Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/buy_product_inventory',
    name: 'Buy_Product_Inventory',
    component: Buy_Product_Inventory,
    meta: {
      title: 'Buy_Product_Inventory Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/buy_product_member',
    name: 'Buy_Product_Member',
    component: Buy_Product_Member,
    meta: {
      title: 'Buy_Product_Member Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/buy_product_head',
    name: 'Buy_Product_Head',
    component: Buy_Product_Head,
    meta: {
      title: 'Buy_Product_Head Page',
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/arrange_product_inventory',
    name: 'Arrange_Product_Inventory',
    component: Arrange_Product_Inventory,
    meta: {
      title: 'Arrange_Product_Inventory Page',
      requiresAuth: true,
    },
  },
  {
    path: '/unauthorized',
    name: 'UnauthorizedPage',
    component: UnauthorizedPage,
    meta: {
      title: 'Unauthorized Page',
      requiresAuth: true,
    },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | INVENTORY` : 'INVENTORY'; 

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = sessionStorage.getItem('isUserSignedIn');
    if (!isAuthenticated) {
      next({ name: 'SignUp' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    const isAuthenticated = sessionStorage.getItem('isUserSignedIn');
    if (isAuthenticated) {
      next({ name: 'DashboardView' }); // Redirect to OnBoarding if already signed in
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
