/**
 * 插件管理器
 * 负责插件的安装、卸载和管理
 */

import { Plugin, PluginManager } from './types';

export class DefaultPluginManager implements PluginManager {
  /** 插件映射表 */
  private plugins: Map<string, Plugin> = new Map();

  /**
   * 安装插件
   * @param plugin 插件实例
   */
  use(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already installed`);
    }

    this.plugins.set(plugin.name, plugin);
  }

  /**
   * 卸载插件
   * @param pluginName 插件名称
   */
  unuse(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    if (plugin.uninstall) {
      plugin.uninstall();
    }

    this.plugins.delete(pluginName);
  }

  /**
   * 卸载所有插件
   */
  unuseAllPlugin(): void {
    for (const [name, plugin] of this.plugins) {
      if (plugin.uninstall) {
        plugin.uninstall();
      }
    }
    this.plugins.clear();
  }

  /**
   * 获取所有插件
   */
  getPlugins(): Map<string, Plugin> {
    return new Map(this.plugins);
  }

  /**
   * 检查插件是否存在
   * @param pluginName 插件名称
   */
  hasPlugin(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }
}
