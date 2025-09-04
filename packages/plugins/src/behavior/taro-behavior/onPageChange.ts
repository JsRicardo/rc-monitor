import Taro from '@tarojs/taro';

import { USER_BEHAVIOR_ACTION } from '../../constant';
import { UserBehaviorReporter } from '../../types';

export default function onPageChange(reporter: UserBehaviorReporter) {
  // 存储原始路由方法
  const originalNavigateTo = Taro.navigateTo;
  const originalRedirectTo = Taro.redirectTo;
  const originalReLaunch = Taro.reLaunch;
  const originalSwitchTab = Taro.switchTab;
  const originalNavigateBack = Taro.navigateBack;

  // 存储上一个页面信息
  let previousPage: any = null;

  // 获取当前页面信息
  const getCurrentPageInfo = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return {
        route: currentPage.route || '',
        data: currentPage.data || {},
        options: currentPage.options || {},
      };
    }
    return { route: '', data: {}, options: {} };
  };

  // 通用的路由处理函数
  const handleRouteChange = (methodName: string, options: any) => {
    try {
      // 获取系统信息
      const systemInfo = Taro.getSystemInfoSync();
      // 获取当前页面信息
      const fromPageInfo = getCurrentPageInfo();

      // 根据方法名确定页面切换类型
      let changeType = 'unknown';
      switch (methodName) {
        case 'navigateTo':
          changeType = 'push';
          break;
        case 'redirectTo':
        case 'switchTab':
          changeType = 'replace';
          break;
        case 'reLaunch':
          changeType = 'relaunch';
          break;
        case 'navigateBack':
          changeType = 'pop';
          break;
      }

      // 构建上报数据
      const reportData = {
        action: USER_BEHAVIOR_ACTION.PAGE_CHANGE,
        url: options.url || '',
        timestamp: Date.now(),
        eventType: changeType,
        element: 'router',
        extras: {
          fromPath: fromPageInfo.route,
          toPath: options.url || '',
          method: methodName,
          changeType,
          params: options.query || {},
          pageStackLength: Taro.getCurrentPages().length,
          platform: systemInfo.platform || '',
          previousPage: previousPage,
          // 可以添加更多路由相关信息
        },
      };

      // 上报数据
      reporter(reportData);

      // 更新上一个页面信息
      previousPage = {
        path: fromPageInfo.route,
        timestamp: Date.now(),
        pageName: fromPageInfo.route,
        data: fromPageInfo.data,
      };
    } catch (error) {
      console.error('Error in page change tracking:', error);
    }
  };

  // 重写路由方法
  Taro.navigateTo = options => {
    handleRouteChange('navigateTo', options);
    return originalNavigateTo.call(Taro, options);
  };

  Taro.redirectTo = options => {
    handleRouteChange('redirectTo', options);
    return originalRedirectTo.call(Taro, options);
  };

  Taro.reLaunch = options => {
    handleRouteChange('reLaunch', options);
    return originalReLaunch.call(Taro, options);
  };

  Taro.switchTab = options => {
    handleRouteChange('switchTab', options);
    return originalSwitchTab.call(Taro, options);
  };

  Taro.navigateBack = options => {
    handleRouteChange('navigateBack', options || {});
    return originalNavigateBack.call(Taro, options);
  };

  // 返回清理函数，恢复原始方法
  return () => {
    Taro.navigateTo = originalNavigateTo;
    Taro.redirectTo = originalRedirectTo;
    Taro.reLaunch = originalReLaunch;
    Taro.switchTab = originalSwitchTab;
    Taro.navigateBack = originalNavigateBack;
  };
}
