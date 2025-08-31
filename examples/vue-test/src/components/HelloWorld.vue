<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useRCMonitor } from '@rc-monitor/rc-monitor';
const instance = getCurrentInstance();
const monitor = useRCMonitor();

console.error('🚀 ~ HelloWorld.vue:5 ~ instance:', instance);

defineProps<{ msg: string }>();

const count = ref(0);

function onClickCount(e: Event) {
  count.value++;
  monitor.report('user-behavior', { type: 'click', target: (e.target as HTMLElement).tagName });
  // instance?.appContext?.config?.globalProperties.$monitor?.report('user-behavior', {
  //   type: 'click',
  //   target: e.target,
  // });
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="onClickCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
    official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
