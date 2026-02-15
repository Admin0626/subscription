import request from '@/utils/request'

/**
 * 获取统计数据
 */
export function getStats() {
    return request({
        url: '/api/stats',
        method: 'get'
    })
}