import getPlatform, { PLATFORM_TYPES } from './getPlatform';

/**
 * 发送器通用配置接口
 */
export interface SenderOptions {
  timeout?: number;
  headers?: Record<string, string>;
  [key: string]: any;
}

/**
 * 异步执行发送函数
 * @param sender 要执行的发送函数
 * @param options 执行选项
 */
function asyncSend(sender: () => void, options: { timeout?: number } = {}): void {
  try {
    const timeout = options.timeout || 3000;

    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(
          () => {
            sender();
          },
          { timeout }
        );
      } else {
        setTimeout(() => {
          sender();
        }, 0);
      }
    } else {
      // 非浏览器环境直接执行
      sender();
    }
  } catch (error) {
    console.error('Async sender error:', error);
  }
}

/**
 * 使用Image标签发送数据（适合简单的GET请求）
 * @param url 上报地址
 * @param data 上报数据
 * @param options 发送选项
 */
export function imageSender(
  url: string,
  data: Record<string, any>,
  options: SenderOptions = {}
): void {
  try {
    if (typeof window === 'undefined') {
      console.warn('Image sender is only available in browser environment');
      return;
    }

    // 构建URL
    const queryParams = new URLSearchParams();
    queryParams.append('data', encodeURIComponent(JSON.stringify(data)));

    // 添加自定义参数
    Object.entries(options).forEach(([key, value]) => {
      if (key !== 'headers' && key !== 'timeout') {
        queryParams.append(key, String(value));
      }
    });

    const fullUrl = `${url}?${queryParams.toString()}`;

    // 创建并发送图片请求
    const img = new Image();
    img.src = fullUrl;
    img.style.display = 'none';
    img.onload = img.onerror = function () {
      // 清理DOM元素
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };

    // 可选：添加到DOM以确保请求发送
    if (document.body) {
      document.body.appendChild(img);
    }
  } catch (error) {
    console.error('Image sender error:', error);
  }
}

/**
 * 使用fetch API发送数据
 * @param url 上报地址
 * @param data 上报数据
 * @param options 发送选项
 */
export function fetchSender(
  url: string,
  data: Record<string, any>,
  options: SenderOptions = {}
): void {
  asyncSend(
    () => {
      try {
        if (typeof fetch === 'undefined') {
          console.warn('Fetch API is not available, falling back to other methods');
          // 降级到XHR
          xhrSendFn(url, data, options);
          return;
        }

        const fetchOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
        };

        fetch(url, fetchOptions).catch(error => {
          console.error('Fetch request error:', error);
        });
      } catch (error) {
        console.error('Fetch sender error:', error);
      }
    },
    { timeout: options.timeout }
  );
}

/**
 * 使用navigator.sendBeacon发送数据（适合页面卸载时的上报）
 * @param url 上报地址
 * @param data 上报数据
 * @param options 发送选项
 */
export function sendBeaconSender(
  url: string,
  data: Record<string, any>,
  options: SenderOptions = {}
): void {
  try {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      !navigator.sendBeacon
    ) {
      console.warn('sendBeacon is not available, falling back to fetch');
      // 降级到fetch
      fetchSender(url, data, options);
      return;
    }

    // sendBeacon不支持自定义headers，所以这里只传数据
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });

    const result = navigator.sendBeacon(url, blob);
    if (!result) {
      console.warn('sendBeacon failed, falling back to fetch');
      fetchSender(url, data, options);
    }
  } catch (error) {
    console.error('sendBeacon sender error:', error);
    // 发生错误时降级到fetch
    fetchSender(url, data, options);
  }
}

/**
 * 使用XMLHttpRequest发送数据
 * @param url 上报地址
 * @param data 上报数据
 * @param options 发送选项
 */
function xhrSendFn(url: string, data: Record<string, any>, options: SenderOptions = {}): void {
  try {
    if (typeof XMLHttpRequest === 'undefined') {
      console.warn('XMLHttpRequest is not available');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    // 设置请求头
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // 设置超时
    if (options.timeout) {
      xhr.timeout = options.timeout;
    }

    // 发送请求
    xhr.send(JSON.stringify(data));
  } catch (error) {
    console.error('XHR sender error:', error);
  }
}

function wxSendFn(url: string, data: Record<string, any>, options: SenderOptions = {}) {
  (global as any).wx
    .request({
      url,
      data,
      method: 'POST',
      ...options,
      header: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    .catch((error: Error) => {
      console.error('WX request error:', error);
    });
}

function taroSendFn(url: string, data: Record<string, any>, options: SenderOptions = {}) {
  (global as any).__Monitor__Framework__
    ?.request({
      url,
      data,
      method: 'POST',
      ...options,
      header: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    .catch((error: Error) => {
      console.error('Taro request error:', error);
    });
}

function uniSendFn(url: string, data: Record<string, any>, options: SenderOptions = {}) {
  (global as any).uni
    .request({
      url,
      data,
      method: 'POST',
      ...options,
      header: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    .catch((error: Error) => {
      console.error('Uni request error:', error);
    });
}

/**
 * 根据平台选择合适的XHR发送方式
 * @param url 上报地址
 * @param data 上报数据
 * @param options 发送选项
 */
export function xhrSender(
  url: string,
  data: Record<string, any>,
  options: SenderOptions = {}
): void {
  const platform = getPlatform();

  try {
    switch (platform) {
      case PLATFORM_TYPES.BROWSER:
        xhrSendFn(url, data, options);
        break;
      case PLATFORM_TYPES.WEAPP:
        wxSendFn(url, data, options);
        break;
      case PLATFORM_TYPES.TARO:
        taroSendFn(url, data, options);
        break;
      case PLATFORM_TYPES.UNI:
        uniSendFn(url, data, options);
        break;
      default:
        xhrSendFn(url, data, options);
    }
  } catch (error) {
    console.error('Platform-specific sender error:', error);
  }
}
