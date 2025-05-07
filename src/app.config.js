export default {
  pages: [
    "pages/login/login",
    "pages/index/index",
    "pages/publish/publish",
    "pages/me/me",
    "pages/myPosts/myPosts",
    "pages/myInfo/myInfo" // 添加新页面
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "旅游日记",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/images/home.png",
        selectedIconPath: "assets/images/home.png",
      },
      {
        pagePath: "pages/publish/publish",
        text: "发布",
        iconPath: "assets/images/publish.png",
        selectedIconPath: "assets/images/publish.png",
      },
      {
        pagePath: "pages/me/me",
        text: "我的",
        iconPath: "assets/images/me.png",
        selectedIconPath: "assets/images/me.png",
      },
    ],
  },
};
