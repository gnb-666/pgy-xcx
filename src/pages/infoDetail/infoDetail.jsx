import { View, Text, Image, Swiper, SwiperItem, Video, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./infoDetail.less";

export default function InfoDetail() {
  const [info, setInfo] = useState({});
  const [autoplay] = useState(false);

  useEffect(() => {
    const _id = Taro.getCurrentInstance().router.params._id;
    if (_id) {
      getTravelNoteDetail(_id);
    }
  }, []);

  const getTravelNoteDetail = async (_id) => {
    try {
      const result = await Taro.request({
        url: 'http://localhost:3001/getTravelNoteDetail',
        method: 'GET',
        data: { _id }
      });

      if (result.data) {
        // 格式化时间
        const formattedInfo = {
          ...result.data,
          publishTime: formatTimeTwo(result.data.publishTime)
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
  const formatTimeTwo = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

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
