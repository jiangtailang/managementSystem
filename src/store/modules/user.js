import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRouter, constantRoutes, anyRouter } from '@/router'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import router from '@/router'
const getDefaultState = () => {
    return {
        // 获取token
        token: getToken(),
        // 存储用户名
        name: '',
        // 存储用户头像
        avatar: '',
        // 角色信息
        roles: [],
        // 服务器返回的菜单信息(与路由有关)【根据不同的角色返回标记信息】
        routes: [],
        // 按钮权限的信息
        buttons: [],
        // 用户最终需要展示的动态路由
        resultAllRouter: []
    }
}

const state = getDefaultState()

const mutations = {
    // 重置state
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // 权限管理信息
    SET_USERINFO: (state, value) => {
        state.name = value.name
        state.avatar = value.avatar
        state.roles = value.roles
        state.routes = value.routes
        state.buttons = value.buttons
    },
    // 最终计算出来的路由
    SET_RESULTALLROUTER: (state, value) => {
        // 这里的value是resultAsyncRouter即计算出来需要的异步路由
        // 将常量路由、异步路由、任意路由合并
        state.resultAllRouter = constantRoutes.concat(value, anyRouter)
            // 先剔除之前的路由，解决报错‘Duplicate named routes definition’(路由name重复导致的错误)
        router.matcher = new Router().matcher
            // 为路由器添加新的路由
        router.addRoutes(state.resultAllRouter)
    }
}

const actions = {
    // 处理登录业务
    async login({ commit }, userInfo) {
        // 解构出用户名与密码
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password })
            // 注意：当前登录请求现在使用mock数据，mock数据code是20000
        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                // data包含：用户名name、用户头像avatar、路由标记routes、用户角色信息roles、按钮信息buttons
                commit('SET_USERINFO', data)
                commit('SET_RESULTALLROUTER', computedResultAsyncRouter(data.routes, asyncRouter))

                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedResultAsyncRouter = (routes, asyncRouter) => {
    // 过滤出当前用户【超级管理员|普通员工】需要展示的异步路由
    return asyncRouter.filter((item) => {
        // 数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1
        if (routes.indexOf(item.name) != -1) {
            // 递归：别忘记还有2、3、4、5、6级路由
            if (routes.children && routes.children.length) {
                item.children = computedResultAsyncRouter(routes, item.children)
            }
            return true
        }
    })
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}