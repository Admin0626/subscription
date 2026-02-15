import request from '@/utils/request'

/**
 * 获取用户列表
 */
export const getUsers = (params) => {
    return request({
        url: '/api/users',
        method: 'get',
        params
    })
}

/**
 * 搜索用户
 */
export const searchUsers = (params) => {
    return request({
        url: '/api/users/search',
        method: 'get',
        params
    })
}

/**
 * 创建用户
 */
export const createUser = (data) => {
    return request({
        url: '/api/users',
        method: 'post',
        data
    })
}

/**
 * 更新用户
 */
export const updateUser = (id, data) => {
    return request({
        url: `/api/users/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除用户
 */
export const deleteUser = (id) => {
    return request({
        url: `/api/users/${id}`,
        method: 'delete'
    })
}

/**
 * 重置用户密码
 */
export const resetUserPassword = (userId) => {
    return request({
        url: '/api/users/reset-password',
        method: 'post',
        data: { userId }
    })
}
