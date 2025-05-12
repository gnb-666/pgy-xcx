import { View, Text, Button, Image, Video } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";

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

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const userInfo = Taro.getStorageSync('userInfo');
    if (!userInfo || !userInfo._id) return;
    const res = await Taro.request({
      url: 'http://localhost:3001/getMyPublish',
      method: 'GET',
      data: { openid: userInfo._id }
    });
    setList((res.data || []).map(item => ({ ...item, time: formatTime(item.publishTime) })));
  };

  const handleDelete = async (id) => {
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
  };

  const handleUpdate = (item) => {
    Taro.navigateTo({
      url: `/pages/publish/publish?info=${encodeURIComponent(JSON.stringify(item))}`
    });
  };

  const toDetail = (item) => {
    Taro.navigateTo({
      url: `/pages/infoDetail/infoDetail?_id=${item._id}`
    });
  };

  return (
    <View className="body">
      <View style={{fontWeight:'bold',fontSize:'18px',padding:'16px 0 8px 0'}}>我的发布</View>
      <View className="lose-list">
        {list.map((item, idx) => (
          <View key={item._id} className="my-card" style={{border:'1px solid #eee',borderRadius:'10px',marginBottom:'16px',padding:'16px',position:'relative'}}>
            <View onClick={() => toDetail(item)} style={{cursor:'pointer'}}>
              <Text style={{fontWeight:'bold',fontSize:'16px'}}>{item.title}</Text>
              <Text style={{marginLeft:'10px',color:'#888'}}>{item.time}</Text>
              <Text style={{
                color: item.state === 1 ? 'green' : item.state === 2 ? 'red' : '#faad14',
                marginLeft: '10px',
                fontWeight: 'bold'
              }}>
                {item.state === 0 ? '待审核' : item.state === 1 ? '已通过' : '已驳回'}
              </Text>
              <View style={{marginTop:'8px',color:'#333'}}>{item.content}</View>
              {item.imgList && item.imgList.length > 0 && (
                <View style={{display:'flex',flexWrap:'wrap',marginTop:'8px'}}>
                  {item.imgList.map((img, i) => (
                    <Image key={i} src={img} style={{width:'100px',height:'100px',marginRight:'8px',marginBottom:'8px',borderRadius:'8px'}} />
                  ))}
                </View>
              )}
              {(item.video || item.videoUrl) && (
                <View style={{marginTop:'8px'}}>
                  <Video src={item.video || item.videoUrl} controls style={{width:'200px',height:'120px',borderRadius:'8px'}} />
                </View>
              )}
            </View>
            <View style={{position:'absolute',top:'16px',right:'16px',display:'flex',gap:'8px'}}>
              <Button size="mini" onClick={() => handleUpdate(item)}>编辑</Button>
              <Button size="mini" onClick={() => handleDelete(item._id)} type="warn">删除</Button>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}