import { View, Text, List, Input, Button, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import { Taro } from "@tarojs/taro";
import './index.less'; // 引入样式文件

export default function Index() {
  const [diaries, setDiaries] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredDiaries, setFilteredDiaries] = useState([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    if (searchKeyword === "") {
      setFilteredDiaries(diaries);
    } else {
      const filtered = diaries.filter(diary => 
        diary.title.includes(searchKeyword) || diary.content.includes(searchKeyword)
      );
      setFilteredDiaries(filtered);
    }
  }, [searchKeyword, diaries]);

  const fetchDiaries = async () => {
    try {
      // 构造更多模拟数据，包含标题、内容和图片路径
      const mockDiaries = [
        { 
          id: 1, 
          title: "第一次旅行", 
          content: "这是我的第一次旅行，非常开心。我去了很多美丽的地方，品尝了当地的美食。", 
          imageUrl: "/images/trip1.jpg" 
        },
        { 
          id: 2, 
          title: "海边之旅", 
          content: "海边的风景真美，阳光、沙滩和海浪，让人流连忘返。", 
          imageUrl: "/images/trip2.jpg" 
        },
        { 
          id: 3, 
          title: "山区探险", 
          content: "这次山区探险充满了挑战，但也收获了很多美丽的风景和难忘的回忆。", 
          imageUrl: "/images/trip3.jpg" 
        }
      ];
      setDiaries(mockDiaries);
      setFilteredDiaries(mockDiaries);
    } catch (error) {
      console.error("获取旅游日记列表出错:", error);
    }
  };

  return (
    <View>
      <View className="search-container">
        <Input
          className="search-input"
          placeholder="请输入搜索关键字"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button className="search-button" onClick={() => {}}>搜索</Button>
      </View>
      {/* 添加 className */}
      <View className="diary-list-container">
        {filteredDiaries.map((diary, index) => (
          <>
            <View key={diary.id}>
              <View>
                {/* 暂时注释图片组件 */}
                {/* <Image src={diary.imageUrl} mode="aspectFit" style={{ width: '100%', height: 200 }} /> */}
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{diary.title}</Text>
                <Text style={{ marginTop: 5 }}>{diary.content}</Text>
              </View>
            </View>
            {/* 除了最后一个日记项，都添加分割线 */}
            {index < filteredDiaries.length - 1 && <View className="diary-divider" />}
          </>
        ))}
      </View>
    </View>
  );
}
