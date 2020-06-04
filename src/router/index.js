import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 导入token模块
import {
    getToken
} from '@/utils/token.js'
// 导入子组件
import Login from '@/views/login'
import Layout from '@/views/layout'
import User from '@/views/layout/user'
import Enterprise from '@/views/layout/enterprise'
import Subject from '@/views/layout/subject'
import Question from '@/views/layout/question'
import Chart from '@/views/layout/chart'

const router = new VueRouter({
    routes: [{
            path: '*',
            component: Login
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/layout',
            component: Layout,
            children: [{
                    path: 'user',
                    component: User
                },
                {
                    path: 'enterprise',
                    component: Enterprise
                },
                {
                    path: 'subject',
                    component: Subject
                },
                {
                    path: 'question',
                    component: Question
                },
                {
                    path: 'chart',
                    component: Chart
                }
            ]
        },
    ]

});

// 全局导航守卫
router.beforeEach((to, from, next) => {
    if (to.fullPath == '/login') {
        next();
    } else {
        // 如果不是去login页面 先判断是否有token
        const token = getToken();
        if (token) {
            // 有token表示已经登陆过了
            next();
        } else {
            // 没有token 表示没有登陆 直接跳转到登录页面
            next('/login');
        }
    }
});


export default router