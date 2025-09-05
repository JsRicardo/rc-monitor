import { Monitor, REPORT_TYPE } from '@rc-monitor/core';

import { TrackParams } from './types';

import type { App, DirectiveBinding } from 'vue';

/**
 * 创建Vue插件 v-track
 * @param monitor 监控实例
 * @returns 注册指令
 */
export default function (app: App, monitor: Monitor, errorInspector?: <T>(data: any) => T) {
  // 注册v-track指令
  app.directive('track', {
    mounted: (el, binding) => {
      console.error('🚀 ~ trackDirective.ts:17 ~ binding:', binding);

      console.error('🚀 ~ trackDirective.ts:14 ~ el:', el);
      bindTrackEvent(el, binding, monitor, errorInspector);
    },
    updated: (el, binding) => {
      // 移除旧的事件监听
      removeTrackEvent(el);
      // 重新绑定新的事件监听
      bindTrackEvent(el, binding, monitor, errorInspector);
    },
    unmounted: el => {
      removeTrackEvent(el);
    },
  });
}

/**
 * 绑定跟踪事件
 */
function bindTrackEvent(
  el: HTMLElement,
  binding: DirectiveBinding<any, string, string>,
  monitor: Monitor,
  errorInspector?: <T>(data: TrackParams) => T
): void {
  // 从binding.value获取事件名称，默认为'click'
  const eventName = binding.value || 'click';
  // 从binding.arg获取事件类型，默认为'click'
  const eventType = binding.arg || 'click';
  // 从元素的dataset中获取上报参数
  const trackParams = getTrackParams(el);
  // 从binding.modifiers获取额外配置
  const modifiers = binding.modifiers || {};

  // 创建事件处理函数
  const handleEvent = (event: Event) => {
    // 如果有once修饰符，触发后移除事件监听
    if (modifiers.once) {
      removeTrackEvent(el);
    }

    const reportParams = {
      action: eventName,
      timestamp: Date.now(),
      eventType: eventType,
      element: el?.tagName?.toLowerCase() || 'unknown',
      extras: {
        ...trackParams,
        element: el.tagName.toLowerCase(),
        elementId: el.id,
        elementClass: el.className,
        eventTarget: event.target,
      },
    };

    const params = errorInspector?.(reportParams) || reportParams;

    // 上报事件数据
    monitor.report(REPORT_TYPE.USER_BEHAVIOR, params);
  };

  // 存储事件处理函数引用，便于后续移除
  (el as any).__trackHandler = handleEvent;

  // 绑定事件监听
  el.addEventListener(eventType, handleEvent);
}

/**
 * 移除跟踪事件
 */
function removeTrackEvent(el: HTMLElement): void {
  const handler = (el as any).__trackHandler;
  if (handler) {
    // 移除所有可能的事件类型
    [
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'input',
      'change',
      'submit',
      'keydown',
      'keyup',
    ].forEach(eventType => {
      el.removeEventListener(eventType, handler);
    });
    // 清除存储的处理函数
    delete (el as any).__trackHandler;
  }
}

/**
 * 从元素的dataset中提取跟踪参数
 */
function getTrackParams(el: HTMLElement): Record<string, any> {
  const params: Record<string, any> = {};
  const dataset = el.dataset;
  console.error('🚀 ~ getTrackParams ~ dataset:', dataset);

  if (!dataset) {
    return params;
  }

  // 遍历dataset，提取所有以track开头的属性
  Object.keys(dataset).forEach(key => {
    // 处理camelCase转换为snake_case
    const paramKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    // 尝试将字符串转换为实际类型
    params[paramKey] = parseValue(dataset[key] || '');
  });

  return params;
}

/**
 * 解析字符串值为实际类型
 */
function parseValue(value: string): any {
  // 尝试解析为JSON
  try {
    return JSON.parse(value);
  } catch {
    // 尝试解析为数字
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    // 尝试解析为布尔值
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
    // 保持原始字符串
    return value;
  }
}
