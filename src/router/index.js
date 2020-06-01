import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 导入子组件
import Login from '@/views/login'
import Layout from '@/views/layout'

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
            component: Layout
        },
    ]

})

export default router