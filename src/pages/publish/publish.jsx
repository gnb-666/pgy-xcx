import {
  View,
  Text,
  Input,
  Button,
  Image,
  Video,
  Textarea,
} from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import uploadIcon from "../../assets/images/upload.png";
import closeIcon from "../../assets/images/close1.png";
import "./publish.less";

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgList, setImgList] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // 从本地存储获取编辑的游记数据
    const editData = Taro.getStorageSync('editTravelNote');
    console.log('获取到的编辑数据:', editData);
    if (editData) {
      setInfo(editData);
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setImgList(editData.imgList || []);
      setVideoUrl(editData.video || editData.videoUrl || '');
      // 清除本地存储中的数据
      Taro.removeStorageSync('editTravelNote');
    }
  }, []);

  // 页面显示时也检查一次数据
  Taro.useDidShow(() => {
    const editData = Taro.getStorageSync('editTravelNote');
    console.log('页面显示时获取到的编辑数据:', editData);
    if (editData) {
      setInfo(editData);
      setTitle(editData.title || '');
      setContent(editData.content || '');
      setImgList(editData.imgList || []);
      setVideoUrl(editData.video || editData.videoUrl || '');
      // 清除本地存储中的数据
      Taro.removeStorageSync('editTravelNote');
    }
  });

  // 上传图片
  const uploadImg = async () => {
    const res = await Taro.chooseImage({
      count: 9 - imgList.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    });
    if (res.tempFilePaths) {
      for (let tempFilePath of res.tempFilePaths) {
        const uploadRes = await Taro.uploadFile({
          url: 'http://localhost:3001/uploadImg',
          filePath: tempFilePath,
          name: 'file',
        });
        const data = JSON.parse(uploadRes.data);
        setImgList(list => list.concat(data));
      }
    }
  };

  // 删除图片
  const deleteImg = (idx) => {
    const newList = [...imgList];
    newList.splice(idx, 1);
    setImgList(newList);
  };

  // 上传视频
  const uploadVideo = async () => {
    const res = await Taro.chooseVideo({
      sourceType: ["album", "camera"],
    });
    if (res.tempFilePath) {
      const uploadRes = await Taro.uploadFile({
        url: 'http://localhost:3001/uploadVideo',
        filePath: res.tempFilePath,
        name: 'video',
      });
      const data = JSON.parse(uploadRes.data);
      if (data && data.path) setVideoUrl(data.path);
    }
  };

  // 删除视频
  const deleteVideo = () => setVideoUrl("");

  // 返回上一页
  const backPage = () => {
    Taro.navigateBack();
  };

  // 发布
  const handlePublish = async () => {
    if (!title || !content) {
      Taro.showToast({ title: '标题和内容不能为空!', icon: 'none' });
      return;
    }
    setLoading(true);
    try {
      const userInfo = Taro.getStorageSync('userInfo');
      const res = await Taro.request({
        url: 'http://localhost:3001/publishTravelNote',
        method: 'POST',
        data: {
          id: info?._id, // 如果是修改，传入原游记的id
          title,
          content,
          imgList,
          openid: userInfo._id,
          videoUrl
        }
      });
      setLoading(false);
      if (res.data && res.data.message === 'Success') {
        // 清空所有输入内容
        setTitle('');
        setContent('');
        setImgList([]);
        setVideoUrl('');
        setInfo(null);
        
        Taro.showToast({ title: info ? '修改成功!' : '发布成功!', icon: 'none' });
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/myPosts/myPosts'
          });
        }, 1000);
      } else {
        Taro.showToast({ title: info ? '修改失败!' : '发布失败!', icon: 'none' });
      }
    } catch (error) {
      setLoading(false);
      Taro.showToast({ title: info ? '修改失败!' : '发布失败!', icon: 'none' });
    }
  };

  return (
    <View className="body">
      <View className="top">
        <Button className="publish-btn" size="mini" onClick={handlePublish} loading={loading}>
          {info ? '修改' : '发布'}
        </Button>
      </View>
      <View className="container">
        <View className="input-list">
          <View className="input-item">
            <Input value={title} placeholder="请输入游记标题" onInput={e => setTitle(e.detail.value)} />
          </View>
          <View className="input-item">
            <Textarea value={content} placeholder="请输入游记内容" onInput={e => setContent(e.detail.value)} rows={10} />
          </View>
        </View>
        <View className="upload-video">
          <Button onClick={uploadVideo}>上传视频</Button>
          {videoUrl && (
            <View>
              <Video src={videoUrl} controls />
              <Image src={closeIcon} className="delete-video" style={{ width: '30px' }} onClick={deleteVideo} />
            </View>
          )}
        </View>
        <View className="upload">
          <View className="upload-top">
            <Text>最多选择9张图片</Text>
            <Text>{imgList.length}/9</Text>
          </View>
          <View className="upload-list">
            {imgList.map((item, idx) => (
              <View className="img-list" key={idx}>
                <Image className="common" src={item} />
                <Image className="delete" src={closeIcon} onClick={() => deleteImg(idx)} />
              </View>
            ))}
            {imgList.length < 9 && (
              <Image className="default" src={uploadIcon} onClick={uploadImg} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
