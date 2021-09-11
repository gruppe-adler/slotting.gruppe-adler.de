import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import SlottingView from '../views/Slotting.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/slotting',
        component: SlottingView
    },
    {
        path: '/slotting/edit',
        component: () => import(/* webpackChunkName: "edit" */ '../views/Edit.vue')
    },
    {
        path: '/slotting/share',
        component: () => import(/* webpackChunkName: "share" */ '../views/Share.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
