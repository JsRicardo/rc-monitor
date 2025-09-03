<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';

const msg = ref('Hello world');

onMounted(() => {
  console.log('taro', Taro);
  console.log('global.__Monitor__Framework__', global.__Monitor__Framework__);
});
</script>
