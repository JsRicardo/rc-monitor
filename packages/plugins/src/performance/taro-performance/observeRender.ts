import { PERFORMANCE_NAME, PERFORMANCE_METRIC, PERFORMANCE_UNIT } from '../../constant';
import { PerformanceName, PerformanceReporter } from '../../types';

interface IEntry {
  duration: number;
  entryType: 'render';
  initDataRecvTime: number;
  initDataSendTime: number;
  name: string;
  pageId: number;
  path: string;
  startTime: number;
  viewLayerReadyTime: number;
  viewLayerRenderEndTime: number;
  viewLayerRenderStartTime: number;
}

const NAME_2_PERFORMANCE_NAME: Record<string, PerformanceName> = {
  firstRender: PERFORMANCE_NAME.INP,
  firstPaint: PERFORMANCE_NAME.FP,
  firstContentfulPaint: PERFORMANCE_NAME.FCP,
  largestContentfulPaint: PERFORMANCE_NAME.LCP,
};

export default function observeEntries(reporter: PerformanceReporter) {
  const Taro = (globalThis as any).__Monitor_Framework__;
  try {
    Taro.getPerformance()
      .createObserver(function (entryList: any) {
        entryList.getEntries().forEach((entry: IEntry) => {
          const { duration, name } = entry;

          reporter({
            name: NAME_2_PERFORMANCE_NAME[name] || 'unknown',
            metric: PERFORMANCE_METRIC.PAINT,
            value: duration,
            unit: PERFORMANCE_UNIT.MS,
            extras: entry,
          });
        });
      })
      .observe({
        entryTypes: ['render'],
      });
  } catch (error) {
    console.error('observeRender error', error);
  }
}
