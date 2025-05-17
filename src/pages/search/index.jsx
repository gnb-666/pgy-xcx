import { View, Text, Input, Image } from "@tarojs/components";
import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import './index.less';

import searchIcon from '../../assets/images/search.png';
import closeIcon from '../../assets/images/close1.png';
import deleteIcon from '../../assets/images/delete.png';
import dayuIcon from '../../assets/images/dayu.png';
import avatarImage from '../../assets/images/avatar.png';

const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export default function Search() {
  const [search, setSearch] = useState(''); // 延迟响应
  const [_search, set_Search] = useState(''); // 及时响应
  const [searchLog, setSearchLog] = useState([]); // 搜索历史
  const [searchRes, setSearchRes] = useState([]); // 搜索结果
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // 加载历史
  useEffect(() => {
    const log = Taro.getStorageSync('searchLog') || [];
    setSearchLog(log);
  }, []);

  // 输入框变化（防抖）
  const handleInput = (e) => {
    const value = e.detail.value;
    set_Search(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(value);
      if (!value) {
        setSearchRes([]);
        return;
      }
      // 更新历史
      let log = Taro.getStorageSync('searchLog') || [];
      if (value && (!log.length || log[0] !== value)) {
        log.unshift(value);
        log = Array.from(new Set(log)); // 去重
        Taro.setStorageSync('searchLog', log);
        setSearchLog(log);
      }
      // 请求接口
      doSearch(value);
    }, 800);
  };

  // 搜索接口
  const doSearch = async (keyword) => {
    setLoading(true);
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/searchTravelNotes',
        method: 'GET',
        data: { title: keyword }
      });
      let data = res.data;
      if (!Array.isArray(data)) data = [];
      setSearchRes(data.map(item => ({ ...item, time: formatTime(item.publishTime) })));
    } catch (e) {
      setSearchRes([]);
    } finally {
      setLoading(false);
    }
  };

  // 清除输入
  const deleteSearch = () => {
    setSearch('');
    set_Search('');
    setSearchRes([]);
  };

  // 删除历史
  const deleteLog = () => {
    setSearchLog([]);
    Taro.removeStorageSync('searchLog');
  };

  // 历史点击
  const toSearchLog = (name) => {
    set_Search(name);
    setSearch(name);
    doSearch(name);
  };

  // 跳转详情
  const toDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`
    });
  };

  return (
    <View className="body">
      {/* 搜索栏 */}
      <View className="search">
        <Image className="search-icon" src={searchIcon} />
        <Input
          value={_search}
          placeholder="搜索"
          onInput={handleInput}
          type="text"
          className="search-input"
        />
        {_search.length > 0 && (
          <Image className="close-icon" src={closeIcon} onClick={deleteSearch} />
        )}
      </View>
      {/* 搜索历史 */}
      {search.length === 0 ? (
        <View className="empty-search">
          <View className="search-log">
            <Text>搜索历史</Text>
            <Image className="delete-icon" src={deleteIcon} onClick={deleteLog} />
          </View>
          <View className="log-list">
            {searchLog.map((item, idx) => (
              <View className="log-item" key={idx} onClick={() => toSearchLog(item)}>{item}</View>
            ))}
          </View>
        </View>
      ) : (
        <View className="result-search">
          {loading ? (
            <View className="loading">搜索中...</View>
          ) : (
            searchRes.length > 0 ? (
              searchRes.map((item, idx) => (
                <View className="search-item" key={item._id || idx} onClick={() => toDetail(item)}>
                  <Text>{item.title}</Text>
                  <Image className="search-item-right" src={dayuIcon} />
                </View>
              ))
            ) : (
              <View className="empty-result">未找到相关内容</View>
            )
          )}
        </View>
      )}
    </View>
  );
} 