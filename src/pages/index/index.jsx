import { View, Text, Input, Image, ScrollView } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import './index.less'; // 引入样式文件

// 导入本地图片
import banner1 from '../../assets/images/banner1.jpeg';
import banner2 from '../../assets/images/banner2.jpeg';
import rcImage from '../../assets/images/R-C.jpg';
import sucImage from '../../assets/images/suc.png';
import avatarImage from '../../assets/images/avatar.png';
import profileImage from '../../assets/images/头像.png';

// 格式化时间函数，类似老版代码中的formatTime
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

// 假数据
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
  },
  {
    _id: 'diary005',
    title: '三亚温泉度假之旅',
    content: '这个冬天去三亚体验了一次温泉度假，海边的温泉别有一番风味。晚上看着星空泡温泉，太舒适了！',
    imgList: [
      banner2,
      rcImage
    ],
    publishTime: new Date('2025-05-15').getTime(),
    userInfo: {
      username: '度假专家',
      avatar: avatarImage
    },
    category: '温泉'
  },
  {
    _id: 'diary006',
    title: '哈尔滨冰雪大世界玩雪攻略',
    content: '哈尔滨的冰雪大世界真的很壮观，各种冰雕令人惊叹。玩雪的时候记得穿厚一点，零下30度不是开玩笑的！',
    imgList: [
      banner1,
      sucImage
    ],
    publishTime: new Date('2025-05-18').getTime(),
    userInfo: {
      username: '雪地探险家',
      avatar: profileImage
    },
    category: '玩雪'
  },
  {
    _id: 'diary007',
    title: '三亚海边度假全攻略',
    content: '三亚的海滩真的很美，蔚蓝的海水和细软的沙滩让人流连忘返。这里分享一下我的三亚海边度假经验。',
    imgList: [
      banner2,
      rcImage
    ],
    publishTime: new Date('2025-05-20').getTime(),
    userInfo: {
      username: '海岛控',
      avatar: avatarImage
    },
    category: '海边'
  },
  {
    _id: 'diary008',
    title: '漠河极光观赏之旅',
    content: '终于在漠河看到了梦寐以求的极光，那种震撼难以言表。北极村的冬天很冷，但为了极光，一切都值得！',
    imgList: [
      banner1,
      sucImage
    ],
    publishTime: new Date('2025-05-22').getTime(),
    userInfo: {
      username: '极光猎人',
      avatar: profileImage
    },
    category: '玩雪'
  }
];

