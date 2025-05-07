import { View, Text } from "@tarojs/components";

// 虚拟的旅游日记数据
const travelDiaries = [
  { id: 1, title: '第一次旅行', content: '这是我第一次旅行，非常开心！' },
  { id: 2, title: '海边之旅', content: '海边的风景真美，下次还来！' },
];

export default function MyPosts() {
  return (
    <View>
      <Text>我的发布</Text>
      {travelDiaries.map(diary => (
        <View key={diary.id}>
          <Text>{diary.title}</Text>
          <Text>{diary.content}</Text>
        </View>
      ))}
    </View>
  );
}