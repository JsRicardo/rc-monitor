import { UserBehaviorAction, UserBehaviorReporter } from '../../types';

declare namespace WechatMiniprogram.Page {
  interface Constructor {
    (options: Record<string, any>): void;
  }
}

declare let Page: WechatMiniprogram.Page.Constructor;

export default function onEvent(action: UserBehaviorAction) {
  const Taro = (globalThis as any).__Monitor__Framework__;

  function reportData(reporter: UserBehaviorReporter, event: any) {
    const { x, y } = event?.detail || {};
    const { anchorTargetText } = event?._relatedInfo || {};
    const instance = Taro.getCurrentInstance();
    const { route, $taroPath, config } = instance?.page || {};

    reporter({
      action,
      url: route || 'unknown',
      timestamp: Date.now(),
      eventType: event?.type || 'unknown',
      element: 'unknown', // taro的点击事件没有元素
      extras: {
        x,
        y,
        targetText: anchorTargetText,
        taroPath: $taroPath,
        title: config?.navigationBarTitleText,
      },
    });
  }

  return function (reporter: UserBehaviorReporter) {
    if (!Taro) {
      console.error(
        'Taro instance not found, Make sure you are config frameworkInstance correctly.'
      );
      return () => {};
    }

    const OriginPage = Page;

    Page = function (options) {
      const OriginEventHandle = options.eh;

      options.eh = function () {
        const params = [...arguments];
        const event = params[0];

        if (event?.type === action) {
          reportData(reporter, event);
        }

        OriginEventHandle(...params);
      };

      OriginPage(options);
    };

    return () => {
      Page = OriginPage;
    };
  };
}
