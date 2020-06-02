import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 导入子组件
import Login from '@/views/login'
import Layout from '@/views/layout'
import User from '@/views/layout/user'
import Enterprise from '@/views/layout/enterprise'
import Subject from '@/views/layout/subject'
import Question from '@/views/layout/question'
import Data from '@/views/layout/data'

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
                    path: 'data',
                    component: Data
                }
            ]
        },
    ]

})

export default router