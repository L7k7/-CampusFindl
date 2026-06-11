<template>
  <view class="page">
    <view class="tabs">
      <view 
        :class="['tab', { active: activeTab === 'lost' }]"
        @click="activeTab = 'lost'"
      >
        我丢了
      </view>
      <view 
        :class="['tab', { active: activeTab === 'found' }]"
        @click="activeTab = 'found'"
      >
        我捡到
      </view>
    </view>

    <view class="form-content">
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">物品名称</text>
          <input 
            v-model="form.title" 
            class="form-input" 
            placeholder="请输入物品名称"
          />
        </view>

        <view class="form-item">
          <text class="form-label">物品分类</text>
          <view class="category-picker" @click="showCategoryPicker = true">
            <text class="picker-value">{{ selectedCategory || '请选择分类' }}</text>
            <text class="picker-arrow">›</text>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">{{ activeTab === 'lost' ? '丢失地点' : '捡到地点' }}</text>
          <input 
            v-model="form.location" 
            class="form-input" 
            :placeholder="`请输入${activeTab === 'lost' ? '丢失' : '捡到'}地点`"
          />
        </view>

        <view class="form-item">
          <text class="form-label">{{ activeTab === 'lost' ? '丢失时间' : '捡到时间' }}</text>
          <picker mode="date" :value="form.foundTime" @change="onDateChange">
            <view class="category-picker">
              <text class="picker-value">{{ form.foundTime || '请选择日期' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">物品描述</text>
          <textarea 
            v-model="form.description" 
            class="form-textarea" 
            placeholder="请详细描述物品特征，便于他人识别..."
            :maxlength="500"
          />
          <text class="textarea-count">{{ form.description.length }}/500</text>
        </view>

        <view v-if="activeTab === 'lost'" class="form-item">
          <text class="form-label">悬赏金额（选填）</text>
          <view class="reward-input-wrap">
            <text class="reward-symbol">¥</text>
            <input 
              v-model="form.reward" 
              class="reward-input" 
              type="number"
              placeholder="请输入悬赏金额"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input 
            v-model="form.contact" 
            class="form-input" 
            type="number"
            placeholder="请输入联系电话"
          />
        </view>

        <view class="form-item">
          <text class="form-label">上传照片</text>
          <view class="upload-section">
            <view 
              v-for="(img, index) in form.images" 
              :key="index"
              class="upload-item"
            >
              <image :src="img" class="upload-image" mode="aspectFill" />
              <view class="delete-btn" @click="removeImage(index)">✕</view>
            </view>
            <view 
              v-if="form.images.length < 3"
              class="upload-add"
              @click="chooseImage"
            >
              <text class="add-icon">+</text>
              <text class="add-text">添加图片</text>
            </view>
          </view>
        </view>
      </view>

      <view class="submit-btn" @click="submitForm">
        发布信息
      </view>
    </view>

    <view v-if="showCategoryPicker" class="picker-modal" @click="showCategoryPicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择物品分类</text>
          <text class="picker-close" @click="showCategoryPicker = false">✕</text>
        </view>
        <view class="picker-list">
          <view 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['picker-item', { active: selectedCategory === cat.name }]"
            @click="selectCategory(cat.name)"
          >
            <text class="picker-icon">{{ cat.icon }}</text>
            <text class="picker-name">{{ cat.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useItemStore } from '@/stores/item'
import { useUserStore } from '@/stores/user'
import TabBar from '@/components/TabBar.vue'

const itemStore = useItemStore()
const userStore = useUserStore()

const activeTab = ref<'lost' | 'found'>('lost')
const showCategoryPicker = ref(false)

const form = reactive({
  title: '',
  category: '',
  location: '',
  foundTime: '',
  description: '',
  reward: '',
  contact: '',
  images: [] as string[]
})

const selectedCategory = computed({
  get: () => form.category,
  set: (val) => { form.category = val }
})

const categories = itemStore.categories

function selectCategory(name: string) {
  form.category = name
  showCategoryPicker.value = false
}

function onDateChange(e: any) {
  form.foundTime = e.detail.value
}

function chooseImage() {
  uni.chooseImage({
    count: 3 - form.images.length,
    success: (res) => {
      form.images.push(...res.tempFilePaths)
    }
  })
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

function submitForm() {
  if (!form.title.trim()) {
    uni.showToast({ title: '请输入物品名称', icon: 'none' })
    return
  }
  if (!form.category) {
    uni.showToast({ title: '请选择物品分类', icon: 'none' })
    return
  }
  if (!form.location.trim()) {
    uni.showToast({ title: '请输入地点', icon: 'none' })
    return
  }
  if (!form.foundTime) {
    uni.showToast({ title: '请选择时间', icon: 'none' })
    return
  }
  if (!form.description.trim()) {
    uni.showToast({ title: '请描述物品特征', icon: 'none' })
    return
  }
  if (!form.contact.trim()) {
    uni.showToast({ title: '请输入联系电话', icon: 'none' })
    return
  }

  itemStore.addItem({
    title: form.title,
    description: form.description,
    category: form.category,
    location: form.location,
    foundTime: form.foundTime,
    contact: form.contact,
    images: form.images,
    status: activeTab.value,
    reward: form.reward || undefined,
    publisherName: userStore.currentUser.name,
    publisherId: userStore.currentUser.id
  })

  uni.showToast({ title: '发布成功', icon: 'success' })
  
  setTimeout(() => {
    form.title = ''
    form.category = ''
    form.location = ''
    form.foundTime = ''
    form.description = ''
    form.reward = ''
    form.contact = ''
    form.images = []
    uni.switchTab({ url: '/pages/index/index' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 180rpx;
}

.tabs {
  display: flex;
  background: $white;
  padding: 32rpx 40rpx;
  gap: 32rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab {
  flex: 1;
  padding: 32rpx;
  text-align: center;
  font-size: 40rpx;
  color: $text-light;
  background: $bg-color;
  border-radius: $radius-lg;
  border: 3rpx solid transparent;
  &.active {
    color: $primary-color;
    background: $primary-light;
    border-color: $primary-color;
    font-weight: 700;
  }
}

.form-content {
  padding: 32rpx 40rpx;
}

.form-section {
  background: $white;
  border-radius: $radius-lg;
  padding: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 38rpx;
  color: $text-color;
  margin-bottom: 24rpx;
  display: block;
  font-weight: 600;
}

.form-input {
  width: 100%;
  height: 112rpx;
  background: $bg-color;
  border-radius: $radius-md;
  padding: 0 36rpx;
  font-size: 38rpx;
}

.category-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  background: $bg-color;
  border-radius: $radius-md;
  padding: 0 36rpx;
  .picker-value {
    font-size: 38rpx;
    color: $text-color;
  }
  .picker-arrow {
    font-size: 48rpx;
    color: $text-gray;
  }
}

.form-textarea {
  width: 100%;
  height: 280rpx;
  background: $bg-color;
  border-radius: $radius-md;
  padding: 28rpx 36rpx;
  font-size: 38rpx;
  line-height: 1.6;
}

.textarea-count {
  display: block;
  text-align: right;
  font-size: 32rpx;
  color: $text-gray;
  margin-top: 14rpx;
}

.reward-input-wrap {
  display: flex;
  align-items: center;
  background: $bg-color;
  border-radius: $radius-md;
  padding: 0 36rpx;
  .reward-symbol {
    font-size: 44rpx;
    color: $text-color;
  }
  .reward-input {
    flex: 1;
    height: 112rpx;
    font-size: 38rpx;
    padding-left: 24rpx;
  }
}

.upload-section {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
}

.upload-item {
  position: relative;
  width: 260rpx;
  height: 260rpx;
  border-radius: $radius-md;
  overflow: hidden;
  .upload-image {
    width: 100%;
    height: 100%;
  }
  .delete-btn {
    position: absolute;
    top: 14rpx;
    right: 14rpx;
    width: 60rpx;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.5);
    color: $white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
  }
}

.upload-add {
  width: 260rpx;
  height: 260rpx;
  border: 3rpx dashed $border-color;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .add-icon {
    font-size: 72rpx;
    color: $text-gray;
  }
  .add-text {
    font-size: 34rpx;
    color: $text-gray;
    margin-top: 14rpx;
  }
}

.submit-btn {
  margin-top: 48rpx;
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

.picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.picker-content {
  width: 100%;
  background: $white;
  border-radius: 44rpx 44rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 44rpx;
    border-bottom: 3rpx solid $border-color;
    .picker-title {
      font-size: 42rpx;
      font-weight: 700;
    }
    .picker-close {
      font-size: 48rpx;
      color: $text-gray;
    }
  }
}

.picker-list {
  padding: 36rpx 44rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.picker-item {
  display: flex;
  align-items: center;
  padding: 36rpx 0;
  border-bottom: 3rpx solid $border-color;
  &:last-child {
    border-bottom: none;
  }
  &.active {
    .picker-name {
      color: $primary-color;
      font-weight: 700;
    }
  }
  .picker-icon {
    font-size: 60rpx;
    margin-right: 32rpx;
  }
  .picker-name {
    font-size: 40rpx;
    color: $text-color;
  }
}
</style>
