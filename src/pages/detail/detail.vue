<template>
  <view class="page" v-if="item">
    <swiper 
      v-if="item.images && item.images.length > 0" 
      class="image-swiper"
      indicator-dots
      autoplay
      circular
    >
      <swiper-item v-for="(img, index) in item.images" :key="index">
        <image :src="img" class="swiper-image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="content">
      <view class="status-row">
        <view :class="['status-badge', `status-${item.status}`]">
          {{ getStatusText(item.status) }}
        </view>
        <view v-if="item.reward" class="reward-badge">
          💰 悬赏 {{ item.reward }}
        </view>
      </view>

      <text class="title">{{ item.title }}</text>

      <view class="info-grid">
        <view class="info-item">
          <text class="info-icon">📦</text>
          <text class="info-label">物品分类</text>
          <text class="info-value">{{ item.category }}</text>
        </view>
        <view class="info-item">
          <text class="info-icon">📍</text>
          <text class="info-label">{{ item.status === 'lost' ? '丢失地点' : '捡到地点' }}</text>
          <text class="info-value">{{ item.location }}</text>
        </view>
        <view class="info-item">
          <text class="info-icon">🕐</text>
          <text class="info-label">{{ item.status === 'lost' ? '丢失时间' : '捡到时间' }}</text>
          <text class="info-value">{{ item.foundTime }}</text>
        </view>
        <view class="info-item">
          <text class="info-icon">👤</text>
          <text class="info-label">发布人</text>
          <text class="info-value">{{ item.publisherName }}</text>
        </view>
      </view>

      <view class="section">
        <text class="section-title">物品描述</text>
        <text class="section-content">{{ item.description }}</text>
      </view>

      <view class="section">
        <text class="section-title">联系方式</text>
        <view class="contact-wrap">
          <text class="contact-text">{{ item.contact }}</text>
          <view class="contact-actions">
            <view class="action-btn" @click="makeCall">
              <text class="action-icon">📞</text>
              <text class="action-text">拨打电话</text>
            </view>
            <view class="action-btn" @click="sendMessage">
              <text class="action-icon">💬</text>
              <text class="action-text">发送短信</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">发布时间</text>
        <text class="section-content">{{ item.createTime }}</text>
      </view>
    </view>

    <view class="bottom-bar">
      <view v-if="item.status !== 'claimed'" class="claim-btn" @click="handleClaim">
        {{ item.status === 'lost' ? '我捡到了' : '这是我的' }}
      </view>
      <view v-else class="claimed-btn">
        已归还
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useItemStore } from '@/stores/item'
import type { LostItem } from '@/types'

const itemStore = useItemStore()
const item = ref<LostItem | null>(null)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any)?.options || {}
  
  if (options.id) {
    item.value = itemStore.getItemById(options.id)
  }
})

function getStatusText(status: string) {
  const map: Record<string, string> = {
    lost: '寻找失主',
    found: '等待认领',
    claimed: '已归还'
  }
  return map[status] || status
}

function makeCall() {
  if (!item.value?.contact) return
  uni.makePhoneCall({
    phoneNumber: item.value.contact
  })
}

function sendMessage() {
  if (!item.value?.contact) return
  uni.sms({
    phoneNumber: item.value.contact
  })
}

function handleClaim() {
  uni.showModal({
    title: '确认认领',
    content: item.value?.status === 'lost' 
      ? '确认您已捡到该物品？' 
      : '确认这是您丢失的物品？',
    success: (res) => {
      if (res.confirm && item.value) {
        itemStore.claimItem(item.value.id)
        item.value.status = 'claimed'
        uni.showToast({ title: '认领成功', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
}

.image-swiper {
  width: 100%;
  height: 600rpx;
  background: $white;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.content {
  padding: 44rpx;
  padding-bottom: 200rpx;
}

.status-row {
  display: flex;
  gap: 24rpx;
  margin-bottom: 28rpx;
}

.status-badge {
  padding: 18rpx 36rpx;
  border-radius: 28rpx;
  font-size: 34rpx;
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

.reward-badge {
  padding: 18rpx 36rpx;
  border-radius: 28rpx;
  font-size: 34rpx;
  background: rgba($orange, 0.1);
  color: $orange;
}

.title {
  font-size: 56rpx;
  font-weight: 700;
  color: $text-color;
  margin-bottom: 48rpx;
  display: block;
  line-height: 1.4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
  margin-bottom: 48rpx;
}

.info-item {
  background: $white;
  padding: 36rpx;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  .info-icon {
    font-size: 56rpx;
    margin-bottom: 18rpx;
  }
  .info-label {
    font-size: 32rpx;
    color: $text-gray;
    margin-bottom: 14rpx;
  }
  .info-value {
    font-size: 38rpx;
    color: $text-color;
    font-weight: 700;
  }
}

.section {
  background: $white;
  padding: 36rpx;
  border-radius: $radius-md;
  margin-bottom: 32rpx;
  .section-title {
    font-size: 38rpx;
    font-weight: 700;
    color: $text-color;
    margin-bottom: 24rpx;
    display: block;
  }
  .section-content {
    font-size: 36rpx;
    color: $text-light;
    line-height: 1.7;
  }
}

.contact-wrap {
  .contact-text {
    font-size: 52rpx;
    font-weight: 700;
    color: $text-color;
    margin-bottom: 32rpx;
    display: block;
  }
  .contact-actions {
    display: flex;
    gap: 32rpx;
  }
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18rpx;
    padding: 32rpx;
    background: $bg-color;
    border-radius: $radius-md;
    .action-icon {
      font-size: 48rpx;
    }
    .action-text {
      font-size: 36rpx;
      color: $text-color;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 36rpx 44rpx;
  padding-bottom: calc(36rpx + env(safe-area-inset-bottom));
  background: $white;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.claim-btn {
  padding: 40rpx;
  background: $primary-color;
  color: $white;
  border-radius: $radius-lg;
  text-align: center;
  font-size: 42rpx;
  font-weight: 700;
  &:active {
    background: $primary-dark;
  }
}

.claimed-btn {
  padding: 40rpx;
  background: $bg-color;
  color: $text-gray;
  border-radius: $radius-lg;
  text-align: center;
  font-size: 42rpx;
}
</style>
