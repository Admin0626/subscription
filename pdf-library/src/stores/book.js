import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookApi, categoryApi, tagApi } from '@/api'

export const useBookStore = defineStore('book', () => {
  const books = ref([])
  const currentBook = ref(null)
  const categories = ref([])
  const tags = ref([])
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })
  const loading = ref(false)

  async function fetchBooks(params = {}) {
    loading.value = true
    try {
      const res = await bookApi.getList(params)
      books.value = res.data.list
      pagination.value = {
        page: res.data.page,
        pageSize: res.data.pageSize,
        total: res.data.total
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchBookDetail(id) {
    loading.value = true
    try {
      const res = await bookApi.getDetail(id)
      currentBook.value = res.data
      return res.data
    } catch (error) {
      console.error('Failed to fetch book detail:', error)
    } finally {
      loading.value = false
    }
  }

  async function searchBooks(params = {}) {
    loading.value = true
    try {
      const res = await bookApi.search(params)
      books.value = res.data.list
      pagination.value = {
        page: res.data.page,
        pageSize: res.data.pageSize,
        total: res.data.total
      }
    } catch (error) {
      console.error('Failed to search books:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res = await categoryApi.getAll()
      categories.value = res.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  async function fetchTags() {
    try {
      const res = await tagApi.getAll()
      tags.value = res.data
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  async function createBook(data) {
    const res = await bookApi.create(data)
    return res
  }

  async function downloadBook(id) {
    const res = await bookApi.download(id)
    return res
  }

  async function rateBook(id, rating) {
    const res = await bookApi.rate(id, rating)
    return res
  }

  return {
    books,
    currentBook,
    categories,
    tags,
    pagination,
    loading,
    fetchBooks,
    fetchBookDetail,
    searchBooks,
    fetchCategories,
    fetchTags,
    createBook,
    downloadBook,
    rateBook
  }
})