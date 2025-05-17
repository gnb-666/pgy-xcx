export default {
  pages: [
    'pages/index/index',
    'pages/publish/publish',
    'pages/me/me',
    'pages/login/login',
    'pages/myInfo/myInfo',
    'pages/myPosts/myPosts',
    'pages/infoDetail/infoDetail',
    'pages/search/index',
    'pages/searchResult/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '旅游日记',
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
        selectedIconPath: "./assets/images/home.png"
      },
      {
        pagePath: "pages/publish/publish",
        text: "发布",
        iconPath: "./assets/images/publish.png",
        selectedIconPath: "./assets/images/publish.png"
      },
      {
        pagePath: "pages/me/me",
        text: "我的",
        iconPath: "./assets/images/me.png",
        selectedIconPath: "./assets/images/me.png"
      }
    ]
  }
}
