import { PLUGIN_NAMES, USER_BEHAVIOR_ACTION } from '../../constant';
import { BehaviorObserverMap, BehaviorPluginOption } from '../../types';
import { BaseBehaviorPlugin } from '../BasePlugin';

import onPageChange from './onPageChange';
import onPV from './onPV';

export class TaroBehaviorPlugin extends BaseBehaviorPlugin {
  public name = PLUGIN_NAMES.TARO_BEHAVIOR;

  protected readonly observerMap = new Map([
    [USER_BEHAVIOR_ACTION.PV, onPV],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
  ]) as BehaviorObserverMap;

  constructor(options?: BehaviorPluginOption) {
    super(options);
  }
}
