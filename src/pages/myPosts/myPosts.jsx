import { View, Text, Button, Image, Video } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import './myPosts.less';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

export default function MyPosts() {
  const [list, setList] = useState([]);

  // 获取列表数据
  const fetchList = async () => {
    try {
      const userInfo = Taro.getStorageSync('userInfo');
      if (!userInfo || !userInfo._id) {
        console.error('用户信息不存在');
        return;
      }
      const res = await Taro.request({
        url: 'http://localhost:3001/getMyPublish',
        method: 'GET',
        data: { openid: userInfo._id }
      });
      if (res.data) {
        setList((res.data || []).map(item => ({ ...item, time: formatTime(item.publishTime) })));
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      Taro.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchList();
  }, []);

  // 页面显示时获取数据
  Taro.useDidShow(() => {
    fetchList();
  });

  const handleDelete = async (id) => {
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/deleteTravelNote',
        method: 'POST',
        data: { _id: id }
      });
      if (res.data === 'success') {
        Taro.showToast({ title: '删除成功!', icon: 'none' });
        fetchList();
      } else {
        Taro.showToast({ title: '删除失败!', icon: 'none' });
      }
    } catch (error) {
      console.error('删除失败:', error);
      Taro.showToast({ title: '删除失败!', icon: 'none' });
    }
  };

  const handleUpdate = (item) => {
    // 只有待审核和未通过状态的游记可以编辑
    if (item.state === 0 || item.state === 2) {
      // 将数据存储到本地存储中
      const editData = {
        _id: item._id,
        title: item.title,
        content: item.content,
        imgList: item.imgList || [],
        video: item.video,
        videoUrl: item.videoUrl,
        state: item.state
      };
      console.log('存储的编辑数据:', editData); // 添加日志
      Taro.setStorageSync('editTravelNote', editData);
      Taro.switchTab({
        url: '/pages/publish/publish'
      });
    } else {
      Taro.showToast({ 
        title: '已通过的游记不能修改', 
        icon: 'none' 
      });
    }
  };

  const toDetail = (item) => {
    console.log('准备跳转到详情页，游记数据:', item);
    Taro.reLaunch({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`,
      success: (res) => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        // 如果 reLaunch 失败，尝试使用 redirectTo
        Taro.redirectTo({
          url: `/pages/infoDetail/infoDetail?_id=${item._id}`,
          fail: (redirectErr) => {
            console.error('redirectTo 也失败了:', redirectErr);
            Taro.showToast({
              title: '跳转失败',
              icon: 'none'
            });
          }
        });
      }
    });
  };

  return (
    <View className="body">
      <View className="lose-list">
        {list.map((item) => (
          <View key={item._id} className="my-card" onClick={() => toDetail(item)}>
            {item.imgList && item.imgList.length > 0 && (
              <Image src={item.imgList[0]} className="my-card-img" mode="aspectFill" />
            )}
            <View className="my-card-content-wrapper">
              <View className="my-card-left">
                <View className="my-card-title-row">
                  <View className="my-card-title">{item.title}</View>
                  <View className="my-card-time">{item.time}</View>
                </View>
                <View className="my-card-content">{item.content}</View>
              </View>
              <View className="my-card-right">
                <View className="my-card-btns">
                  <Button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleUpdate(item); }}>编辑</Button>
                  <Button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>删除</Button>
                </View>
              </View>
            </View>
            <View className="my-card-status">
              {item.state === 1 && <Text className="status-success">已通过</Text>}
              {item.state === 2 && <Text className="status-fail">已驳回</Text>}
              {item.state === 0 && <Text className="status-wait">待审核</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}