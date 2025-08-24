import { Monitor } from '../src/monitor';
import { MonitorConfig } from '../src/types';

describe('Monitor', () => {
  const mockConfig: MonitorConfig = {
    endpoint: 'https://example.com/api/report',
    appId: 'test-app',
    reportInterval: 1000,
    maxCacheSize: 100,
    debug: true,
  };

  beforeEach(() => {
    // 在每个测试前清理单例实例
    const monitor = Monitor.getMonitor(mockConfig);
    monitor.destroy();
  });

  describe('Singleton Pattern', () => {
    test('should return the same instance for same config', () => {
      const instance1 = Monitor.getMonitor(mockConfig);
      const instance2 = Monitor.getMonitor(mockConfig);

      expect(instance1).toBe(instance2);
    });

    test('should return new instance after destroy', () => {
      const instance1 = Monitor.getMonitor(mockConfig);
      instance1.destroy();

      const instance2 = Monitor.getMonitor(mockConfig);
      expect(instance1).not.toBe(instance2);
    });

    test('should return different instances for different configs', () => {
      const instance1 = Monitor.getMonitor(mockConfig);
      const instance2 = Monitor.getMonitor({ ...mockConfig, appId: 'different-app' });

      // 配置不同应该返回不同实例
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Initialization', () => {
    test('should initialize successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      expect(() => {
        monitor.init();
      }).not.toThrow();
    });

    test('should not initialize multiple times', () => {
      const monitor = Monitor.getMonitor(mockConfig);
      monitor.init();

      // 第二次初始化应该不会报错
      expect(() => {
        monitor.init();
      }).not.toThrow();
    });
  });

  describe('Data Reporting', () => {
    test('should report data successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);
      monitor.init();

      expect(() => {
        monitor.report('error', { message: 'test error' });
      }).not.toThrow();
    });

    test('should not report data when not initialized', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      expect(() => {
        monitor.report('error', { message: 'test error' });
      }).not.toThrow();
    });
  });

  describe('Plugin Management', () => {
    test('should use plugin successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      const mockPlugin = {
        name: 'test-plugin',
        install: jest.fn(),
      };

      expect(() => {
        monitor.use(mockPlugin);
      }).not.toThrow();

      expect(mockPlugin.install).toHaveBeenCalledWith(monitor);
    });

    test('should unuse plugin successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      const mockPlugin = {
        name: 'test-plugin',
        install: jest.fn(),
      };

      monitor.use(mockPlugin);

      expect(() => {
        monitor.unuse('test-plugin');
      }).not.toThrow();
    });

    test('should unuse all plugins successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      expect(() => {
        monitor.unuseAllPlugin();
      }).not.toThrow();
    });
  });

  describe('Destruction', () => {
    test('should destroy successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);
      monitor.init();

      expect(() => {
        monitor.destroy();
      }).not.toThrow();
    });

    test('should destroy multiple times without error', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      expect(() => {
        monitor.destroy();
        monitor.destroy();
      }).not.toThrow();
    });
  });

  describe('Flush Operation', () => {
    test('should flush data successfully', () => {
      const monitor = Monitor.getMonitor(mockConfig);
      monitor.init();

      expect(() => {
        monitor.flush();
      }).not.toThrow();
    });

    test('should flush when queue is empty', () => {
      const monitor = Monitor.getMonitor(mockConfig);

      expect(() => {
        monitor.flush();
      }).not.toThrow();
    });
  });
});
