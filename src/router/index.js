import { createRouter, createWebHistory } from 'vue-router';

// Lazy load views
const HomeView = () => import('../views/HomeView.vue');
const RedirectView = () => import('../views/RedirectView.vue');

// Define routes
const routes = [
  { path: '/', component: HomeView },
  { path: '/:code', component: RedirectView },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
