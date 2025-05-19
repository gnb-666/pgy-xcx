# 旅游日记小程序

基于Taro + React开发的旅游记录与分享平台，帮助用户记录精彩旅途，探索他人的旅行故事。

## 主要功能

- 📱 浏览精选旅游日记
- 🔍 搜索游记和用户
- 📝 发布个人旅行体验
- 👤 个性化个人中心管理
- 🖼️ 丰富图文展示效果

## 技术架构

- **前端**：Taro 3.x + React + Less
- **后端**：Node.js + MongoDB

## 快速开始

### 环境准备

- Node.js 12.0+
- 微信开发者工具

### 安装运行

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev:weapp

# 生产环境构建
npm run build:weapp
```

### 开发流程

1. 安装依赖后，运行开发服务
2. 打开微信开发者工具，导入项目
3. 修改代码，实时预览效果

## 接口说明

项目使用以下核心API：

- `getTravelNotes` - 获取首页游记列表
- `getTravelNoteDetail` - 获取游记详情
- `searchTravelNotes` - 搜索游记
- `publishTravelNote` - 发布新游记
- `uploadImg` - 上传图片资源
- `getMyPublish` - 获取个人发布记录

> 后端服务基准地址：`http://localhost:3001/`

## 项目结构

```
travel/
├── src/                # 源代码
│   ├── pages/         # 页面组件
│   ├── components/    # 公共组件
│   ├── assets/        # 静态资源
│   ├── app.config.js  # 全局配置
│   └── app.js         # 入口文件
└── config/            # 项目配置
```

## 常见问题

**依赖安装失败？**
```bash
npm install --legacy-peer-deps
```

**启动失败？**
```bash
# 尝试更换端口
npm run dev:weapp --port=另一个端口号
```

## 版本信息

- v1.0.0 (2024-05) - 初始版本，实现核心功能 