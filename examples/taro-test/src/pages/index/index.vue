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
    <image
      src="https://res.wx.qq.com/op_res/Lp2o6AYPJnHXXwjri_lgIahGjwHsYVsIpw9Y7dWUhPVwnuDfmxpg7l24O-rdSHIhJAz7yAKSfcP7vQZ3EaMOLA"
      mode="aspectFill"
    />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Taro, { getCurrentPages, getDeviceInfo } from '@tarojs/taro';

const msg = ref('Hello world');

onMounted(() => {
  console.log('taro', Taro);
  console.log('globalThis.__Monitor__Framework__', globalThis.__Monitor__Framework__);
  getCurrentPages()[0];
  const res = getDeviceInfo();
  console.log('getDeviceInfo', res);
  Taro.request({
    url: 'http://localhost:3000/api/error',
    method: 'GET',
    data: {
      name: 'ricardo',
    },
    success: res => {
      console.log('success', res);
    },
    fail: err => {
      console.log('fail', err);
    },
  });
});
</script>
