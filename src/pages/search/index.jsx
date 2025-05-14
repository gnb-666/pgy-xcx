import { View, Text, Input, Image, ScrollView } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import './index.less'; // 引入样式文件

// 导入本地图片
import avatarImage from '../../assets/images/avatar.png';
import banner1 from '../../assets/images/banner1.jpeg';
import banner2 from '../../assets/images/banner2.jpeg';
import rcImage from '../../assets/images/R-C.jpg';
import sucImage from '../../assets/images/suc.png';
import profileImage from '../../assets/images/头像.png';

// 格式化时间函数
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

// 假数据，与首页相同
const mockData = [
  {
    _id: 'diary001',
    title: '广州长隆野生动物园一日游',
    content: '今天去了广州长隆野生动物园，看到了很多珍稀动物，拍了很多照片。特别是熊猫馆，真的太可爱了！',
    imgList: [
      banner1,
      rcImage
    ],
    publishTime: new Date('2025-05-01').getTime(),
    userInfo: {
      username: '旅行家小明',
      avatar: avatarImage
    },
    category: '游记'
  },
  {
    _id: 'diary002',
    title: '珠海横琴旅游攻略',
    content: '横琴是一个非常适合周末游的地方，今天天气很好，拍了很多美丽的风景照。推荐大家有空来玩！',
    imgList: [
      banner2,
      rcImage
    ],
    publishTime: new Date('2025-05-05').getTime(),
    userInfo: {
      username: '摄影达人',
      avatar: profileImage
    },
    category: '记录每一天'
  },
  {
    _id: 'diary003',
    title: '香港迪士尼乐园游玩体验',
    content: '香港迪士尼乐园真的太好玩了！米奇老鼠和唐老鸭都见到了，还玩了很多刺激的游乐设施。下次还想再来！',
    imgList: [
      sucImage,
      avatarImage
    ],
    publishTime: new Date('2025-05-10').getTime(),
    userInfo: {
      username: '小小旅行家',
      avatar: avatarImage
    },
    category: '游记'
  },
  {
    _id: 'diary004',
    title: '桂林山水甲天下，感受大自然的鬼斧神工',
    content: '桂林的山水真是名不虚传，漓江两岸的喀斯特地貌太壮观了。船游漓江的体验特别棒，推荐给所有热爱自然的朋友。',
    imgList: [
      banner1,
      rcImage
    ],
    publishTime: new Date('2025-05-12').getTime(),
    userInfo: {
      username: '山水爱好者',
      avatar: profileImage
    },
    category: '游记'
  }
];

export default function Search() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 执行搜索
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      Taro.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // 尝试调用后端API搜索
      const res = await Taro.request({
        url: 'http://localhost:3001/searchTravelNotes',
        method: 'GET',
        data: {
          keyword: searchKeyword
        }
      }).catch(err => {
        console.error('搜索API调用失败', err);
        return { statusCode: 500 };
      });

      if (res.statusCode === 200 && res.data && res.data.length > 0) {
        // 处理API返回数据
        const formattedData = res.data.map(item => {
          return {
            ...item,
            time: formatTime(item.publishTime)
          }
        });
        setSearchResults(formattedData);
      } else {
        // 使用假数据模拟搜索
        console.log('使用模拟数据搜索');
        const keyword = searchKeyword.toLowerCase();
        const results = mockData.filter(item => 
          item.title.toLowerCase().includes(keyword) || 
          item.content.toLowerCase().includes(keyword) ||
          (item.userInfo && item.userInfo.username && 
           item.userInfo.username.toLowerCase().includes(keyword))
        );
        
        const formattedResults = results.map(item => ({
          ...item,
          time: formatTime(item.publishTime)
        }));
        
        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error('搜索过程出错:', error);
      // 错误处理
      Taro.showToast({
        title: '搜索出错，请稍后再试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    setSearchKeyword(e.detail.value);
  };

  // 跳转到详情页
  const handleToDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/infoDetail/index?_id=${item._id}`
    });
  };

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack();
  };

  // 清除搜索内容
  const clearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <View className="search-page">
      {/* 搜索栏 */}
      <View className="search-header">
        <View className="back-button" onClick={handleBack}>
          <Text className="back-icon">←</Text>
        </View>
        <View className="search-input-wrapper">
          <Input
            className="search-input"
            value={searchKeyword}
            onInput={handleInputChange}
            placeholder="搜索游记、内容或用户昵称"
            confirmType="search"
            onConfirm={handleSearch}
            focus
          />
          {searchKeyword.length > 0 && (
            <View className="clear-button" onClick={clearSearch}>
              <Text className="clear-icon">×</Text>
            </View>
          )}
        </View>
        <View className="search-button" onClick={handleSearch}>
          搜索
        </View>
      </View>

      {/* 搜索结果 */}
      <ScrollView
        scrollY
        className="search-results"
        enableFlex
      >
        {loading ? (
          <View className="loading">搜索中...</View>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <View className="results-list">
              {searchResults.map((item, index) => (
                <View
                  key={item._id || index}
                  className="result-item"
                  onClick={() => handleToDetail(item)}
                >
                  {item.imgList && item.imgList.length > 0 && (
                    <Image
                      className="result-image"
                      src={item.imgList[0]}
                      mode="aspectFill"
                    />
                  )}
                  <View className="result-content">
                    <Text className="result-title">{item.title}</Text>
                    <Text className="result-desc">{item.content.substring(0, 50)}...</Text>
                    <View className="result-footer">
                      <View className="user-info">
                        <Image
                          className="user-avatar"
                          src={item.userInfo?.avatar || avatarImage}
                        />
                        <Text className="user-name">{item.userInfo?.username || "用户"}</Text>
                      </View>
                      <Text className="post-time">{item.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="empty-result">
              <Text>未找到与"{searchKeyword}"相关的游记</Text>
              <Text className="empty-tip">尝试其他关键词或浏览推荐游记</Text>
            </View>
          )
        ) : (
          <View className="search-tip">
            <Text>您可以搜索游记标题、内容或用户昵称</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 