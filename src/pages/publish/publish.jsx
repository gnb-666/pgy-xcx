import {
  View,
  Text,
  Input,
  Button,
  Image,
  Video,
  Textarea,
} from "@tarojs/components";
import { useState } from "react";
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
          url: 'http://127.0.0.1:3001/uploadImg',
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
        url: 'http://127.0.0.1:3001/uploadVideo',
        filePath: res.tempFilePath,
        name: 'video',
      });
      const data = JSON.parse(uploadRes.data);
      if (data && data.path) setVideoUrl(data.path);
    }
  };

  // 删除视频
  const deleteVideo = () => setVideoUrl("");

  // 发布
  const toPublish = async () => {
    if (!title) {
      Taro.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    if (title.length > 10) {
      Taro.showToast({ title: '标题长度小于等于10个字符', icon: 'none' });
      return;
    }
    if (!content) {
      Taro.showToast({ title: '请填写游记内容', icon: 'none' });
      return;
    }
    if (imgList.length === 0) {
      Taro.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }
    setLoading(true);
    const params = {
      openid: Taro.getStorageSync('userInfo')._id,
      title,
      content,
      imgList,
      videoUrl,
      time: Date.now(),
    };
    const res = await Taro.request({
      url: 'http://127.0.0.1:3001/publishTravelNote',
      method: 'POST',
      data: params,
    });
    setLoading(false);
    if (res.data && res.data.message === 'Success') {
      Taro.showToast({ title: '发布成功!', icon: 'none' });
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/myPosts/myPosts' });
      }, 1000);
    } else {
      Taro.showToast({ title: '操作失败!', icon: 'none' });
    }
  };

  return (
    <View className="body">
      <View className="top">
        {/* <Text onClick={() => Taro.navigateBack()}>返回</Text> */}
        <Button className="publish-btn" size="mini" onClick={toPublish} loading={loading}>发布</Button>
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
