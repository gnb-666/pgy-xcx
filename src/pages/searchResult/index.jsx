import { View, Text, Image } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import './index.less';

const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

function ViewCard2({ data, onClick }) {
  return (
    <View className="travel-note-body" onClick={() => onClick(data)}>
      <View className="travel-note-item">
        {data.imgList && data.imgList.length > 0 && (
          <Image className="travel-note-image" mode="aspectFit" src={data.imgList[0]} />
        )}
        <View className="travel-note-content">
          <Text className="title">{data.title}</Text>
          <View className="content">游记内容: {data.content}</View>
        </View>
      </View>
    </View>
  );
}

export default function SearchResult() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const router = Taro.getCurrentInstance();
    const params = router?.router?.params || {};
    const searchName = params.name || '';
    setName(searchName);
    fetchList(searchName);
  }, []);

  const fetchList = async (searchName) => {
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/searchTravelNotes',
        method: 'GET',
        data: { title: searchName }
      });
      let data = res.data;
      if (!Array.isArray(data)) data = [];
      setList(data.map(item => ({ ...item, time: formatTime(item.publishTime) })));
    } catch (e) {
      setList([]);
    }
  };

  const toDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`
    });
  };

  const handleSearch = () => {
    if (name.trim()) {
      Taro.navigateTo({
        url: `/pages/searchResult/index?name=${encodeURIComponent(name)}`
      });
    }
  };

  return (
    <View className="body">
      <View className="lose-list">
        {list.length > 0 ? (
          list.map((item, idx) => (
            <ViewCard2 key={item._id || idx} data={item} onClick={toDetail} />
          ))
        ) : (
          <View className="empty-result">暂无数据</View>
        )}
      </View>
      <View className="search-button" onClick={handleSearch}>搜索</View>
    </View>
  );
} 