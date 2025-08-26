import { onLCP, onFCP, onINP, onCLS, onTTFB } from 'web-vitals';

import { PerformanceName, PerformanceData, PerformanceMetric, PerformanceUnit } from './types';

/**
 * 使用web-vitals库获取性能指标的包装函数
 * web-vitals v5.x 使用on前缀的函数，并且是异步获取性能指标的
 * 这里我们使用Promise来处理异步获取
 */

/**
 * 获取LCP数据
 * @returns Promise<PerformanceData> LCP性能数据
 */
function getLcpData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      onLCP((metric: any) => {
        resolve({
          metric: PerformanceMetric.PAINT,
          name: PerformanceName.LCP,
          value: Math.round(metric.value),
          unit: PerformanceUnit.MS,
          extras: {
            size: metric.entries.length > 0 ? metric.entries[metric.entries.length - 1].size : 0,
            element:
              metric.entries.length > 0 && metric.entries[metric.entries.length - 1].element
                ? metric.entries[metric.entries.length - 1].element.tagName
                : 'unknown',
          },
        });
      });
    } catch (error) {
      console.error('Failed to get LCP data:', error);
      resolve({
        metric: PerformanceMetric.PAINT,
        name: PerformanceName.LCP,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取FCP数据
 * @returns Promise<PerformanceData> FCP性能数据
 */
function getFcpData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      onFCP((metric: any) => {
        resolve({
          metric: PerformanceMetric.PAINT,
          name: PerformanceName.FCP,
          value: Math.round(metric.value),
          unit: PerformanceUnit.MS,
        });
      });
    } catch (error) {
      console.error('Failed to get FCP data:', error);
      resolve({
        metric: PerformanceMetric.PAINT,
        name: PerformanceName.FCP,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取INP数据（替代FID）
 * @returns Promise<PerformanceData> INP性能数据
 */
function getInpData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      onINP((metric: any) => {
        resolve({
          metric: PerformanceMetric.LONG_TASK,
          name: PerformanceName.INP,
          value: Math.round(metric.value),
          unit: PerformanceUnit.MS,
          extras: {
            target:
              metric.entries.length > 0 && metric.entries[0].target
                ? metric.entries[0].target.tagName
                : 'unknown',
          },
        });
      });
    } catch (error) {
      console.error('Failed to get INP data:', error);
      resolve({
        metric: PerformanceMetric.LONG_TASK,
        name: PerformanceName.INP,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取CLS数据
 * @returns Promise<PerformanceData> CLS性能数据
 */
function getClsData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      onCLS((metric: any) => {
        resolve({
          metric: PerformanceMetric.LONG_TASK,
          name: PerformanceName.CLS,
          value: Math.round(metric.value * 1000) / 1000, // 保留三位小数
          unit: PerformanceUnit.COUNT,
        });
      });
    } catch (error) {
      console.error('Failed to get CLS data:', error);
      resolve({
        metric: PerformanceMetric.LONG_TASK,
        name: PerformanceName.CLS,
        value: 0,
        unit: PerformanceUnit.COUNT,
      });
    }
  });
}

/**
 * 获取TTFB数据
 * @returns Promise<PerformanceData> TTFB性能数据
 */
function getTtfbData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      onTTFB((metric: any) => {
        resolve({
          metric: PerformanceMetric.NAVIGATION,
          name: PerformanceName.TTFB,
          value: Math.round(metric.value),
          unit: PerformanceUnit.MS,
        });
      });
    } catch (error) {
      console.error('Failed to get TTFB data:', error);
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.TTFB,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取First Byte数据（使用TTFB数据，通常两者相同）
 * @returns Promise<PerformanceData> First Byte性能数据
 */
function getFirstByteData(): Promise<PerformanceData> {
  // 通常认为First Byte就是TTFB
  return getTtfbData().then(data => ({
    ...data,
    name: PerformanceName.FIRST_BYTE,
  }));
}

/**
 * 获取下载数据
 * @returns Promise<PerformanceData> 下载性能数据
 */
function getDownloadData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      if ('performance' in window) {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const navEntry = entries[0] as any;
          resolve({
            metric: PerformanceMetric.NAVIGATION,
            name: PerformanceName.DOWNLOAD,
            value: Math.round((navEntry.responseEnd || 0) - (navEntry.responseStart || 0)),
            unit: PerformanceUnit.MS,
          });
          return;
        }
      }
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.DOWNLOAD,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    } catch (error) {
      console.error('Failed to get Download data:', error);
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.DOWNLOAD,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取DOMContentLoaded数据
 * @returns Promise<PerformanceData> DOMContentLoaded性能数据
 */
function getDomContentLoadedData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      if ('performance' in window) {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const navEntry = entries[0] as any;
          resolve({
            metric: PerformanceMetric.NAVIGATION,
            name: PerformanceName.DOM_CONTENT_LOADED,
            value: Math.round((navEntry.domContentLoadedEventEnd || 0) - (navEntry.startTime || 0)),
            unit: PerformanceUnit.MS,
          });
          return;
        }
      }
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.DOM_CONTENT_LOADED,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    } catch (error) {
      console.error('Failed to get DOMContentLoaded data:', error);
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.DOM_CONTENT_LOADED,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 获取load数据
 * @returns Promise<PerformanceData> load性能数据
 */
function getLoadData(): Promise<PerformanceData> {
  return new Promise(resolve => {
    try {
      if ('performance' in window) {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const navEntry = entries[0] as any;
          resolve({
            metric: PerformanceMetric.NAVIGATION,
            name: PerformanceName.LOAD,
            value: Math.round((navEntry.loadEventEnd || 0) - (navEntry.startTime || 0)),
            unit: PerformanceUnit.MS,
          });
          return;
        }
      }
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.LOAD,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    } catch (error) {
      console.error('Failed to get Load data:', error);
      resolve({
        metric: PerformanceMetric.NAVIGATION,
        name: PerformanceName.LOAD,
        value: 0,
        unit: PerformanceUnit.MS,
      });
    }
  });
}

/**
 * 性能指标获取函数映射
 */
const performanceFnMap = new Map<PerformanceName, () => Promise<PerformanceData>>([
  [PerformanceName.LCP, getLcpData],
  [PerformanceName.FCP, getFcpData],
  [PerformanceName.INP, getInpData],
  [PerformanceName.CLS, getClsData],
  [PerformanceName.TTFB, getTtfbData],
  [PerformanceName.FIRST_BYTE, getFirstByteData],
  [PerformanceName.DOWNLOAD, getDownloadData],
  [PerformanceName.DOM_CONTENT_LOADED, getDomContentLoadedData],
  [PerformanceName.LOAD, getLoadData],
]);

/**
 * 获取性能数据
 * @param type 性能指标类型
 * @returns Promise<PerformanceData> 性能数据
 */
export function getPerformanceData(type: PerformanceName): Promise<PerformanceData> {
  const getPerformanceDataFn = performanceFnMap.get(type);
  if (getPerformanceDataFn) {
    return getPerformanceDataFn();
  }
  return Promise.resolve({} as PerformanceData);
}

/**
 * 获取所有性能指标数据
 * @returns Promise<PerformanceData[]> 所有性能指标数据
 */
export function getAllPerformanceData(): Promise<PerformanceData[]> {
  const promises: Promise<PerformanceData>[] = [];

  performanceFnMap.forEach(fn => {
    promises.push(fn().then(data => data));
  });

  return Promise.all(promises);
}
