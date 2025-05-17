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
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const [categories, setCategories] = useState([
    { name: '全部', active: true },
    { name: '游记', active: false },
    { name: '记录每一天', active: false },
    { name: '温泉', active: false },
    { name: '玩雪', active: false },
    { name: '海边', active: false }
  ]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 下拉刷新
  usePullDownRefresh(() => {
    setPage(1);
    fetchDiaries(1, true);
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  // 首次加载
  useEffect(() => {
    fetchDiaries(1, true);
  }, []);

  // 加载更多
  useEffect(() => {
    if (page > 1) {
      fetchDiaries(page);
    }
    // eslint-disable-next-line
  }, [page]);

  // 获取游记数据
  const fetchDiaries = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (isRefresh) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/getTravelNotes',
        method: 'GET'
      });
      let data = res.data;
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

      // 分页
      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = formattedData.slice(start, end);

      let newDiaries;
      if (pageNum === 1 || isRefresh) {
        newDiaries = paginatedData;
      } else {
        newDiaries = [...diaries, ...paginatedData];
      }
      setDiaries(newDiaries);
      filterByCategory(activeCategory, newDiaries);
      setHasMore(end < formattedData.length);
    } catch (error) {
      Taro.showToast({ title: '获取数据失败', icon: 'none' });
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    // eslint-disable-next-line
  }, [activeCategory, diaries, pageSize]);

  // 分类筛选
  const handleCategoryClick = (index) => {
    const newCategories = categories.map((item, i) => ({ ...item, active: i === index }));
    setCategories(newCategories);
    const selectedCategory = categories[index].name;
    setActiveCategory(selectedCategory);
    filterByCategory(selectedCategory, diaries);
  };

  // 分类过滤
  const filterByCategory = (category, data = diaries) => {
    if (category === '全部') {
      setFilteredDiaries(data);
    } else {
      setFilteredDiaries(data.filter(item => item.category === category));
    }
  };

  // 加载更多
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setPage(prev => prev + 1);
  };

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

  // 滚动到底部
  const handleScrollToLower = () => {
    if (hasMore && !loadingMore) {
      loadMore();
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
      <View className="search-container" onClick={toSearch}>
        <View className="search-input-container">
          <Input
            className="search-input"
            placeholder="找找去哪儿玩～"
            disabled
          />
        </View>
      </View>

      {/* 分类Tab */}
      <View className="list2-head">
        {categories.map((cat, index) => (
          <View
            key={index}
            className={`mini-head ${cat.active ? 'current' : ''}`}
            onClick={() => handleCategoryClick(index)}
          >
            {cat.name}
          </View>
        ))}
      </View>

      {/* 游记列表 */}
      {loading && page === 1 ? (
        <View className="loading">加载中...</View>
      ) : (
        <ScrollView
          scrollY
          className="diary-waterfall"
          enableFlex
          onScrollToLower={handleScrollToLower}
        >
          <View className="grid-layout">
            {filteredDiaries.length > 0 ? filteredDiaries.map((item, index) => (
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
                  <Text className="diary-title">{item.title}</Text>
                  <View className="user-info">
                    <Image
                      className="user-avatar"
                      src={item.userInfo?.avatar || avatarImage}
                    />
                    <Text className="user-name">{item.userInfo?.username || "用户"}</Text>
                  </View>
                </View>
              </View>
            )) : (
              <View className="empty-state">该分类下暂无游记数据</View>
            )}
          </View>
          {loadingMore && (
            <View className="loading-more">加载更多...</View>
          )}
          {!hasMore && filteredDiaries.length > 0 && (
            <View className="no-more-data">没有更多数据了</View>
          )}
        </ScrollView>
      )}
      <View style={{ height: '100px' }}></View>
    </View>
  );
}
