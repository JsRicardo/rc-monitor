import { REPORT_TYPE, type Monitor } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, type JsErrorData } from '@rc-monitor/utils';
import React from 'react';

/**
 * React错误边界组件属性接口
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * React错误边界组件状态接口
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * React错误适配器
 * 提供错误边界组件，用于捕获React组件树中的JavaScript错误
 * @param monitor 监控实例
 * @param inspector 可选的数据检查器函数，用于处理错误数据
 * @returns React错误边界组件类
 */
export default function reactAdapter(monitor: Monitor, inspector?: <T>(data: JsErrorData) => T) {
  /**
   * React错误边界组件
   * 用于捕获React组件树中的JavaScript错误并进行上报
   */
  class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = {
        hasError: false,
      };
    }

    /**
     * 静态方法，用于捕获子组件树中的JavaScript错误
     * @param error 错误对象
     * @param errorInfo 错误信息
     * @returns 更新后的状态
     */
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      // 更新状态，使下一次渲染显示降级UI
      return {
        hasError: true,
        error,
      };
    }

    /**
     * 组件生命周期方法，在捕获错误后调用
     * @param error 错误对象
     * @param errorInfo 错误信息
     */
    componentDidCatch(error: Error) {
      // 创建错误数据并上报
      const errData = createJsErrorData(error, REPORT_TYPE.JS_ERROR);
      // 生成错误UUID
      const uuid = createErrorUuid(errData);
      // 应用数据检查器（如果提供）
      const res = inspector?.(errData) || errData;
      // 上报错误
      monitor.report(REPORT_TYPE.REACT_ERROR, res, uuid);
    }

    /**
     * 渲染组件
     */
    render() {
      // 如果有错误，显示降级UI
      if (this.state.hasError) {
        return (
          this.props.fallback ||
          React.createElement(
            'div',
            null,
            React.createElement('h1', null, '发生了错误'),
            React.createElement('p', null, '我们正在努力修复这个问题。')
          )
        );
      }

      // 正常渲染子组件
      return this.props.children;
    }
  }

  /**
   * 注入monitor到React组件的高阶组件
   * @param Component 原始React组件
   * @returns 注入了monitor的新组件
   */
  function withMonitor<T extends React.ComponentType<any>>(Component: T): T {
    const WithMonitor = (props: React.ComponentProps<T>) => {
      return React.createElement(Component, { ...props, monitor });
    };

    WithMonitor.displayName = `WithMonitor(${Component.displayName || Component.name || 'Component'})`;
    return WithMonitor as T;
  }

  return {
    // 错误边界组件
    ErrorBoundary,
    // 高阶组件
    withMonitor,
  };
}
