import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';

import { PERFORMANCE_NAME, PERFORMANCE_METRIC, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceData, PerformanceName } from '../../types';

/**
 * 微信小程序性能监控插件配置选项
 */
export interface WeappPerformancePluginOptions {
  /** 需要监控的性能指标 */
  metrics?: PerformanceName[];
  /** 性能数据处理函数 */
  inspector?: (data: PerformanceData) => PerformanceData | void;
  /** 采样率，范围0-1 */
  samplingRate?: number;
  /** 是否监控页面切换性能 */
  monitorPageSwitch?: boolean;
  /** 是否监控网络请求性能 */
  monitorNetwork?: boolean;
  /** 是否监控启动性能 */
  monitorLaunch?: boolean;
}

/**
 * 微信小程序性能监控插件
 * 用于采集微信小程序性能指标
 */
export class WeappPerformancePlugin implements Plugin {
  name = PLUGIN_NAMES.WEAPP_PERFORMANCE;

  private readonly wx: Record<string, any>;
  private options: WeappPerformancePluginOptions;
  private performanceMonitor: any = null;
  private performanceObserver: any = null;
  private pagePerformanceMap: Map<string, { startTime: number }> = new Map();
  private appLaunchTime: number = 0;

  /**
   * 微信小程序性能监控插件
   * @param wx 微信小程序全局对象
   * @param options 插件配置选项
   */
  constructor(wx: Record<string, any>, options: WeappPerformancePluginOptions = {}) {
    this.wx = wx;
    this.options = {
      samplingRate: 1,
      monitorPageSwitch: true,
      monitorNetwork: true,
      monitorLaunch: true,
      ...options,
    };
  }

  private monitor: Monitor | null = null;

  /**
   * 安装插件
   */
  install(monitor: Monitor): void {
    this.monitor = monitor;
    try {
      // 检查是否在采样范围内
      if (Math.random() > this.options.samplingRate!) {
        return;
      }

      // 初始化性能监控器
      this.initPerformanceMonitor();

      // 记录应用启动时间
      this.appLaunchTime = Date.now();

      // 收集页面切换性能数据
      if (this.options.monitorPageSwitch) {
        this.monitorPageSwitch(monitor);
      }

      // 收集网络请求性能数据
      if (this.options.monitorNetwork) {
        this.monitorNetworkRequests(monitor);
      }

      // 收集启动性能数据
      if (this.options.monitorLaunch) {
        this.monitorAppLaunch(monitor);
      }

      console.log('WeappPerformancePlugin installed successfully');
    } catch (error) {
      console.error('WeappPerformancePlugin install error:', error);
    }
  }

  /**
   * 初始化性能监控器
   */
  private initPerformanceMonitor(): void {
    try {
      // 尝试获取微信小程序性能监控器
      if (typeof this.wx.getPerformance === 'function') {
        this.performanceMonitor = this.wx.getPerformance();

        // 检查是否支持createObserver方法
        if (typeof this.performanceMonitor.createObserver === 'function') {
          this.initPerformanceObserver();
        }
      }
    } catch (error) {
      console.warn('Failed to initialize performance monitor:', error);
    }
  }

