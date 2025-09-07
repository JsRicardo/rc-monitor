// app.ts

let OriginApp = App;
let OriginComp = Component;

App = function (options) {
  console.log('APP Log', options);
  OriginApp(options);
};

// Component = function (options) {
//   console.log('Component Log', options)
//   originComp(options)
// }

wx.getPerformance()
  .createObserver(function (entryList) {
    entryList.getEntries().forEach((entry: any) => {
      console.log(entry);
    });
  })
  .observe({ entryTypes: ['script', 'render', 'navigation'] });

App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
});