export default function Index() {
  const [diaries, setDiaries] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const [categories, setCategories] = useState([
    { name: '全部', active: true },
    { name: '游记', active: false },
    { name: '记录每一天', active: false },
    { name: '温泉', active: false },
    { name: '玩雪', active: false },
    { name: '海边', active: false }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  // 分页加载相关状态
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = Taro.getStorageSync('login');
    if (!isLoggedIn) {
      console.log('用户未登录，准备跳转到登录页面');
      // 不跳转到登录页面，直接加载假数据
      setLoading(true);
      loadMockData();
    } else {
      // 已登录，尝试加载真实数据，如果失败则加载假数据
      fetchDiaries();
    }
  }, []);

  // 加载假数据的函数
  const loadMockData = () => {
    console.log('加载假数据');
    setLoading(true);
    // 模拟分页效果
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = mockData.slice(start, end);
    
    const formattedData = paginatedData.map(item => {
      return {
        ...item,
        time: formatTime(item.publishTime)
      }
    });
    
    if (page === 1) {
      setDiaries(formattedData);
      setFilteredDiaries(formattedData);
    } else {
      setDiaries(prev => [...prev, ...formattedData]);
      setFilteredDiaries(prev => [...prev, ...formattedData]);
    }
    
    setHasMore(end < mockData.length);
    setLoading(false);
    setLoadingMore(false);
  };

  const fetchDiaries = async () => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const res = await Taro.request({
        url: 'http://localhost:3001/getTravelNotes',
        method: 'GET',
        data: {
          page,
          pageSize
        }
      });
      
      if (res.data && res.data.data && res.data.data.length > 0) {
        // 格式化时间，类似老版代码
        const formattedData = res.data.data.map(item => {
          return {
            ...item,
            time: formatTime(item.publishTime)
          }
        });
        
        if (page === 1) {
          setDiaries(formattedData);
          setFilteredDiaries(formattedData);
        } else {
          setDiaries(prev => [...prev, ...formattedData]);
          setFilteredDiaries(prev => [...prev, ...formattedData]);
        }
        
        setHasMore(res.data.hasMore);
      } else {
        // 如果没有数据，加载假数据
        loadMockData();
      }
    } catch (error) {
      console.error("获取旅游日记列表出错:", error);
      // 加载失败时，使用假数据
      loadMockData();
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 加载更多数据
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setPage(prev => prev + 1);
    const isLoggedIn = Taro.getStorageSync('login');
    if (isLoggedIn) {
      fetchDiaries();
    } else {
      loadMockData();
    }
  };

  const handleSearch = () => {
    if (!searchKeyword) {
      filterByCategory(activeCategory);
      return;
    }
    
    // 先根据分类筛选
    let categoryFiltered = diaries;
    if (activeCategory !== '全部') {
      categoryFiltered = diaries.filter(item => item.category === activeCategory);
    }
    
    // 再根据搜索关键词筛选（标题、内容和用户昵称）
    const filtered = categoryFiltered.filter(diary => 
      diary.title.includes(searchKeyword) || 
      diary.content.includes(searchKeyword) ||
      (diary.userInfo && diary.userInfo.username && diary.userInfo.username.includes(searchKeyword))
    );
    setFilteredDiaries(filtered);
  };

  const handleToDetail = (item) => {
    // 跳转到详情页，与老版代码类似
    Taro.navigateTo({
      url: `/pages/infoDetail/index?_id=${item._id}`
    });
  };

  // 检查用户是否登录
  const checkLogin = () => {
    const isLogged = Taro.getStorageSync('login');
    if (!isLogged) {
      Taro.showToast({
        title: '请您先登录!',
        icon: 'none'
      });
      
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/login/index'
        });
      }, 1000);
      return false;
    }
    return true;
  };

  const toSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  // 点击分类筛选
  const handleCategoryClick = (index) => {
    const newCategories = categories.map((item, i) => {
      return { ...item, active: i === index };
    });
    setCategories(newCategories);
    
    const selectedCategory = categories[index].name;
    setActiveCategory(selectedCategory);
    // 重置分页，从第一页重新加载
    setPage(1);
    filterByCategory(selectedCategory);
  };
  
  // 根据分类筛选数据
  const filterByCategory = (category) => {
    if (category === '全部') {
      setFilteredDiaries(diaries);
    } else {
      const filtered = diaries.filter(item => item.category === category);
      setFilteredDiaries(filtered);
    }
  };

  // 滚动到底部触发加载更多
  const handleScrollToLower = () => {
    if (hasMore && !loadingMore) {
      loadMore();
    }
  };

  return (
    <View className="body">
      {/* 搜索组件 */}
      <View className="search-container" onClick={toSearch}>
        <View className="search-input-container">
          <Input
            className="search-input"
            placeholder="找找去哪儿玩～"
            disabled
          />
        </View>
      </View>

      {/* 分类 */}
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

      {/* 加载状态 */}
      {loading && page === 1 ? (
        <View className="loading">加载中...</View>
      ) : (
        /* 瀑布流布局 */
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
                onClick={() => handleToDetail(item)}
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
          
          {/* 加载更多提示 */}
          {loadingMore && (
            <View className="loading-more">加载更多...</View>
          )}
          
          {/* 没有更多数据提示 */}
          {!hasMore && filteredDiaries.length > 0 && (
            <View className="no-more-data">没有更多数据了</View>
          )}
        </ScrollView>
      )}

      {/* 底部间距，留给TabBar */}
      <View style={{ height: '100px' }}></View>
    </View>
  );
}
