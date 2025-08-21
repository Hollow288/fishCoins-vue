import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import Home from '../components/home.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    noAuth: true,
                    icon: 'Compass'
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/dashboard.vue'),
            },
            {
                path: '/ucenter',
                name: 'ucenter',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "ucenter" */ '../views/theme-pages/ucenter.vue'),
            },
            {
                path: '/theme',
                name: 'theme',
                meta: {
                    title: '主题设置',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "theme" */ '../views/theme-pages/theme.vue'),
            },
            {
                path: '/IllustratedArms',
                name: 'IllustratedArms',
                meta: {
                    title: '武器图鉴',
                    permiss: '29',
                    icon: 'CopyDocument'
                },
                component: () => import('@/views/hotta/IllustratedArms/index.vue'),
            },
            {
                path: '/IllustratedWillpower',
                name: 'IllustratedWillpower',
                meta: {
                    title: '意志图鉴',
                    permiss: '30',
                    icon: 'FullScreen'
                },
                component: () => import('@/views/hotta/IllustratedWillpower/index.vue'),
            },
            {
                path: '/IllustratedMimicry',
                name: 'IllustratedMimicry',
                meta: {
                    title: '拟态图鉴',
                    permiss: '30',
                    icon: 'Star'
                },
                component: () => import('@/views/hotta/IllustratedMimicry/index.vue'),
            },
            {
                path: '/EventNews',
                name: 'EventNews',
                meta: {
                    title: '活动资讯',
                    permiss: '30',
                    icon: 'Bell'
                },
                component: () => import('@/views/hotta/EventNews/index.vue'),
            },
            {
                path: '/Food',
                name: 'Food',
                meta: {
                    title: '食物图鉴',
                    permiss: '30',
                    icon: 'Food'
                },
                component: () => import('@/views/hotta/Food/index.vue'),
            }
        ],
    },
    {
        path: '/login',
        meta: {
            title: '登录',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/auth-pages/login.vue'),
    },
    {
        path: '/register',
        meta: {
            title: '注册',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "register" */ '../views/auth-pages/register.vue'),
    },
    {
        path: '/reset-pwd',
        meta: {
            title: '重置密码',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "reset-pwd" */ '../views/auth-pages/reset-pwd.vue'),
    },
    {
        path: '/auth-redirect', // 用于处理 OAuth2 回调
        meta: {
            title: '正在跳转...',
            noAuth: true,
        },
        component: () => import('../views/auth-pages/auth-callback.vue'),
    },
    {
        path: '/403',
        meta: {
            title: '没有权限',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/error-pages/403.vue'),
    },
    {
        path: '/404',
        meta: {
            title: '找不到页面',
            noAuth: true,
        },
        component: () => import(/* webpackChunkName: "404" */ '../views/error-pages/404.vue'),
    },
    { path: '/:path(.*)', redirect: '/404' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    // const role = localStorage.getItem('vuems_name');
    // const permiss = usePermissStore();
    // if (!role && to.meta.noAuth !== true) {
    //     next('/login');
    // } else if (typeof to.meta.permiss == 'string' && !permiss.key.includes(to.meta.permiss)) {
    //     // 如果没有权限，则进入403
    //     next('/403');
    // } else {
        next();
    // }
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
