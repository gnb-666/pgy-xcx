import { View, Text, Input, Button, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import './index.less'; // 引入样式文件

export default function Index() {
  const [diaries, setDiaries] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredDiaries, setFilteredDiaries] = useState([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/getTravelNotes',
        method: 'GET'
      });
      setDiaries(res.data);
      setFilteredDiaries(res.data);
    } catch (error) {
      console.error("获取旅游日记列表出错:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword) {
      setFilteredDiaries(diaries);
      return;
    }
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/searchTravelNotes',
        method: 'GET',
        data: { title: searchKeyword }
      });
      setFilteredDiaries(res.data);
    } catch (error) {
      console.error("搜索出错:", error);
    }
  };

  return (
    <View>
      <View className="search-container">
        <Input
          className="search-input"
          placeholder="请输入搜索关键字"
          value={searchKeyword}
          onInput={(e) => setSearchKeyword(e.detail.value)}
        />
        <Button className="search-button" onClick={handleSearch}>搜索</Button>
      </View>
      <View className="diary-list-container">
        {filteredDiaries.map((diary, index) => (
          <View key={diary._id || index} className="diary-item">
            {diary.imgList && diary.imgList.length > 0 && (
              <Image src={diary.imgList[0]} mode="aspectFill" style={{ width: '100%', height: 200 }} />
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{diary.title}</Text>
            <Text style={{ marginTop: 5 }}>{diary.content}</Text>
            <View className="diary-divider" />
          </View>
        ))}
      </View>
    </View>
  );
}
