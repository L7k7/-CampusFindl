<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <view class="logo-section">
          <view class="logo">🔍</view>
          <view class="title">校园失物招领</view>
        </view>
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-value">{{ lostCount }}</text>
            <text class="stat-label">待找回</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ foundCount }}</text>
            <text class="stat-label">已捡到</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ claimedCount }}</text>
            <text class="stat-label">已归还</text>
          </view>
        </view>
      </view>
    </view>

    <view class="search-section">
      <view class="search-bar" @click="openSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">{{ localKeyword || '搜索失物信息...' }}</text>
        <view v-if="localKeyword" class="clear-btn" @click.stop="clearSearch">✕</view>
      </view>
    </view>

    <view class="filter-section">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-tabs">
          <view 
            v-for="tab in statusTabs" 
            :key="tab.value"
            :class="['filter-tab', { active: currentFilterStatus === tab.value }]"
            @click="handleFilterStatus(tab.value)"
          >
            {{ tab.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="category-section">
      <scroll-view scroll-x class="category-scroll">
        <view class="category-list">
          <view 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['category-item', { active: currentFilterCategory === cat.name }]"
            @click="handleCategoryClick(cat.name)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="list-section">
      <view v-if="filteredItems.length > 0" class="item-list">
        <view 
          v-for="item in filteredItems" 
          :key="item.id" 
          class="item-card"
          @click="goToDetail(item.id)"
        >
          <view class="item-image-wrap">
            <image 
              v-if="item.images && item.images.length > 0" 
              :src="item.images[0]" 
              class="item-image"
              mode="aspectFill"
            />
            <view v-else class="item-image-placeholder">📦</view>
          </view>
          <view class="item-info">
            <view class="item-header">
              <text class="item-title">{{ item.title }}</text>
              <view :class="['status-tag', `status-${item.status}`]">
                {{ getStatusText(item.status) }}
              </view>
            </view>
            <text class="item-desc">{{ item.description }}</text>
            <view class="item-footer">
              <view class="item-meta">
                <text class="meta-icon">📍</text>
                <text class="meta-text">{{ item.location }}</text>
              </view>
              <text class="item-time">{{ formatTime(item.createTime) }}</text>
            </view>
            <view v-if="item.reward" class="reward-tag">
              💰 悬赏 {{ item.reward }}
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无相关失物信息</text>
        <view class="empty-btn" @click="goToPublish">发布信息</view>
      </view>
    </view>

    <TabBar :current="0" />

    <view v-if="showSearch" class="search-modal" @click="closeSearch">
      <view class="search-modal-content" @click.stop>
        <view class="search-input-wrap">
          <input 
            v-model="localKeyword" 
            class="search-input" 
            placeholder="搜索失物信息..."
            :focus="showSearch"
            @confirm="doSearch"
          />
          <view class="search-action" @click="doSearch">搜索</view>
        </view>
        <view class="hot-search">
          <text class="hot-title">热门搜索</text>
          <view class="hot-tags">
            <text 
              v-for="tag in hotTags" 
              :key="tag" 
              class="hot-tag"
              @click="selectHotTag(tag)"
            >{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useItemStore } from '@/stores/item'
import TabBar from '@/components/TabBar.vue'
import type { StatusType } from '@/types'

const itemStore = useItemStore()

// 使用 storeToRefs 保持响应式
const { 
  categories, 
  filteredItems, 
  filterStatus, 
  filterCategory,
  searchKeyword,
  lostCount,
  foundCount,
  claimedCount
} = storeToRefs(itemStore)

// 本地状态
const showSearch = ref(false)
const localKeyword = ref('')

// 计算属性用于模板
const currentFilterStatus = computed(() => filterStatus.value)
const currentFilterCategory = computed(() => filterCategory.value)

const statusTabs = [
  { label: '全部', value: 'all' as StatusType },
  { label: '寻找失物', value: 'lost' as StatusType },
  { label: '捡到物品', value: 'found' as StatusType }
]

const hotTags = ['学生证', '手机', '电脑', '校园卡', '钱包', '书包']

// 状态筛选处理
function handleFilterStatus(status: StatusType) {
  itemStore.setFilterStatus(status)
}

// 分类筛选处理
function handleCategoryClick(name: string) {
  if (filterCategory.value === name) {
    itemStore.setFilterCategory('')
  } else {
    itemStore.setFilterCategory(name)
  }
}

// 搜索相关
function openSearch() {
  localKeyword.value = searchKeyword.value
  showSearch.value = true
}

function closeSearch() {
  showSearch.value = false
}

function doSearch() {
  itemStore.setSearchKeyword(localKeyword.value)
  showSearch.value = false
}

function selectHotTag(tag: string) {
  localKeyword.value = tag
  doSearch()
}

function clearSearch() {
  localKeyword.value = ''
  itemStore.setSearchKeyword('')
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    lost: '寻找失主',
    found: '等待认领',
    claimed: '已归还'
  }
  return map[status] || status
}

function formatTime(timeStr: string) {
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now.getTime() - time.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return timeStr.slice(5, 16)
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function goToPublish() {
  uni.switchTab({ url: '/pages/publish/publish' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 180rpx;
}

.header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  padding: 80rpx 40rpx 50rpx;
  border-radius: 0 0 56rpx 56rpx;
}

.header-content {
  .logo-section {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 48rpx;
    .logo {
      font-size: 80rpx;
    }
    .title {
      font-size: 60rpx;
      font-weight: 700;
      color: $white;
    }
  }
}

.stats-row {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-lg;
  padding: 32rpx 20rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .stat-value {
    font-size: 56rpx;
    font-weight: 700;
    color: $white;
  }
  .stat-label {
    font-size: 30rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 10rpx;
  }
}

.stat-divider {
  width: 2rpx;
  background: rgba(255, 255, 255, 0.3);
}

.search-section {
  padding: 0 40rpx;
  margin-top: -40rpx;
  position: relative;
  z-index: 10;
}

.search-bar {
  display: flex;
  align-items: center;
  background: $white;
  border-radius: $radius-xl;
  padding: 36rpx 44rpx;
  box-shadow: $shadow-md;
  .search-icon {
    font-size: 44rpx;
    margin-right: 24rpx;
  }
  .search-placeholder {
    flex: 1;
    font-size: 38rpx;
    color: $text-gray;
  }
  .clear-btn {
    font-size: 40rpx;
    color: $text-gray;
    padding: 12rpx;
  }
}

.filter-section {
  padding: 32rpx 0;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-tabs {
  display: inline-flex;
  padding: 0 40rpx;
  gap: 32rpx;
}

.filter-tab {
  padding: 26rpx 48rpx;
  font-size: 38rpx;
  color: $text-light;
  background: $white;
  border-radius: $radius-xl;
  border: 3rpx solid transparent;
  &.active {
    color: $primary-color;
    background: $primary-light;
    border-color: $primary-color;
    font-weight: 600;
  }
}

.category-section {
  padding: 24rpx 0;
  background: $white;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 0 40rpx;
  gap: 32rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 36rpx;
  border-radius: $radius-md;
  background: $bg-color;
  border: 3rpx solid transparent;
  &.active {
    background: $primary-light;
    border-color: $primary-color;
    .category-name {
      color: $primary-color;
      font-weight: 600;
    }
  }
  .category-icon {
    font-size: 60rpx;
    margin-bottom: 14rpx;
  }
  .category-name {
    font-size: 34rpx;
    color: $text-light;
  }
}

.list-section {
  padding: 32rpx 40rpx;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.item-card {
  display: flex;
  background: $white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-sm;
  .item-image-wrap {
    width: 240rpx;
    height: 240rpx;
    flex-shrink: 0;
    .item-image {
      width: 100%;
      height: 100%;
    }
    .item-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80rpx;
      background: $bg-color;
    }
  }
  .item-info {
    flex: 1;
    padding: 28rpx;
    display: flex;
    flex-direction: column;
  }
  .item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    .item-title {
      font-size: 36rpx;
      font-weight: 600;
      color: $text-color;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16rpx;
    }
  }
  .item-desc {
    font-size: 30rpx;
    color: $text-light;
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-bottom: 16rpx;
    line-height: 1.5;
  }
  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-meta {
      display: flex;
      align-items: center;
      .meta-icon {
        font-size: 30rpx;
        margin-right: 10rpx;
      }
      .meta-text {
        font-size: 28rpx;
        color: $text-gray;
      }
    }
    .item-time {
      font-size: 26rpx;
      color: $text-gray;
    }
  }
  .reward-tag {
    font-size: 28rpx;
    color: $orange;
    margin-top: 16rpx;
    font-weight: 500;
  }
}

.status-tag {
  font-size: 30rpx;
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
  &.status-lost {
    background: rgba($red, 0.1);
    color: $red;
  }
  &.status-found {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  &.status-claimed {
    background: rgba($text-gray, 0.1);
    color: $text-gray;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 140rpx 0;
  .empty-icon {
    font-size: 140rpx;
    margin-bottom: 40rpx;
  }
  .empty-text {
    font-size: 40rpx;
    color: $text-gray;
    margin-bottom: 48rpx;
  }
  .empty-btn {
    padding: 32rpx 96rpx;
    background: $primary-color;
    color: $white;
    border-radius: $radius-xl;
    font-size: 38rpx;
    font-weight: 600;
  }
}

.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.search-modal-content {
  background: $white;
  padding: 48rpx;
  padding-top: 140rpx;
  border-radius: 0 0 64rpx 64rpx;
  .search-input-wrap {
    display: flex;
    gap: 32rpx;
    margin-bottom: 56rpx;
    .search-input {
      flex: 1;
      height: 112rpx;
      background: $bg-color;
      border-radius: $radius-lg;
      padding: 0 40rpx;
      font-size: 38rpx;
    }
    .search-action {
      padding: 0 64rpx;
      height: 112rpx;
      line-height: 112rpx;
      background: $primary-color;
      color: $white;
      border-radius: $radius-lg;
      font-size: 38rpx;
      font-weight: 600;
    }
  }
}

.hot-search {
  .hot-title {
    font-size: 36rpx;
    color: $text-light;
    margin-bottom: 32rpx;
    display: block;
  }
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    .hot-tag {
      padding: 24rpx 40rpx;
      background: $bg-color;
      border-radius: $radius-xl;
      font-size: 34rpx;
      color: $text-light;
    }
  }
}
</style>
