import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */
export const login = (data) => {
    return request({
        url: '/api/auth/login',
        method: 'post',
        data
    })
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.role - 角色（USER/ADMIN）
 */
export const register = (data) => {
    return request({
        url: '/api/auth/register',
        method: 'post',
        data
    })
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
    return request({
        url: '/api/auth/me',
        method: 'get'
    })
}

/**
 * 用户登出
 */
export const logout = () => {
    return request({
        url: '/api/auth/logout',
        method: 'post'
    })
}