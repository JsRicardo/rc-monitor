import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES, USER_BEHAVIOR_ACTION } from '../../constant';
import { BehaviorPluginOption } from '../../types';

import onPageChange from './onPageChange';
import onPV from './onPV';

export class TaroBehaviorPlugin extends BasePlugin<BehaviorPluginOption> {
  public name = PLUGIN_NAMES.TARO_BEHAVIOR;

  protected reportType = REPORT_TYPE.USER_BEHAVIOR;

  protected readonly observerMap = new Map([
    [USER_BEHAVIOR_ACTION.PV, onPV],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
  ]);
}
