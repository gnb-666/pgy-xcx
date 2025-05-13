import { View, Text, Image, Button } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import avatarDefault from "../../assets/images/avatar.png";
import "./myInfo.less";

export default function MyInfo() {
  const userInfo = Taro.getStorageSync('userInfo') || {};
  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatar || avatarDefault);
  const [nickName] = useState(userInfo.username || "");

  // 上传头像
  const uploadAvatar = async () => {
    try {
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      });

      if (res.tempFiles && res.tempFiles[0]) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const uploadRes = await Taro.uploadFile({
          url: 'http://localhost:3001/uploadImg',
          filePath: tempFilePath,
          name: 'file'
        });

        const data = JSON.parse(uploadRes.data);
        if (data && data[0]) {
          const result = await Taro.request({
            url: 'http://localhost:3001/updateAvatar',
            method: 'POST',
            data: {
              openid: userInfo._id,
              avatarUrl: data[0]
            }
          });

          if (result.data.message === 'Avatar updated successfully') {
            setAvatarUrl(data[0]);
            Taro.showToast({
              title: '头像上传成功',
              icon: 'success'
            });
            // 更新本地存储的用户信息
            const newUserInfo = {
              ...userInfo,
              avatar: data[0]
            };
            Taro.setStorageSync('userInfo', newUserInfo);
          } else {
            Taro.showToast({
              title: '上传失败，请稍后再试',
              icon: 'none'
            });
          }
        } else {
          Taro.showToast({
            title: '上传失败，请稍后再试',
            icon: 'none'
          });
        }
      }
    } catch (error) {
      console.error('上传失败:', error);
      Taro.showToast({
        title: '上传失败，请稍后再试',
        icon: 'none'
      });
    }
  };

  return (
    <View className="body">
      <View className="info">
        <View className="info-item">
          <Text>头像</Text>
          <Image className="avatarUrl" onClick={uploadAvatar} src={avatarUrl} />
        </View>
        <View className="info-item">
          <Text>账户</Text>
          <Text>{nickName}</Text>
        </View>
      </View>
    </View>
  );
}