<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabs" 
      :key="index"
      :class="['tab-item', { active: currentIndex === index }]"
      @click="switchTab(index)"
    >
      <view v-if="index === 1" class="publish-btn">
        <text class="publish-icon">+</text>
      </view>
      <view v-else class="tab-icon">
        <text>{{ item.icon }}</text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  current: number
}>()

const currentIndex = ref(props.current)

watch(() => props.current, (val) => {
  currentIndex.value = val
})

const tabs = [
  { text: '首页', icon: '🏠' },
  { text: '发布', icon: '' },
  { text: '我的', icon: '👤' }
]

function switchTab(index: number) {
  if (currentIndex.value === index) return
  
  currentIndex.value = index
  
  const pages = ['/pages/index/index', '/pages/publish/publish', '/pages/mine/mine']
  uni.switchTab({
    url: pages[index]
  })
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160rpx;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 160rpx;
  &.active {
    .tab-icon {
      transform: scale(1.1);
    }
    .tab-text {
      color: $primary-color;
      font-weight: 700;
    }
  }
}

.tab-icon {
  font-size: 64rpx;
  margin-bottom: 14rpx;
  transition: transform 0.2s ease;
}

.tab-text {
  font-size: 36rpx;
  color: $text-gray;
}

.publish-btn {
  width: 140rpx;
  height: 140rpx;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60rpx;
  box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.4);
  .publish-icon {
    font-size: 84rpx;
    color: $white;
    font-weight: 300;
    line-height: 1;
  }
}
</style>
