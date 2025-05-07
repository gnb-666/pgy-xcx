import { View, Text, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import logoutIcon from "../../assets/images/logout.png";
import basicInfoIcon from "../../assets/images/basicInfo.png";
import myPostIcon from "../../assets/images/myPost.png"; // 引入图片
import avatar from "../../assets/images/avatar.png"; // 引入图片

import "./me.less"; // 引入样式文件

// 假设这是从状态管理或者接口获取的用户信息
const userInfo = {
  // avatar: "https://example.com/avatar.jpg",
  avatar: avatar,
  username: "张三",
};

export default function Me() {
  const handleMyPosts = () => {
    // 跳转到我的发布页面
    Taro.navigateTo({
      url: "/pages/myPosts/myPosts",
    });
  };

  const handleMyInfo = () => {
    // 跳转到个人信息页面
    Taro.navigateTo({
      url: "/pages/myInfo/myInfo",
    });
  };

  const handleLogout = () => {
    // 清除登录状态，跳转到登录页面
    Taro.removeStorageSync("token");
    Taro.reLaunch({
      url: "/pages/login/login",
    });
  };

  return (
    <View className="me-container">
      <View className="top-section">
        <View className="avatar-name-container">
          <Image
            src={userInfo.avatar}
            style={{ width: "100px", height: "100px" }}
          />
          <Text>{userInfo.username}</Text>
        </View>
      </View>
      <View className="bottom-section">
        <Button
          onClick={handleMyPosts}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "20px",
          }}
        >
          <Image
            src={myPostIcon}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          <Text>我的发布</Text>
        </Button>
        <Button
          onClick={handleMyInfo}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "20px",
          }}
        >
          <Image
            src={basicInfoIcon}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          <Text>我的信息</Text>
        </Button>
        <Button
          onClick={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "20px",
          }}
        >
          <Image
            src={logoutIcon}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              verticalAlign: "middle",
            }}
          />
          <Text>退出登录</Text>
        </Button>
      </View>
    </View>
  );
}
