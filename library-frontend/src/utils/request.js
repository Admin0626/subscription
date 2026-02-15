import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    baseURL: '', // 你的 Spring Boot 后端地址
    timeout: 10000, // 请求超时时间
    withCredentials: true // 携带 cookie（如果需要登录态）
})

// 请求拦截器
// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token')

        // 如果有 token，添加到请求头
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        console.error('请求错误:', error)
        if (error.response && error.response.data) {
            // 如果后端返回了ApiResponse格式的数据，提取其中的message
            const errorData = error.response.data
            if (errorData.message) {
                // 返回一个包含错误信息的对象，而不是reject
                // 这样前端可以统一处理成功和错误响应
                return Promise.resolve({
                    success: false,
                    code: errorData.code || error.response.status,
                    message: errorData.message,
                    data: null
                })
            }
        }
        return Promise.reject(error)
    }
)

export default request