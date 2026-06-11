import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>({
    id: 'u1',
    name: '张三',
    avatar: '',
    phone: '13800138001',
    school: 'XX大学',
    department: '计算机学院',
    registerTime: '2024-01-01'
  })

  const isLoggedIn = ref(true)

  const myItems = computed(() => {
    const itemStore = useItemStore()
    return itemStore.items.filter(item => item.publisherId === currentUser.value.id)
  })

  function login(userInfo: Partial<User>) {
    currentUser.value = { ...currentUser.value, ...userInfo }
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
  }

  return {
    currentUser,
    isLoggedIn,
    myItems,
    login,
    logout
  }
})

import { useItemStore } from './item'
