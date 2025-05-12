import { View, Text, Image, Button } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import avatarDefault from "../../assets/images/avatar.png";

export default function MyInfo() {
  const userInfo = Taro.getStorageSync('userInfo') || {};
  const [avatar, setAvatar] = useState(userInfo.avatar || avatarDefault);
  const [username] = useState(userInfo.username || "");

  // 更换头像
  const handleChangeAvatar = async () => {
    const res = await Taro.chooseImage({ count: 1 });
    if (res.tempFilePaths && res.tempFilePaths[0]) {
      // 这里可以先上传图片到服务器，拿到url
      // 假设直接用本地路径
      setAvatar(res.tempFilePaths[0]);
      // 调用后端接口更新头像
      await Taro.request({
        url: 'http://localhost:3001/updateAvatar',
        method: 'POST',
        data: { openid: userInfo._id, avatarUrl: res.tempFilePaths[0] }
      });
      Taro.showToast({ title: '头像已更新', icon: 'success' });
    }
  };

  return (
    <View className="my-info-container">
      <View className="avatar-section">
        <Text className="label">头像</Text>
        <Image
          src={avatar}
          className="avatar-image"
        />
        <Button onClick={handleChangeAvatar}>更换头像</Button>
      </View>
      <View className="username-section">
        <Text className="label">昵称</Text>
        <Text className="value">{username}</Text>
      </View>
    </View>
  );
}