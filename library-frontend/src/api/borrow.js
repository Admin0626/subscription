import request from '@/utils/request'

/**
 * 我的借阅记录（分页）
 */
export const getMyRecords = (params) => {
  return request({
    url: '/api/borrow/my-records',
    method: 'get',
    params
  })
}

/**
 * 我当前未还的借阅
 */
export const getMyActiveBorrows = () => {
  return request({
    url: '/api/borrow/my-active',
    method: 'get'
  })
}

/**
 * 全部借阅记录（管理员，分页）
 */
export const getAllRecords = (params) => {
  return request({
    url: '/api/borrow/records',
    method: 'get',
    params
  })
}

/**
 * 逾期未还记录（管理员）
 */
export const getOverdueRecords = () => {
  return request({
    url: '/api/borrow/overdue',
    method: 'get'
  })
}

/**
 * 借阅记录详情
 */
export const getRecordById = (recordId) => {
  return request({
    url: `/api/borrow/record/${recordId}`,
    method: 'get'
  })
}

/**
 * 借书
 * @param {Object} data - { bookId, quantity?, borrowDays? }
 */
export const borrowBook = (data) => {
  return request({
    url: '/api/borrow',
    method: 'post',
    data
  })
}

/**
 * 还书
 * @param {Object} data - { borrowRecordId, quantity? }
 */
export const returnBook = (data) => {
  return request({
    url: '/api/borrow/return',
    method: 'post',
    data
  })
}

/**
 * 续借
 * @param {number} recordId - 借阅记录ID
 * @param {number} extendDays - 续借天数，默认 30
 */
export const extendBorrow = (recordId, extendDays = 30) => {
  return request({
    url: `/api/borrow/extend/${recordId}`,
    method: 'post',
    params: { extendDays }
  })
}

/**
 * 是否可借书
 */
export const canBorrow = () => {
  return request({
    url: '/api/borrow/can-borrow',
    method: 'get'
  })
}

/**
 * 当前借阅数量
 */
export const getBorrowCount = () => {
  return request({
    url: '/api/borrow/borrow-count',
    method: 'get'
  })
}
