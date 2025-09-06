import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Monitor, ReactAdapter } from '@rc-monitor/rc-monitor';
import {
  BrowserErrorPlugin,
  BrowserBehaviorPlugin,
  BrowserPerformancePlugin,
} from '@rc-monitor/plugins';
import React from 'react';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000/api/error',
  reporterType: 'xhr',
});

monitor.use(new BrowserErrorPlugin());
monitor.use(new BrowserBehaviorPlugin());
monitor.use(new BrowserPerformancePlugin());

const { ErrorBoundary } = ReactAdapter(monitor);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    // @ts-ignore
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
