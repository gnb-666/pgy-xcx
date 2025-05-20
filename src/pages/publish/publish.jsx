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

// 添加页面配置
Publish.config = {
  navigationBarTitleText: '发布游记',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  enablePullDownRefresh: false,
  navigationStyle: 'default',
  // 自定义返回按钮行为
  onBackPress: () => {
    Taro.navigateBack({
      delta: 1
    });
    return true; // 返回true表示拦截默认返回行为
  }
};

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgList, setImgList] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [beautifying, setBeautifying] = useState(false);

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
    // 先清空所有状态
    setTitle('');
    setContent('');
    setImgList([]);
    setVideoUrl('');
    setInfo(null);
    
    // 使用navigateBack返回上一页
    Taro.navigateBack({
      delta: 1
    });
  };

  // 美化文本内容
  const beautifyContent = async () => {
    if (!content) {
      Taro.showToast({ title: '请先输入游记内容!', icon: 'none' });
      return;
    }
    
    setBeautifying(true);
    try {
      const res = await Taro.request({
        url: 'http://localhost:3001/beautifyText',
        method: 'POST',
        data: {
          text: content
        }
      });
      
      if (res.data && res.data.success && res.data.beautifiedText) {
        // 直接更新内容，不使用setTimeout
        setContent(res.data.beautifiedText);
        Taro.showToast({ title: '文本美化成功!', icon: 'success' });
      } else {
        Taro.showToast({ title: '文本美化失败!', icon: 'none' });
      }
    } catch (error) {
      console.error('美化文本失败:', error);
      Taro.showToast({ title: '文本美化失败!', icon: 'none' });
    } finally {
      setBeautifying(false);
    }
  };

  // 发布
  const handlePublish = async () => {
    if (!title || !content) {
      Taro.showToast({ title: '标题和内容不能为空!', icon: 'none' });
      return;
    }
    if (!imgList || imgList.length === 0) {
      Taro.showToast({ title: '请上传至少一张图片!', icon: 'none' });
      return;
    }
    setLoading(true);
    try {
      const userInfo = Taro.getStorageSync('userInfo');
      const res = await Taro.request({
        url: 'http://localhost:3001/publishTravelNote',
        method: 'POST',
        data: {
          id: info?._id,
          title,
          content,
          imgList,
          openid: userInfo._id,
          videoUrl
        }
      });
      
      if (res.data && res.data.message === 'Success') {
        // 先清空所有状态
        setTitle('');
        setContent('');
        setImgList([]);
        setVideoUrl('');
        setInfo(null);
        
        Taro.showToast({ 
          title: info ? '修改成功!' : '发布成功!', 
          icon: 'success',
          duration: 1500
        });
        
        // 使用setTimeout确保Toast显示完成后再跳转
        setTimeout(() => {
          // 使用navigateTo替代switchTab
          Taro.navigateTo({
            url: '/pages/myPosts/myPosts',
            success: () => {
              console.log('跳转成功');
            },
            fail: (error) => {
              console.error('跳转失败:', error);
              // 如果navigateTo失败，尝试使用redirectTo
              Taro.redirectTo({
                url: '/pages/myPosts/myPosts'
              });
            }
          });
        }, 1500);
      } else {
        Taro.showToast({ title: info ? '修改失败!' : '发布失败!', icon: 'none' });
      }
    } catch (error) {
      console.error('发布失败:', error);
      Taro.showToast({ title: info ? '修改失败!' : '发布失败!', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  // 清空内容
  const clearContent = () => {
    setContent("");
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
            <Textarea
              className="content-input"
              placeholder="请输入游记内容"
              value={content}
              onInput={e => setContent(e.detail.value)}
              autoHeight
              maxlength={-1}
              showConfirmBar={false}
              adjustPosition={false}
              cursorSpacing={20}
              holdKeyboard={true}
              enableNative={true}
              fixed={true}
            />
            <Button 
              className="beautify-btn" 
              onClick={beautifyContent}
              disabled={beautifying}
            >
              {beautifying ? '美化中...' : '一键美化文本'}
            </Button>
          </View>
        </View>
        <View className="upload-video">
          <Button onClick={uploadVideo}>上传视频</Button>
          {videoUrl && (
            <View>
              <Video src={videoUrl} controls />
              <Image src={closeIcon} className="delete-video-btn" mode="aspectFit" onClick={deleteVideo} />
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
