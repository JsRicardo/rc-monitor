import { USER_BEHAVIOR_ACTION } from '../../constant';
import { UserBehaviorReporter } from '../../types';

type PreviousPageInfo = {
  path: string;
  data: any;
  options: any;
  timestamp?: number;
};

enum RouterFn {
  navigateTo = 'navigateTo',
  redirectTo = 'redirectTo',
  reLaunch = 'reLaunch',
  switchTab = 'switchTab',
  navigateBack = 'navigateBack',
}

// 获取当前页面信息
function getCurrentPageInfo() {
  const Taro = (global as any).__Monitor__Framework__;
  try {
    const pages = Taro.getCurrentPages?.() || [];
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return {
        route: currentPage.route || '',
        data: currentPage.data || {},
        options: currentPage.options || {},
      };
    }
  } catch (error) {
    console.error('Error getting current page info:', error);
  }
  return { route: '', data: {}, options: {} };
}

function getChangType(methodName: string) {
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
    default:
      changeType = 'unknown';
  }

  return changeType;
}

// 存储上一个页面信息
let previousPage: PreviousPageInfo;

// 通用的路由处理函数
function handleRouteChange(reporter: UserBehaviorReporter, methodName: string, options: any) {
  const Taro = (global as any).__Monitor__Framework__;

  try {
    // 获取系统信息
    let systemInfo = Taro.getSystemInfoSync?.() || {};
    // 获取当前页面信息
    const fromPageInfo = getCurrentPageInfo();
    let changeType = getChangType(methodName);

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
        pageStackLength: (Taro.getCurrentPages?.() || []).length,
        platform: systemInfo.platform || '',
        previousPage: previousPage,
      },
    };
    // 更新上一个页面信息
    previousPage = {
      path: fromPageInfo.route,
      timestamp: Date.now(),
      data: fromPageInfo.data,
      options: fromPageInfo.options,
    };

    reporter(reportData);
  } catch (error) {
    console.error('Error in page change tracking:', error);
  }
}

export default function onPageChange(reporter: UserBehaviorReporter) {
  const Taro = (global as any).__Monitor__Framework__;
  if (!Taro) {
    console.error('Taro instance not found, Make sure you are config frameworkInstance correctly.');
    return () => {};
  }

  const routerFnArr = [
    RouterFn.navigateTo,
    RouterFn.redirectTo,
    RouterFn.reLaunch,
    RouterFn.switchTab,
    RouterFn.navigateBack,
  ];

  const originalFnMap = {
    [RouterFn.navigateTo]: Taro.navigateTo,
    [RouterFn.redirectTo]: Taro.redirectTo,
    [RouterFn.reLaunch]: Taro.reLaunch,
    [RouterFn.switchTab]: Taro.switchTab,
    [RouterFn.navigateBack]: Taro.navigateBack,
  };

  // 重写路由方法
  routerFnArr.forEach(fn => {
    if (typeof Taro[fn] === 'function') {
      Taro[fn] = (options: any) => {
        handleRouteChange(reporter, fn, options);
        return originalFnMap[fn].call(Taro, options);
      };
    }
  });

  // 返回清理函数，恢复原始方法
  return () => {
    routerFnArr.forEach(fn => {
      Taro[fn] = originalFnMap[fn];
    });
  };
}