  /**
   * 初始化性能观察器
   */
  private initPerformanceObserver(): void {
    try {
      // 创建性能观察器，用于监控渲染性能指标
      this.performanceObserver = this.performanceMonitor.createObserver((entryList: any) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.handlePerformanceEntry(entry);
        });
      });

      // 开始观察特定类型的性能条目
      this.performanceObserver.observe({
        entryTypes: ['navigation', 'render', 'script', 'memory'],
      });
    } catch (error) {
      console.warn('Failed to initialize performance observer:', error);
    }
  }

  /**
   * 处理性能条目数据
   */
  private handlePerformanceEntry(entry: any): void {
    try {
      // 确保monitor不为null
      if (!this.monitor) {
        return;
      }

      // 提取性能数据
      const { name, duration, entryType, startTime, path, moduleName } = entry;

      // 根据不同的条目类型处理数据
      switch (entryType) {
        case 'render':
          // 处理渲染相关性能数据
          if (name === 'lcp') {
            // LCP（最大内容绘制）监控
            this.reportPerformanceData(this.monitor, {
              metric: PERFORMANCE_METRIC.PAINT,
              name: PERFORMANCE_NAME.LCP,
              value: duration || Date.now() - startTime,
              unit: PERFORMANCE_UNIT.MS,
              extras: {
                path,
                moduleName,
                entryType,
              },
            });
          } else if (name === 'fcp') {
            // FCP（首次内容绘制）监控
            this.reportPerformanceData(this.monitor, {
              metric: PERFORMANCE_METRIC.PAINT,
              name: PERFORMANCE_NAME.FCP,
              value: duration || Date.now() - startTime,
              unit: PERFORMANCE_UNIT.MS,
              extras: {
                path,
                moduleName,
                entryType,
              },
            });
          } else if (name === 'cls') {
            // CLS（累计布局偏移）监控
            this.reportPerformanceData(this.monitor, {
              metric: PERFORMANCE_METRIC.PAINT,
              name: PERFORMANCE_NAME.CLS,
              value: duration || 0,
              unit: PERFORMANCE_UNIT.COUNT,
              extras: {
                path,
                moduleName,
                entryType,
              },
            });
          }
          break;

        case 'navigation':
          // 处理导航相关性能数据
          if (name === 'pageSwitch') {
            // 页面切换性能
            this.reportPerformanceData(this.monitor, {
              metric: PERFORMANCE_METRIC.NAVIGATION,
              name: PERFORMANCE_NAME.LOAD,
              value: duration,
              unit: PERFORMANCE_UNIT.MS,
              extras: {
                path,
                moduleName,
                entryType,
                event: 'pageSwitch',
              },
            });
          }
          break;

        case 'script':
          // 处理脚本执行性能数据
          if (name === 'scriptExecute' || name === 'setData') {
            // 脚本执行和setData性能监控
            this.reportPerformanceData(this.monitor, {
              metric: PERFORMANCE_METRIC.LONG_TASK,
              name: PERFORMANCE_NAME.INP,
              value: duration,
              unit: PERFORMANCE_UNIT.MS,
              extras: {
                path,
                moduleName,
                entryType,
                scriptName: name,
              },
            });
          }
          break;
      }
    } catch (error) {
      console.warn('Failed to handle performance entry:', error);
    }
  }

  /**
   * 监控页面切换性能
   */
  private monitorPageSwitch(monitor: Monitor): void {
    const originalPage = this.wx.Page;
    if (!originalPage) return;

    const self = this;

    // 重写Page方法，监控页面生命周期
    this.wx.Page = function (pageOptions: any) {
      const originalOnLoad = pageOptions.onLoad;
      const originalOnShow = pageOptions.onShow;
      const originalOnReady = pageOptions.onReady;
      const originalOnUnload = pageOptions.onUnload;

      // 页面加载开始时间
      let pageLoadStartTime = 0;

      // 监听页面加载
      pageOptions.onLoad = function (...args: any[]) {
        pageLoadStartTime = Date.now();
        if (originalOnLoad) {
          originalOnLoad.apply(this, args);
        }
      };

      // 监听页面显示
      pageOptions.onShow = function (...args: any[]) {
        if (originalOnShow) {
          originalOnShow.apply(this, args);
        }
        const pagePath = this.route || this.__route__;
        self.pagePerformanceMap.set(pagePath, { startTime: Date.now() });
      };

      // 监听页面初次渲染完成
      pageOptions.onReady = function (...args: any[]) {
        if (originalOnReady) {
          originalOnReady.apply(this, args);
        }
        // 计算页面加载耗时并上报（对应LOAD指标）
        if (pageLoadStartTime > 0) {
          const pageLoadTime = Date.now() - pageLoadStartTime;
          const pagePath = this.route || this.__route__;

          self.reportPerformanceData(monitor, {
            metric: PERFORMANCE_METRIC.NAVIGATION,
            name: PERFORMANCE_NAME.LOAD,
            value: pageLoadTime,
            unit: PERFORMANCE_UNIT.MS,
            extras: {
              pagePath,
              event: 'pageLoad',
            },
          });
          pageLoadStartTime = 0;
        }
      };

      // 监听页面卸载
      pageOptions.onUnload = function (...args: any[]) {
        if (originalOnUnload) {
          originalOnUnload.apply(this, args);
        }
        const pagePath = this.route || this.__route__;
        self.handlePageUnload(monitor, pagePath);
      };

      return originalPage.call(this, pageOptions);
    };

    // 监控App生命周期
    const originalApp = this.wx.App;
    if (originalApp) {
      this.wx.App = function (appOptions: any) {
        const originalOnShow = appOptions.onShow;
        const originalOnHide = appOptions.onHide;

        // 监听App显示
        appOptions.onShow = function (...args: any[]) {
          if (originalOnShow) {
            originalOnShow.apply(this, args);
          }
          self.handleAppShow();
        };

        // 监听App隐藏
        appOptions.onHide = function (...args: any[]) {
          if (originalOnHide) {
            originalOnHide.apply(this, args);
          }
          self.handleAppHide(monitor);
        };

        return originalApp.call(this, appOptions);
      };
    }
  }

  /**
   * 监控网络请求性能
   */
  private monitorNetworkRequests(monitor: Monitor): void {
    const originalRequest = this.wx.request;
    if (!originalRequest) return;

    const self = this;

    this.wx.request = function (options: any) {
      const startTime = Date.now();
      const url = options.url || '';
      const method = (options.method || 'GET').toUpperCase();
      const originalSuccess = options.success;
      const originalFail = options.fail;

      // 重写success回调，记录请求成功耗时
      options.success = function (res: any) {
        const endTime = Date.now();
        const firstByteTime = res.header?._request_time || Date.now() - startTime; // 近似TTFB
        const downloadTime = endTime - startTime;

        // 上报TTFB（近似值）
        self.reportPerformanceData(monitor, {
          metric: PERFORMANCE_METRIC.RESOURCE,
          name: PERFORMANCE_NAME.TTFB,
          value: firstByteTime,
          unit: PERFORMANCE_UNIT.MS,
          extras: {
            url,
            method,
            status: 'success',
            statusCode: res.statusCode,
          },
        });

        // 上报DOWNLOAD
        self.reportPerformanceData(monitor, {
          metric: PERFORMANCE_METRIC.RESOURCE,
          name: PERFORMANCE_NAME.DOWNLOAD,
          value: downloadTime,
          unit: PERFORMANCE_UNIT.MS,
          extras: {
            url,
            method,
            status: 'success',
            statusCode: res.statusCode,
          },
        });

        if (originalSuccess) {
          originalSuccess.apply(this, [res]);
        }
      };

      // 重写fail回调，记录请求失败耗时
      options.fail = function (err: any) {
        const endTime = Date.now();
        const downloadTime = endTime - startTime;

        // 上报DOWNLOAD（失败情况）
        self.reportPerformanceData(monitor, {
          metric: PERFORMANCE_METRIC.RESOURCE,
          name: PERFORMANCE_NAME.DOWNLOAD,
          value: downloadTime,
          unit: PERFORMANCE_UNIT.MS,
          extras: {
            url,
            method,
            status: 'fail',
            error: JSON.stringify(err),
          },
        });

        if (originalFail) {
          originalFail.apply(this, [err]);
        }
      };

      return originalRequest.call(this, options);
    };
  }

  /**
   * 监控App启动性能
   */
  private monitorAppLaunch(monitor: Monitor): void {
    try {
      // 使用setTimeout延迟执行，确保在App.onLaunch之后
      setTimeout(() => {
        const launchOptions = this.wx.getLaunchOptionsSync ? this.wx.getLaunchOptionsSync() : {};
        const appLaunchTime = Date.now() - (launchOptions.launchTime || this.appLaunchTime);

        // 上报应用启动时间（对应LOAD指标）
        this.reportPerformanceData(monitor, {
          metric: PERFORMANCE_METRIC.NAVIGATION,
          name: PERFORMANCE_NAME.LOAD,
          value: appLaunchTime,
          unit: PERFORMANCE_UNIT.MS,
          extras: {
            scene: launchOptions.scene,
            path: launchOptions.path,
            query: launchOptions.query,
            event: 'appLaunch',
          },
        });
      }, 0);
    } catch (error) {
      console.warn('Failed to monitor app launch performance:', error);
    }
  }

  /**
   * 处理App显示
   */
  private handleAppShow(): void {
    // App显示时的处理逻辑
  }

  /**
   * 处理App隐藏
   */
  private handleAppHide(monitor: Monitor): void {
    // App隐藏时上报所有活跃页面的停留时间
    const currentPages = this.wx.getCurrentPages ? this.wx.getCurrentPages() : [];
    if (currentPages.length > 0) {
      const currentPage = currentPages[currentPages.length - 1];
      const pagePath = currentPage.route || currentPage.__route__;
      this.handlePageUnload(monitor, pagePath);
    }
  }

  /**
   * 处理页面卸载
   */
  private handlePageUnload(monitor: Monitor, pagePath: string): void {
    const pageInfo = this.pagePerformanceMap.get(pagePath);
    if (pageInfo) {
      const stayTime = Date.now() - pageInfo.startTime;
      // 上报页面停留时间（自定义指标）
      this.reportPerformanceData(monitor, {
        metric: PERFORMANCE_METRIC.NAVIGATION,
        name: PERFORMANCE_NAME.LOAD, // 使用LOAD指标记录页面停留时间
        value: stayTime,
        unit: PERFORMANCE_UNIT.MS,
        extras: {
          pagePath,
          event: 'pageStay',
        },
      });
      this.pagePerformanceMap.delete(pagePath);
    }
  }

  /**
   * 上报性能数据
   */
  private reportPerformanceData(monitor: Monitor, data: PerformanceData): void {
    try {
      // 检查是否需要过滤特定指标
      if (this.options.metrics && this.options.metrics.length > 0) {
        if (!this.options.metrics.includes(data.name)) {
          return;
        }
      }

      // 应用数据处理函数
      let processedData = data;
      if (this.options.inspector) {
        const result = this.options.inspector(data);
        if (result) {
          processedData = result;
        } else {
          // 如果处理函数返回falsy值，不上报数据
          return;
        }
      }

      // 过滤过长的URL
      if (processedData.extras?.url && typeof processedData.extras.url === 'string') {
        if (processedData.extras.url.length > 100) {
          processedData.extras.url = processedData.extras.url.substring(0, 100) + '...';
        }
      }

      monitor.report(REPORT_TYPE.PERFORMANCE, processedData);
    } catch (error) {
      console.warn('Failed to report performance data:', error);
    }
  }

  /**
   * 卸载插件
   */
  uninstall(): void {
    try {
      // 清理性能监控相关的资源
      this.pagePerformanceMap.clear();

      // 断开性能观察器连接
      if (this.performanceObserver && typeof this.performanceObserver.disconnect === 'function') {
        this.performanceObserver.disconnect();
      }

      this.performanceMonitor = null;
      this.performanceObserver = null;
      this.monitor = null;

      console.log('WeappPerformancePlugin uninstalled successfully');
    } catch (error) {
      console.error('WeappPerformancePlugin uninstall error:', error);
    }
  }
}
