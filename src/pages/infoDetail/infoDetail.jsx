import { View, Text, Image, Swiper, SwiperItem, Video, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./infoDetail.less";

export default function InfoDetail() {
  const [info, setInfo] = useState({});
  const [autoplay] = useState(false);

  useEffect(() => {
    const params = Taro.getCurrentInstance().router.params;
    console.log('获取到的参数:', params);
    const _id = params._id;
    if (_id) {
      getTravelNoteDetail(_id);
    }
  }, []);

  const getTravelNoteDetail = async (_id) => {
    try {
      console.log('正在获取游记详情，ID:', _id);
      const result = await Taro.request({
        url: 'http://localhost:3001/getTravelNoteDetail',
        method: 'GET',
        data: { _id }
      });

      console.log('获取到的游记详情:', result.data);
      if (result.data) {
        // 格式化时间
        const formattedInfo = {
          ...result.data,
          publishTime: result.data.publishTime ? formatTimeTwo(result.data.publishTime) : ''
        };
        setInfo(formattedInfo);
      }
    } catch (error) {
      console.error('获取游记详情失败:', error);
      Taro.showToast({
        title: '获取详情失败',
        icon: 'none'
      });
    }
  };

  // 格式化时间函数
  const formatTimeTwo = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const handleShare = () => {
    console.log('分享');
  };

  const handleToSuccess = () => {
    Taro.navigateTo({
      url: "/pages/share/share"
    });
  };

  return (
    <View className="body">
      <Swiper
        className="banner"
        indicatorDots
        autoplay={autoplay}
      >
        {info.imgList?.map((item, index) => (
          <SwiperItem key={index}>
            {info.video && index === 0 ? (
              <Video
                src={info.video}
                style={{ width: "100%", height: "100%" }}
                controls
              />
            ) : (
              <Image
                mode="aspectFit"
                className="banner-image"
                src={item}
              />
            )}
          </SwiperItem>
        ))}
      </Swiper>

      <View className="name">{info.title}</View>

      <View className="container">
        <View className="date item">
          <Image className="avatar" src={info.userInfo?.avatar} />
        </View>
        <View className="date item">
          <Text className="label">发布时间：</Text>
          <Text>{info.publishTime}</Text>
        </View>
        <View className="date item">
          <Text className="label">发布人：</Text>
          <Text>{info.userInfo?.username}</Text>
        </View>
        <View className="date item">
          <Text className="label">发布内容：</Text>
          <View className="desc">{info.content}</View>
        </View>

        <View className="date item">
          <Text className="label">分享：</Text>
          <Image
            onClick={handleShare}
            style={{ width: "60rpx" }}
            mode="widthFix"
            src="../../assets/images/fenx.png"
          />
          <Button onClick={handleToSuccess}>分享</Button>
        </View>
      </View>
    </View>
  );
}
