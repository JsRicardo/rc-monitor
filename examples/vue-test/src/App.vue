<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import axios from 'axios';

function testNetworkError() {
  // 测试1: 使用XHR但不处理错误，让它触发全局事件
  const xhr1 = new XMLHttpRequest();
  xhr1.open('POST', 'https://nonexistent-api.com/data1', true);
  xhr1.send(JSON.stringify({ name: 'test1' }));
}

// 使用axios测试网络请求错误
function testAxiosError() {
  // 有错误处理的axios请求
  axios
    .get('https://nonexistent-api.com/data')
    .then(function (response) {})
    .catch(function (error) {
      // 这里错误被处理了，不会触发全局unhandledrejection
    });
}

// 使用axios测试未捕获的Promise错误
function testAxiosPromiseError() {
  // 没有错误处理的axios请求，应该触发全局unhandledrejection
  axios.get('https://nonexistent-api.com/data');
}

// 测试函数
function testReferenceError() {
  // 故意访问未定义的变量
  undefinedVariable.someMethod();
}

function testTypeError() {
  // 对null调用方法
  const nullVar = null;
  nullVar.someMethod();
}

function testSyntaxError() {
  // 语法错误
  eval('const x = ;');
}

function testRangeError() {
  // 数组长度异常
  new Array(-1);
}

function testPromiseRejection() {
  // 未处理的Promise拒绝
  Promise.reject(new Error('这是一个Promise拒绝错误'));
}

async function testAsyncError() {
  // async/await中的错误
  async function failingFunction() {
    throw new Error('Async函数中的错误');
  }

  failingFunction();
}

function testCustomError() {
  // 自定义错误类
  class CustomError extends Error {
    constructor(message) {
      super(message);
      this.name = 'CustomError';
      this.customProperty = '自定义属性';
    }
  }

  throw new CustomError('这是一个自定义错误');
}

function testErrorWithStack() {
  // 创建带堆栈信息的错误
  function innerFunction() {
    throw new Error('内部函数错误');
  }

  function outerFunction() {
    innerFunction();
  }

  outerFunction();
}

function testEventListenerError() {
  // 事件监听器中的错误
  const button = document.createElement('button');
  button.textContent = '点击触发错误';
  button.onclick = () => {
    throw new Error('事件监听器中的错误');
  };
  button.click();
}

function testSetTimeoutError() {
  // setTimeout中的错误
  setTimeout(() => {
    throw new Error('setTimeout中的错误');
  }, 100);
}
</script>

<template>
  <div>
    <input type="text" />
    <button>提交</button>
  </div>
  <div class="test-section">
    <h3>JavaScript 运行时错误测试</h3>
    <button @click="testReferenceError">触发 ReferenceError</button>
    <button @click="testTypeError">触发 TypeError</button>
    <button @click="testSyntaxError">触发 SyntaxError</button>
    <button @click="testRangeError">触发 RangeError</button>
  </div>

  <div class="test-section">
    <h3>网络错误</h3>
    <button @click="testNetworkError">触发 接口错误</button>
    <button @click="testAxiosError">触发 Axios 接口错误</button>
    <button @click="testAxiosPromiseError">触发 Axios Promise 未捕获错误</button>
  </div>

  <div class="test-section">
    <h3>Promise Rejection 测试</h3>
    <button @click="testPromiseRejection">触发 Promise Rejection</button>
    <button @click="testAsyncError">触发 Async/Await 错误</button>
  </div>

  <div class="test-section">
    <h3>自定义错误测试</h3>
    <button @click="testCustomError">触发自定义错误</button>
    <button @click="testErrorWithStack">触发带堆栈的错误</button>
  </div>

  <div class="test-section">
    <h3>事件监听器错误测试</h3>
    <button @click="testEventListenerError">触发事件监听器错误</button>
    <button @click="testSetTimeoutError">触发 setTimeout 错误</button>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
