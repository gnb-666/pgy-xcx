import Taro, { useLaunch } from "@tarojs/taro";

import "./app.less";

function App({ children }) {
  useLaunch(() => {
    console.log("App launched.");
    console.log("当前环境:", Taro);

    // 确保 Taro 对象已加载
    if (Taro) {
      console.log("Taro 对象:", Taro);
      const isLoggedIn = Taro.getStorageSync("isLoggedIn");
      if (!isLoggedIn) {
        console.log("用户未登录，准备跳转到登录页面");
        Taro.redirectTo({
          url: "/pages/login/login",
          success: () => {
            console.log("成功跳转到登录页面");
          },
          fail: (err) => {
            console.error("跳转失败:", err);
          }
        });
      } else {
        Taro.switchTab({
          url: "/pages/index/index",
        });
      }
    } else {
      console.error("Taro 对象未加载，请检查环境配置。");
    }
  });

  return children; // 渲染子组件
}

export default App;
