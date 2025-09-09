import { REPORT_TYPE } from '@rc-monitor/core';

import { PLUGIN_NAMES, USER_BEHAVIOR_ACTION } from '../../constant';
import FrameBehaviorBasePlugin from '../FrameBehaviorBasePlugin';

import onEvent from './onEvent';
import onPageChange from './onPageChange';
import onPV from './onPV';

import type { FrameworkBehaviorPluginOptions } from '../../types';
export class TaroBehaviorPlugin extends FrameBehaviorBasePlugin {
  public name = PLUGIN_NAMES.TARO_BEHAVIOR;

  protected reportType = REPORT_TYPE.USER_BEHAVIOR;

  protected observerMap: any = new Map([
    [USER_BEHAVIOR_ACTION.PV, onPV],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
  ]);

  constructor(options?: FrameworkBehaviorPluginOptions) {
    super(options);

    const eventHandler = onEvent(options?.metrics?.userAction);
    this.observerMap.set('userAction', eventHandler);
  }
}
