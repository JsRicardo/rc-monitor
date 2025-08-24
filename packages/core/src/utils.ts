/**
 * 工具函数
 * 包含日志记录和其他辅助功能
 */

/**
 * 调试日志记录器
 * @param debug 是否启用调试模式
 * @param prefix 日志前缀
 */
export function createLogger(debug: boolean, prefix: string = 'Monitor') {
  return (message: string, data?: any) => {
    if (debug) {
      console.log(`[${prefix}] ${message}`, data || '');
    }
  };
}

/**
 * 数据队列管理器
 * 负责数据的缓存和削峰限流
 */
export class DataQueue<T> {
  /** 数据队列 */
  private queue: T[] = [];
  /** 最大队列长度 */
  private maxSize: number;

  /**
   * 创建数据队列
   * @param maxSize 最大队列长度
   */
  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * 添加数据到队列
   * @param item 数据项
   * @returns 是否添加成功（如果队列已满则移除最旧数据）
   */
  enqueue(item: T): boolean {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // 移除最旧的数据
    }
    
    this.queue.push(item);
    return true;
  }

  /**
   * 获取并清空队列
   */
  flush(): T[] {
    const items = [...this.queue];
    this.queue = [];
    return items;
  }

  /**
   * 获取队列长度
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * 检查队列是否为空
   */
  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * 检查队列是否已满
   */
  get isFull(): boolean {
    return this.queue.length >= this.maxSize;
  }
}