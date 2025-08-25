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
