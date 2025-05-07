import {
  View,
  Text,
  Input,
  Button,
  Image,
  Video,
  Picker,
} from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import "./publish.less";
import addImg from "../../assets/images/add.png";
import pubPicture from "../../assets/images/upload.png";
import positionImg from "../../assets/images/position.png"; // 引入位置图片

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [topic, setTopic] = useState("");
  const [location, setLocation] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaUpload = async () => {
    try {
      const res = await Taro.chooseMedia({
        count: 3 - (images.length + videos.length),
        mediaType: ["image", "video"],
      });
      if (res.errMsg === 'chooseMedia:ok') {
        console.log("选择的媒体文件:", res.tempFiles);
  
        const newImages = [...images];
        const newVideos = [...videos];
  
        res.tempFiles.forEach((file) => {
          const filePath = file.tempFilePath || file.path; // ✅ 兼容路径
          if (file.fileType === "image") {
            console.log("即将添加的图片路径:", filePath);
            newImages.push(filePath);
          } else if (file.fileType === "video") {
            if (newVideos.length === 0) {
              newVideos.push(filePath);
            } else {
              Taro.showToast({
                title: "只能上传一个视频",
                icon: "none",
              });
            }
          }
        });
  
        setImages(newImages);
        setVideos(newVideos);
  
        console.log("更新后的图片状态:", newImages);
        console.log("更新后的视频状态:", newVideos);
      }
    } catch (error) {
      if (error.errMsg !== 'chooseMedia:fail cancel') {
        console.error("选择媒体出错:", error);
        Taro.showToast({
          title: "选择媒体出错",
          icon: "none",
        });
      }
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const topicRange = ["#旅行", "#美食", "#生活", "#时尚"];

  const handleTopicChange = (e) => {
    const index = e.detail.value;
    const selectedTopic = topicRange[index];
    setTopic(selectedTopic);
  };

  const locationRange = ["北京", "上海", "广州", "深圳"];

  const handleLocationChange = (e) => {
    const index = e.detail.value;
    const selectedLocation = locationRange[index];
    setLocation(selectedLocation);
  };

  const handleSubmit = () => {
    console.log("标题:", title);
    console.log("内容:", content);
    console.log("图片:", images);
    console.log("视频:", videos);
    console.log("话题:", topic);
    console.log("位置:", location);
    Taro.showToast({
      title: "发布成功",
      icon: "success",
    });
  };

  return (
    <View className="publish-container">
      <View className="publish-item">
        <Input
          className="title-input"
          placeholder="请输入标题（最多20字）"
          value={title}
          onInput={handleTitleChange}
          maxLength={20}
        />
        <Input
          className="content-input"
          placeholder="分享你的精彩瞬间..."
          value={content}
          onInput={handleContentChange}
          multiline
        />
      </View>

      {/* 添加图片上传标题 */}
      <Text className="upload-title">图片/视频上传</Text>
      <View className="publish-item">
        <View className="preview-media">
          {images.map((image, index) => (
            <View key={index} className="media-item">
              <Image src={image} mode="aspectFit" className="preview-image" />
              <Text
                className="delete-button"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </Text>
            </View>
          ))}
          <Image
            src={pubPicture}
            mode="aspectFit"
            className="upload-media-image"
            onClick={handleMediaUpload}
          />
          {videos.map((video, index) => (
            <View key={index} className="media-item">
              <Video src={video} controls className="preview-video" />
              <Text
                className="delete-button"
                onClick={() => handleRemoveVideo(index)}
              >
                ×
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="topic-location-container">
        <View className="publish-item">
          <Picker
            mode="selector"
            range={topicRange}
            onChange={handleTopicChange}
          >
            <View className="picker">
              <Text>#话题: {topic || "请选择"}</Text>
            </View>
          </Picker>
        </View>
        <View className="publish-item">
          <Picker
            mode="selector"
            range={["北京", "上海", "广州", "深圳"]}
            onChange={handleLocationChange}
          >
            <View className="picker">
              <Image
                src={positionImg}
                mode="aspectFit"
                className="position-icon"
              />
              <Text>位置: {location || "请选择"}</Text>
            </View>
          </Picker>
        </View>
      </View>

      <Button className="submit-button" onClick={handleSubmit}>
        发布笔记
      </Button>
    </View>
  );
}
