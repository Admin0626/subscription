import { defineStore } from 'pinia'
import { ref } from 'vue'
import { homeApi } from '@/api'

export const useHomeStore = defineStore('home', () => {
  const hotBooks = ref([])
  const randomBooks = ref([])
  const announcements = ref([])
  const loading = ref(false)

  async function fetchHomeData() {
    loading.value = true
    try {
      const [hot, random, announcementsData] = await Promise.all([
        homeApi.getHotBooks(),
        homeApi.getRandomBooks(),
        homeApi.getAnnouncements()
      ])
      hotBooks.value = hot.data
      randomBooks.value = random.data
      announcements.value = announcementsData.data
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    hotBooks,
    randomBooks,
    announcements,
    loading,
    fetchHomeData
  }
})