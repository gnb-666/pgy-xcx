import { View, Text, Input, Image, ScrollView, Swiper, SwiperItem } from "@tarojs/components";
import { useState, useEffect, useCallback } from "react";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import './index.less'; // 引入样式文件

// 导入本地图片
import banner1 from '../../assets/images/banner1.jpeg';
import banner2 from '../../assets/images/banner2.jpeg';
import rcImage from '../../assets/images/R-C.jpg';
import avatarImage from '../../assets/images/avatar.png';
import profileImage from '../../assets/images/头像.png';

const bannerList = [banner1, banner2, rcImage];

// 格式化时间函数，类似老版代码中的formatTime
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export default function Index() {
  const [diaries, setDiaries] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 检查登录态
  const checkLogin = () => {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo || !userInfo._id) {
      Taro.showModal({
        title: '提示',
        content: '请先登录后使用',
        confirmText: '去登录',
        cancelText: '稍后再说',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/login/index'
            });
          }
        }
      });
    }
  };

  // 下拉刷新
  usePullDownRefresh(() => {
    fetchDiaries(1, true);
    setPage(1);
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  // 首次加载
  useEffect(() => {
    checkLogin();
    fetchDiaries(1, true);
    setPage(1);
  }, []);

  // 每次页面显示时也检查登录状态
  Taro.useDidShow(() => {
    checkLogin();
  });

  // 加载更多
  useEffect(() => {
    if (page > 1) {
      fetchDiaries(page);
    }
    // eslint-disable-next-line
  }, [page]);

  // 分页获取游记数据
  const fetchDiaries = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await Taro.request({
        url: `http://localhost:3001/getTravelNotes`,
        method: 'GET'
      });
      let data = res.data;
      // 兼容后端返回格式
      if (Array.isArray(data)) {
        data = data;
      } else if (data && data.data) {
        data = data.data;
      } else {
        data = [];
      }
      // 格式化时间
      const formattedData = data.map(item => ({
        ...item,
        time: formatTime(item.publishTime)
      }));
      // 前端分页
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = formattedData.slice(start, end);
      let newDiaries;
      if (isRefresh || pageNum === 1) {
        newDiaries = paginatedData;
      } else {
        newDiaries = [...diaries, ...paginatedData];
      }
      setDiaries(newDiaries);
      setHasMore(end < formattedData.length);
    } catch (error) {
      Taro.showToast({ title: '获取数据失败', icon: 'none' });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [diaries, pageSize, loading]);

  // 跳转详情
  const toDetail = (item) => {
    if (!item._id) return;
    Taro.navigateTo({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`
    });
  };

  // 跳转搜索
  const toSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  // 滚动到底部加载更多
  const handleScrollToLower = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <View className="body">
      {/* 轮播图 */}
      <Swiper
        className="banner"
        indicatorDots
        autoplay
        interval={3000}
        duration={500}
        circular
      >
        {bannerList.map((item, idx) => (
          <SwiperItem key={idx}>
            <Image className="banner-image" src={item} mode="aspectFill" />
          </SwiperItem>
        ))}
      </Swiper>

      {/* 搜索框 */}
      <View className="search-container" style={{ padding: '15px 20px' }} onClick={toSearch}>
        <View className="search-input-container" style={{ height: '44px', borderRadius: '22px' }}>
          <Input
            className="search-input"
            style={{ fontSize: '16px', height: '44px', lineHeight: '44px', paddingLeft: '15px' }}
            placeholder="找找去哪儿玩～"
            disabled
          />
        </View>
      </View>

      {/* 游记列表 */}
      <ScrollView
        scrollY
        className="diary-waterfall"
        enableFlex
        onScrollToLower={handleScrollToLower}
      >
        <View className="grid-layout">
          {diaries.length > 0 ? diaries.map((item, index) => (
            <View
              key={item._id || index}
              className="diary-item"
              onClick={() => toDetail(item)}
            >
              {item.imgList && item.imgList.length > 0 && (
                <Image
                  className="diary-image"
                  src={item.imgList[0]}
                  mode="aspectFill"
                />
              )}
              <View className="diary-content">
                <Text className="diary-title" style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '26px' }}>{item.title}</Text>
                <View className="user-info">
                  <Image
                    className="user-avatar"
                    style={{ width: '34px', height: '34px', borderRadius: '50%' }}
                    src={item.userInfo?.avatar || avatarImage}
                  />
                  <Text className="user-name" style={{ fontSize: '16px', marginLeft: '8px' }}>{item.userInfo?.username || "用户"}</Text>
                </View>
              </View>
            </View>
          )) : (
            <View className="empty-state">暂无游记数据</View>
          )}
        </View>
        {loading && <View className="loading-more">加载中...</View>}
        {!hasMore && diaries.length > 0 && <View className="no-more-data">没有更多数据了</View>}
      </ScrollView>
      <View style={{ height: '100px' }}></View>
    </View>
  );
}
