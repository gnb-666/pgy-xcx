import { View, Text, Image, Swiper, SwiperItem, Video, Button } from "@tarojs/components";
import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import "./infoDetail.less";

export default function InfoDetail() {
  const [info, setInfo] = useState({});
  const [autoplay] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const router = Taro.getCurrentInstance();
    const params = router?.router?.params || {};
    const id = params._id;
    console.log('获取到的参数:', params);
    if (id) {
      getTravelNoteDetail(id);
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

  // 预览图片
  const previewImage = (current) => {
    if (!info.imgList || info.imgList.length === 0) return;
    
    Taro.previewImage({
      current, // 当前显示图片的链接
      urls: info.imgList, // 需要预览的图片链接列表
      success: () => {
        console.log('预览图片成功');
      },
      fail: (err) => {
        console.error('预览图片失败:', err);
      }
    });
  };

  // 视频全屏播放
  const handleVideoFullScreen = () => {
    if (videoRef.current) {
      // 小程序环境下，使用createVideoContext创建上下文来控制视频
      try {
        const videoContext = Taro.createVideoContext('detailVideo');
        if (videoContext) {
          videoContext.requestFullScreen({ direction: 0 });
          console.log('调用视频全屏API');
        } else {
          console.log('无法获取视频上下文');
        }
      } catch (error) {
        console.error('请求全屏失败:', error);
        Taro.showToast({
          title: '全屏播放功能暂不可用',
          icon: 'none'
        });
      }
    }
  };

  const handleShare = () => {
    console.log('分享');
  };

  const handleToSuccess = () => {
    Taro.navigateTo({
      url: "/pages/share/share?type=share"
    });
  };

  const toDetail = (item) => {
    console.log('首页点击item', item);
    if (!item._id) {
      Taro.showToast({ title: '无效的游记ID', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`
    });
  };

  // 准备轮播图内容，确保视频在第一项
  const renderSwiperItems = () => {
    const items = [];
    
    // 如果有视频，添加到第一项
    if (info.video) {
      items.push(
        <SwiperItem key="video">
          <Video
            id="detailVideo"
            ref={videoRef}
            src={info.video}
            style={{ width: "100%", height: "100%" }}
            controls
            showFullscreenBtn
            showPlayBtn
            onClick={handleVideoFullScreen}
            onPlay={() => console.log('视频开始播放')}
          />
        </SwiperItem>
      );
    }
    
    // 添加所有图片
    if (info.imgList && info.imgList.length > 0) {
      info.imgList.forEach((item, index) => {
        items.push(
          <SwiperItem key={`image-${index}`}>
            <Image
              mode="aspectFit"
              className="banner-image"
              src={item}
              onClick={() => previewImage(item)}
            />
          </SwiperItem>
        );
      });
    }
    
    return items;
  };

  return (
    <View className="body">
      <Swiper
        className="banner"
        indicatorDots
        autoplay={autoplay}
      >
        {renderSwiperItems()}
      </Swiper>

      <View className="info-header">
        <View className="user-section">
          <Image 
            className="avatar" 
            src={info.userInfo?.avatar} 
            onClick={() => info.userInfo?.avatar && previewImage(info.userInfo.avatar)}
          />
          <Button className="share-btn" onClick={handleToSuccess}>分享</Button>
        </View>
        
        <View className="user-info">
          <View className="info-item">
            <Text className="label">发布人：</Text>
            <Text>{info.userInfo?.username}</Text>
          </View>
          
          <View className="info-item">
            <Text className="label">发布时间：</Text>
            <Text>{info.publishTime}</Text>
          </View>
        </View>
      </View>

      <View className="title-section">
        <Text>{info.title}</Text>
      </View>

      <View className="content-section">
        <View className="desc">{info.content}</View>
      </View>
    </View>
  );
}
