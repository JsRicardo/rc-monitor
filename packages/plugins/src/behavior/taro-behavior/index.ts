import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES, USER_BEHAVIOR_ACTION } from '../../constant';
import { BehaviorObserverMap, BehaviorPluginOption, UserBehaviorAction } from '../../types';

import onEvent from './onEvent';
import onPageChange from './onPageChange';
import onPV from './onPV';

type TaroBehaviorPluginOptions = Pick<BehaviorPluginOption, 'inspector'> & {
  metrics?: {
    pv: boolean;
    pageChange: boolean;
    userAction: Omit<UserBehaviorAction, 'pv' | 'pageChange'>[]; // userAction包含的事件类型 'click’, 'input', 'tap', 'change'
  };
};

function formatMetric(
  metric?: TaroBehaviorPluginOptions['metrics']
): UserBehaviorAction[] | undefined {
  let res = [] as UserBehaviorAction[];
  if (!metric) return undefined;
  const { pv, pageChange, userAction } = metric;

  pv && res.push(USER_BEHAVIOR_ACTION.PV);
  pageChange && res.push(USER_BEHAVIOR_ACTION.PAGE_CHANGE);

  userAction && res.concat(userAction as UserBehaviorAction[]);

  return res;
}

export class TaroBehaviorPlugin extends BasePlugin<BehaviorPluginOption> {
  public name = PLUGIN_NAMES.TARO_BEHAVIOR;

  protected reportType = REPORT_TYPE.USER_BEHAVIOR;

  protected observerMap: BehaviorObserverMap = new Map([
    [USER_BEHAVIOR_ACTION.PV, onPV],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
  ]);

  constructor(options?: TaroBehaviorPluginOptions) {
    const { metrics, inspector } = options || {};
    const formatMetrics = formatMetric(metrics);
    super({ metrics: formatMetrics, inspector });

    const { userAction } = metrics || {};
    if (userAction?.length) {
      (userAction as UserBehaviorAction[]).forEach(action => {
        const handler = onEvent(action);
        this.observerMap.set(action, handler);
      });
    }
  }
}
