import request from '@/utils/request'

/**
 * 获取所有图书（分页）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码（从0开始）
 * @param {number} params.size - 每页大小
 * @param {string} params.sort - 排序字段（默认 createTime）
 * @param {string} params.direction - 排序方向（asc/desc）
 */
export const getBooks = (params) => {
    return request({
        url: '/api/books',
        method: 'get',
        params
    })
}

/**
 * 搜索图书（复合查询）
 * @param {Object} params - 搜索参数
 * @param {string} params.title - 书名（模糊匹配）
 * @param {string} params.author - 作者（模糊匹配）
 * @param {string} params.category - 分类（精确匹配）
 * @param {string} params.status - 状态（精确匹配）
 * @param {number} params.page - 页码（从0开始）
 * @param {number} params.size - 每页大小
 * @param {string} params.sort - 排序字段
 * @param {string} params.direction - 排序方向
 */
export const searchBooks = (params) => {
    return request({
        url: '/api/books/search',
        method: 'get',
        params
    })
}

/**
 * 根据 ID 获取图书
 * @param {number} id - 图书ID
 */
export const getBookById = (id) => {
    return request({
        url: `/api/books/${id}`,
        method: 'get'
    })
}

/**
 * 根据 ISBN 获取图书
 * @param {string} isbn - 图书ISBN
 */
export const getBookByIsbn = (isbn) => {
    return request({
        url: `/api/books/isbn/${isbn}`,
        method: 'get'
    })
}

/**
 * 新增图书
 * @param {Object} data - 图书数据
 */
export const createBook = (data) => {
    return request({
        url: '/api/books',
        method: 'post',
        data
    })
}

/**
 * 更新图书
 * @param {number} id - 图书ID
 * @param {Object} data - 图书数据
 */
export const updateBook = (id, data) => {
    return request({
        url: `/api/books/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除图书
 * @param {number} id - 图书ID
 */
export const deleteBook = (id) => {
    return request({
        url: `/api/books/${id}`,
        method: 'delete'
    })
}

/**
 * 获取所有图书分类
 */
export const getCategories = () => {
    return request({
        url: '/api/books/categories',
        method: 'get'
    })
}