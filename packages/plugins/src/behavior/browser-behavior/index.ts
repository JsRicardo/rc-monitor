import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { USER_BEHAVIOR_ACTION, PLUGIN_NAMES } from '../../constant';

import onClick from './onClick';
import onInput from './onInput';
import onPageChange from './onPageChange';
import onPV from './onPV';
import onScroll from './onScroll';

import type { BehaviorPluginOption, UserBehaviorAction, UserBehaviorReporter } from '../../types';

export class BrowserBehaviorPlugin extends BasePlugin<BehaviorPluginOption> {
  name = PLUGIN_NAMES.BROWSER_BEHAVIOR;

  protected reportType = REPORT_TYPE.USER_BEHAVIOR;

  protected readonly observerMap = new Map<
    UserBehaviorAction,
    (reporter: UserBehaviorReporter) => () => void
  >([
    [USER_BEHAVIOR_ACTION.CLICK, onClick],
    [USER_BEHAVIOR_ACTION.INPUT, onInput],
    [USER_BEHAVIOR_ACTION.SCROLL, onScroll],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
    [USER_BEHAVIOR_ACTION.PV, onPV],
  ]);
}
