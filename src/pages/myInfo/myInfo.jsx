import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import avatar from "../../assets/images/avatar.png"; // 引入头像图片

// 假设从状态管理或者接口获取用户信息
const userInfo = {
  avatar: avatar,
  username: "张三",
};

export default function MyInfo() {
  return (
    <View className="my-info-container">
      <View className="avatar-section">
        <Text className="label">头像</Text>
        <Image
          src={userInfo.avatar}
          className="avatar-image"
          // 移除内联样式，统一在样式文件中管理
        />
      </View>
      <View className="username-section">
        <Text className="label">昵称</Text>
        <Text className="value">{userInfo.username}</Text>
      </View>
    </View>
  );
}