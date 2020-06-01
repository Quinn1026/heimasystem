import Vue from 'vue'
import axios from 'axios'
import {
    getToken,
    removeToken
} from './token'
import router from '@/router'

// 设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// `withCredentials` 表示跨域请求时是否需要使用凭证
// 跨域时允许携带cookies
axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 请求头添加token
    // console.log(config);
    // 第一次登陆没有token 
    let token = getToken();
    if (token) {
        config.headers.token = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 如果token过期了 token参数错误  response.data.code == 206
    console.log(response);
    if (response.data.code == 206) { // 移出本地token并重定向到登陆页
        removeToken();
        router.push('/login');
        return
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

Vue.prototype.$axios = axios;