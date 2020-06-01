import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 导入子组件
import Login from '@/views/login'

const router = new VueRouter({
    routes: [{
            path: '*',
            component: Login
        },
        {
            path: '/login',
            component: Login
        },
    ]
})

export default router