export interface LostItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  foundTime: string
  contact: string
  images: string[]
  status: 'lost' | 'found' | 'claimed'
  reward?: string
  publisherName: string
  publisherId: string
  createTime: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface User {
  id: string
  name: string
  avatar: string
  phone: string
  school: string
  department: string
  registerTime: string
}

export type StatusType = 'all' | 'lost' | 'found'
