import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LostItem, Category, StatusType } from '@/types'

export const useItemStore = defineStore('item', () => {
  const categories = ref<Category[]>([
    { id: '1', name: '证件卡类', icon: '📄' },
    { id: '2', name: '电子产品', icon: '📱' },
    { id: '3', name: '学习用品', icon: '📚' },
    { id: '4', name: '生活用品', icon: '🎒' },
    { id: '5', name: '服饰配件', icon: '👔' },
    { id: '6', name: '其他物品', icon: '📦' }
  ])

  const mockItems = ref<LostItem[]>([
    {
      id: '1',
      title: '学生证丢失',
      description: '本人于今日上午在图书馆三楼自习室丢失学生证一张，姓名张三，学号2021001001，请拾到者联系我，必有重谢！',
      category: '证件卡类',
      location: '图书馆三楼自习室',
      foundTime: '2024-01-15 09:30',
      contact: '13800138001',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=student%20ID%20card%20lost%20on%20campus&image_size=square'],
      status: 'lost',
      reward: '50元',
      publisherName: '张三',
      publisherId: 'u1',
      createTime: '2024-01-15 10:00'
    },
    {
      id: '2',
      title: '捡到苹果手机',
      description: '在教学楼A栋门口捡到一部苹果14手机，黑色外壳，屏幕有轻微划痕，请失主尽快联系认领。',
      category: '电子产品',
      location: '教学楼A栋门口',
      foundTime: '2024-01-14 16:20',
      contact: '13900139002',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20iphone%2014%20smartphone&image_size=square'],
      status: 'found',
      publisherName: '李四',
      publisherId: 'u2',
      createTime: '2024-01-14 16:30'
    },
    {
      id: '3',
      title: '丢失笔记本电脑',
      description: '银色MacBook Pro 14寸，外壳有苹果标志贴纸，电脑包是黑色的，内有重要学习资料，非常着急！',
      category: '电子产品',
      location: '食堂二楼',
      foundTime: '2024-01-13 12:00',
      contact: '13700137003',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=silver%20macbook%20pro%20laptop&image_size=square'],
      status: 'lost',
      reward: '200元',
      publisherName: '王五',
      publisherId: 'u3',
      createTime: '2024-01-13 12:30'
    },
    {
      id: '4',
      title: '捡到校园卡',
      description: '在体育馆门口捡到一张校园卡，姓名赵六，学院信息学院，请失主联系我。',
      category: '证件卡类',
      location: '体育馆门口',
      foundTime: '2024-01-12 18:45',
      contact: '13600136004',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=campus%20ID%20card%20student&image_size=square'],
      status: 'found',
      publisherName: '孙七',
      publisherId: 'u4',
      createTime: '2024-01-12 19:00'
    },
    {
      id: '5',
      title: '丢失书包',
      description: '蓝色双肩背包，内有课本和文具，在操场跑步时丢失。',
      category: '生活用品',
      location: '操场跑道',
      foundTime: '2024-01-11 17:00',
      contact: '13500135005',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blue%20backpack%20school%20bag&image_size=square'],
      status: 'lost',
      publisherName: '周八',
      publisherId: 'u5',
      createTime: '2024-01-11 17:30'
    },
    {
      id: '6',
      title: '捡到钱包',
      description: '棕色皮质钱包，内有现金若干和银行卡，在图书馆门口捡到。',
      category: '生活用品',
      location: '图书馆门口',
      foundTime: '2024-01-10 10:30',
      contact: '13400134006',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=brown%20leather%20wallet&image_size=square'],
      status: 'found',
      publisherName: '吴九',
      publisherId: 'u6',
      createTime: '2024-01-10 11:00'
    }
  ])

  const items = ref<LostItem[]>([...mockItems.value])
  const filterStatus = ref<StatusType>('all')
  const filterCategory = ref<string>('')
  const searchKeyword = ref('')

  const filteredItems = computed(() => {
    return items.value.filter(item => {
      const statusMatch = filterStatus.value === 'all' || item.status === filterStatus.value
      const categoryMatch = !filterCategory.value || item.category === filterCategory.value
      const keywordMatch = !searchKeyword.value || 
        item.title.includes(searchKeyword.value) || 
        item.description.includes(searchKeyword.value) ||
        item.location.includes(searchKeyword.value)
      return statusMatch && categoryMatch && keywordMatch
    }).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  })

  const lostCount = computed(() => items.value.filter(i => i.status === 'lost').length)
  const foundCount = computed(() => items.value.filter(i => i.status === 'found').length)
  const claimedCount = computed(() => items.value.filter(i => i.status === 'claimed').length)

  function addItem(item: Omit<LostItem, 'id' | 'createTime'>) {
    const newItem: LostItem = {
      ...item,
      id: Date.now().toString(),
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    items.value.unshift(newItem)
  }

  function getItemById(id: string) {
    return items.value.find(item => item.id === id)
  }

  function claimItem(id: string) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.status = 'claimed'
    }
  }

  function setFilterStatus(status: StatusType) {
    filterStatus.value = status
  }

  function setFilterCategory(category: string) {
    filterCategory.value = category
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  return {
    categories,
    items,
    filteredItems,
    filterStatus,
    filterCategory,
    searchKeyword,
    lostCount,
    foundCount,
    claimedCount,
    addItem,
    getItemById,
    claimItem,
    setFilterStatus,
    setFilterCategory,
    setSearchKeyword
  }
})
