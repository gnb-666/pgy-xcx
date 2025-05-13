export default {
  pages: [
    'pages/index/index',
    'pages/publish/publish',
    'pages/me/me',
    'pages/login/login',
    'pages/myInfo/myInfo',
    'pages/myPosts/myPosts',
    'pages/infoDetail/infoDetail',
    'pages/share/share'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#999",
    selectedColor: "#1296db",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/images/home.png",
        selectedIconPath: "./assets/images/home_fill.png"
      },
      {
        pagePath: "pages/publish/publish",
        text: "发布",
        iconPath: "./assets/images/publish.png",
        selectedIconPath: "./assets/images/publish_fill.png"
      },
      {
        pagePath: "pages/me/me",
        text: "我的",
        iconPath: "./assets/images/me.png",
        selectedIconPath: "./assets/images/me_fill.png"
      }
    ]
  }
}
