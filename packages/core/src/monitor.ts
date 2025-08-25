/**
 * 监控SDK核心类
 * 负责数据收集、处理、上报和插件管理
 */

import { DataQueue } from './data-queue';
import { DefaultPluginManager } from './plugin-manager';
import { FetchReportService } from './report-service';
import { MonitorConfig, Plugin, ReportData, ReportType } from './types';
import { createLogger } from './utils';

export class Monitor {
  /** 配置信息 */
  private config: MonitorConfig;
  /** 插件管理器 */
  private pluginManager: DefaultPluginManager;
  /** 数据上报服务 */
  private reportService: FetchReportService;
  /** 数据缓存队列 */
  private dataQueue: DataQueue<ReportData>;
  /** 上报定时器 */
  private reportTimer: NodeJS.Timeout | null = null;
  /** 是否已初始化 */
  private initialized: boolean = false;
  /** 单例实例 */
  private static instance: Monitor | null = null;
  /** 单例配置 */
  private static instanceConfig: MonitorConfig | null = null;
  /** 日志记录器 */
  private log: (message: string, data?: any) => void;

  /**
   * 创建监控实例
   * @param config 监控配置
   */
  private constructor(config: MonitorConfig) {
    this.config = {
      reportInterval: 5000,
      maxCacheSize: 1000,
      debug: false,
      ...config,
    };

    this.pluginManager = new DefaultPluginManager();
    this.reportService = new FetchReportService(this.config.endpoint, this.config.appId);
    this.dataQueue = new DataQueue<ReportData>(this.config.maxCacheSize);
    this.log = createLogger(this.config.debug ?? false, 'Monitor');

    this.init();
  }

  /**
   * 初始化监控SDK
   * 启动数据上报定时器
   */
  private init(): void {
    if (this.initialized) {
      this.log('Monitor already initialized');
      return;
    }

    this.startReportTimer();
    this.initialized = true;
    this.log('Monitor initialized successfully');
  }

  /**
   * 销毁监控实例
   * 清理定时器和缓存数据
   */
  public destroy(): void {
    Monitor.instance = null;
    Monitor.instanceConfig = null;
    this.stopReportTimer();
    this.dataQueue.flush();
    this.pluginManager.unuseAllPlugin();
    this.initialized = false;
    this.log('Monitor destroyed');
  }

  /**
   * 上报数据
   * @param type 数据类型
   * @param data 数据内容
   */
  public report(type: ReportType, data: any): void {
    this.log('上报数据', type);

    if (!this.initialized) {
      this.log('Monitor not initialized, please call init() first');
      return;
    }

    const formattedData = this.config.dataFormatter?.(type, data) || data;

    const reportData: ReportData = {
      type,
      data: formattedData,
      timestamp: Date.now(),
      appId: this.config.appId,
    };

    // 削峰限流：检查缓存队列是否已满
    if (this.dataQueue.isFull) {
      this.log('Data queue is full, dropping oldest data');
    }

    this.dataQueue.enqueue(reportData);
    this.log(`Data reported: ${type}`, data);

    // 如果缓存数据达到一定数量，立即上报
    if (this.dataQueue.length >= this.config.maxCacheSize! / 2) {
      this.flush();
    }
  }

  /**
   * 立即上报所有缓存数据
   */
  public flush(): void {
    if (this.dataQueue.isEmpty) {
      return;
    }

    const dataToReport = this.dataQueue.flush();

    this.reportService.sendData(dataToReport).catch(error => {
      this.log('Data report failed, re-queuing data', error);
      // 上报失败，重新加入队列
      dataToReport.forEach(data => this.dataQueue.enqueue(data));
    });
  }

  /**
   * 安装插件
   * @param plugin 插件实例
   */
  public use(plugin: Plugin): void {
    try {
      this.pluginManager.use(plugin);
      plugin.install(this);
      this.log(`Plugin ${plugin.name} installed successfully`);
    } catch (error) {
      this.log(`Failed to install plugin ${plugin.name}`, error);
    }
  }

  /**
   * 卸载插件
   * @param pluginName 插件名称
   */
  public unuse(pluginName: string): void {
    try {
      this.pluginManager.unuse(pluginName);
      this.log(`Plugin ${pluginName} uninstalled successfully`);
    } catch (error) {
      this.log(`Failed to uninstall plugin ${pluginName}`, error);
    }
  }

  /**
   * 卸载所有插件
   */
  public unuseAllPlugin(): void {
    this.pluginManager.unuseAllPlugin();
    this.log('All plugins uninstalled');
  }

  /**
   * 启动数据上报定时器
   */
  private startReportTimer(): void {
    if (this.reportTimer) {
      this.stopReportTimer();
    }

    this.reportTimer = setInterval(() => {
      this.flush();
    }, this.config.reportInterval!);

    this.log(`Report timer started with interval: ${this.config.reportInterval}ms`);
  }

  /**
   * 停止数据上报定时器
   */
  private stopReportTimer(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
      this.log('Report timer stopped');
    }
  }

  /**
   * 获取或创建监控实例（单例模式）
   * @param config 监控配置
   * @returns 监控实例
   */
  static getMonitor(config: MonitorConfig): Monitor {
    // 如果实例不存在或者配置不同，创建新实例
    if (!Monitor.instance || !this.isSameConfig(Monitor.instanceConfig, config)) {
      Monitor.instance = new Monitor(config);
      Monitor.instanceConfig = config;
    }
    return Monitor.instance;
  }

  /**
   * 比较两个配置是否相同
   * @param config1 配置1
   * @param config2 配置2
   * @returns 是否相同
   */
  private static isSameConfig(config1: MonitorConfig | null, config2: MonitorConfig): boolean {
    if (!config1 || !config2) return false;

    return (
      config1.endpoint === config2.endpoint &&
      config1.appId === config2.appId &&
      config1.reportInterval === config2.reportInterval &&
      config1.maxCacheSize === config2.maxCacheSize &&
      config1.debug === config2.debug
    );
  }
}
