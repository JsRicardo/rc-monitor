<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Taro, { getCurrentPages, getDeviceInfo, getCurrentInstance } from '@tarojs/taro';

const msg = ref('Hello world 2');

onMounted(() => {
  console.error('🚀 ~ index.vue:13 ~ monitor:', Taro === globalThis.__Monitor__Framework__);
  console.error('🚀 ~ index.vue:14 ~ getCurrentPages:', getCurrentInstance());
});
</script>
