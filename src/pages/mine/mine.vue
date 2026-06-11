<template>
  <view class="page">
    <view class="header">
      <view class="user-card">
        <view class="avatar-wrap">
          <text class="avatar">👤</text>
        </view>
        <view class="user-info">
          <text class="user-name">{{ currentUser.name }}</text>
          <text class="user-school">{{ currentUser.school }}</text>
          <text class="user-department">{{ currentUser.department }}</text>
        </view>
        <view class="edit-btn">
          <text class="edit-icon">⚙️</text>
        </view>
      </view>

      <view class="stats-card">
        <view class="stat-item" @click="goToMyItems('all')">
          <text class="stat-num">{{ myItems.length }}</text>
          <text class="stat-label">全部发布</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="goToMyItems('lost')">
          <text class="stat-num">{{ myLostItems.length }}</text>
          <text class="stat-label">寻找失主</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="goToMyItems('found')">
          <text class="stat-num">{{ myFoundItems.length }}</text>
          <text class="stat-label">捡到物品</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-card">
        <view class="menu-item" @click="goToMyItems('claimed')">
          <text class="menu-icon">✅</text>
          <text class="menu-text">已归还物品</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToFavorites">
          <text class="menu-icon">❤️</text>
          <text class="menu-text">我的收藏</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToHistory">
          <text class="menu-icon">📖</text>
          <text class="menu-text">浏览历史</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="menu-card">
        <view class="menu-item" @click="goToHelp">
          <text class="menu-icon">❓</text>
          <text class="menu-text">使用帮助</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToFeedback">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <TabBar :current="2" />
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useItemStore } from '@/stores/item'
import TabBar from '@/components/TabBar.vue'

const userStore = useUserStore()
const itemStore = useItemStore()

const currentUser = userStore.currentUser

const myItems = computed(() => {
  return itemStore.items.filter(item => item.publisherId === currentUser.id)
})

const myLostItems = computed(() => {
  return myItems.value.filter(item => item.status === 'lost')
})

const myFoundItems = computed(() => {
  return myItems.value.filter(item => item.status === 'found')
})

function goToMyItems(status: string) {
  uni.showToast({ title: `查看${status === 'all' ? '全部' : status === 'lost' ? '寻找失主' : status === 'found' ? '捡到物品' : '已归还'}`, icon: 'none' })
}

function goToFavorites() {
  uni.showToast({ title: '我的收藏', icon: 'none' })
}

function goToHistory() {
  uni.showToast({ title: '浏览历史', icon: 'none' })
}

function goToHelp() {
  uni.showToast({ title: '使用帮助', icon: 'none' })
}

function goToFeedback() {
  uni.showToast({ title: '意见反馈', icon: 'none' })
}

function goToAbout() {
  uni.showModal({
    title: '关于我们',
    content: '校园失物招领平台 v1.0.0\n\n致力于帮助师生快速找回遗失物品，共建和谐校园！',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
}

.header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  padding: 88rpx 44rpx 56rpx;
}

.user-card {
  display: flex;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar-wrap {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 36rpx;
}

.avatar {
  font-size: 96rpx;
}

.user-info {
  flex: 1;
  .user-name {
    font-size: 52rpx;
    font-weight: 700;
    color: $white;
    display: block;
    margin-bottom: 14rpx;
  }
  .user-school {
    font-size: 34rpx;
    color: rgba(255, 255, 255, 0.85);
    display: block;
    margin-bottom: 10rpx;
  }
  .user-department {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.7);
    display: block;
  }
}

.edit-btn {
  width: 112rpx;
  height: 112rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 56rpx;
}

.stats-card {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.2);
  border-radius: $radius-lg;
  padding: 48rpx 36rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .stat-num {
    font-size: 64rpx;
    font-weight: 700;
    color: $white;
  }
  .stat-label {
    font-size: 34rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 14rpx;
  }
}

.stat-divider {
  width: 2rpx;
  background: rgba(255, 255, 255, 0.3);
}

.menu-section {
  padding: 36rpx 44rpx;
}

.menu-card {
  background: $white;
  border-radius: $radius-lg;
  margin-bottom: 36rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 40rpx 36rpx;
  border-bottom: 3rpx solid $border-color;
  &:last-child {
    border-bottom: none;
  }
  &:active {
    background: $bg-color;
  }
  .menu-icon {
    font-size: 56rpx;
    margin-right: 32rpx;
  }
  .menu-text {
    flex: 1;
    font-size: 40rpx;
    color: $text-color;
  }
  .menu-arrow {
    font-size: 52rpx;
    color: $text-gray;
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
