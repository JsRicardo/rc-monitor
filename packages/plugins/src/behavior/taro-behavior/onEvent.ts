import { debounce } from 'lodash-es';

import { FRAMEWORK_USER_BEHAVIOR_ACTION } from '../../constant';

import type { FrameworkUserAction, UserBehaviorAction, UserBehaviorReporter } from '../../types';

declare namespace WechatMiniprogram.Page {
  interface Constructor {
    (options: Record<string, any>): void;
  }
}

declare let Page: WechatMiniprogram.Page.Constructor;

export default function onEvent(actions?: FrameworkUserAction[]) {
  const Taro = (globalThis as any).__Monitor__Framework__;

  const defaultActions = actions || Object.values(FRAMEWORK_USER_BEHAVIOR_ACTION);

  function reportData(reporter: UserBehaviorReporter, event: any, action?: FrameworkUserAction) {
    const { x, y } = event?.detail || {};
    const { anchorTargetText } = event?._relatedInfo || {};
    const instance = Taro.getCurrentInstance();
    const { route, $taroPath, config } = instance?.page || {};

    reporter({
      action: action as UserBehaviorAction,
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

        if (defaultActions.includes(event?.type as FrameworkUserAction)) {
          if (event?.type === FRAMEWORK_USER_BEHAVIOR_ACTION.INPUT) {
            debounce(() => {
              reportData(reporter, event, event?.type);
            }, 300);
          } else {
            reportData(reporter, event, event?.type);
          }
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
