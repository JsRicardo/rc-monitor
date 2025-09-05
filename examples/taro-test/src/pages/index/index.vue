<template>
  <view class="index">
    <text>{{ msg }}</text>
    <view
      @tap="
        () => {
          Taro.navigateTo({
            url: '/pages/second/index?name=ricardo',
          });
        }
      "
      >跳转到第二页</view
    >
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Taro, { getCurrentPages, getDeviceInfo } from '@tarojs/taro';

const msg = ref('Hello world');

onMounted(() => {
  console.log('taro', Taro);
  console.log('global.__Monitor__Framework__', global.__Monitor__Framework__);
  getCurrentPages()[0];
  const res = getDeviceInfo();
  console.log('getDeviceInfo', res);
});
</script>
