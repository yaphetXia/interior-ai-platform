# AI室内设计图像生成平台

专为中国室内设计师打造的AI创作平台，基于Google Imagen 2.5/3.0等先进AI模型，提供专业的图像生成功能。

## ✨ 核心功能

### 🎨 专业功能预设
- **通用生成** - 从文字描述生成高质量效果图
- **家具替换** - 智能识别并替换家具，保持光影效果
- **白膜出图** - 3D白模快速生成真实材质渲染图
- **线稿出图** - 手绘草图秒变专业效果图
- **排版转效果图** - 平面布局图生成3D效果图
- **局部调整** - 精准编辑图像的特定区域

### 🖌️ 遮罩编辑器
- 画笔工具绘制需要替换的区域
- 可调节画笔大小（5-100px）
- 支持擦除和重做
- 实时预览遮罩效果

### 📤 批量上传
- 支持同时上传最多10张图片
- 拖拽上传，操作便捷
- 批量处理多个设计方案

### 🤖 智能提示词优化
- 自动将中文描述转换为专业英文提示词
- 针对不同功能预设优化提示词策略
- 内置负面提示词，提升生成质量

### 🎬 生态整合
- 图像转视频（对接可灵/混元）
- 图像转3D模型（对接Luma等）
- 一站式创作流程

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 配置API密钥

1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 在 `.env` 文件中填入你的API密钥：
```env
# 图像生成API（选择一个）
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_STABILITY_API_KEY=your_stability_api_key

# 提示词优化LLM
VITE_LLM_API_KEY=your_llm_api_key
VITE_LLM_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_MODEL=gpt-4

# 可选：视频和3D生成
VITE_VIDEO_API_KEY=your_video_api_key
VITE_3D_API_KEY=your_3d_api_key
```

3. 在 `src/services/apiConfig.js` 中选择API提供商：
```javascript
const DEFAULT_CONFIG = {
  provider: API_PROVIDERS.GOOGLE_IMAGEN, // 修改为你的提供商
  // ...
}
```

### 开发模式

```bash
pnpm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
pnpm run build
```

构建产物在 `dist/` 目录

### 预览生产版本

```bash
pnpm run preview
```

## 📖 API集成指南

详细的API集成说明请查看 [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

支持的API提供商：
- ✅ Google Imagen 2.5/3.0
- ✅ OpenAI DALL-E 3
- ✅ Stability AI SDXL
- ✅ 自定义API（ComfyUI、Fooocus等）

## 🎨 配色方案

平台采用渐变色系设计，主题色提取自用户提供的配色图：
- **主色（Primary）**: 紫蓝色 #8c8cb4
- **副色（Secondary）**: 粉紫色 #b4788c
- **强调色（Accent）**: 金黄色 #dcc878

支持深色和浅色主题自动切换。

## 📁 项目结构

```
interior-ai-platform/
├── src/
│   ├── components/          # React组件
│   │   ├── ui/             # UI基础组件（shadcn/ui）
│   │   ├── MaskEditor.jsx  # 遮罩编辑器
│   │   └── MultiImageUpload.jsx  # 多图上传
│   ├── pages/              # 页面组件
│   │   ├── LandingPage.jsx    # 首页
│   │   ├── WorkspacePage.jsx  # 工作台
│   │   ├── ProjectsPage.jsx   # 项目管理
│   │   ├── HistoryPage.jsx    # 历史记录
│   │   ├── AboutPage.jsx      # 关于我们
│   │   └── SettingsPage.jsx   # 账户设置
│   ├── services/           # 业务逻辑
│   │   ├── apiConfig.js       # API配置
│   │   ├── promptOptimizer.js # 提示词优化
│   │   └── imageGenerator.js  # 图像生成
│   ├── App.jsx             # 主应用
│   ├── App.css             # 全局样式
│   └── main.jsx            # 入口文件
├── public/                 # 静态资源
├── .env.example           # 环境变量示例
├── API_INTEGRATION_GUIDE.md  # API集成指南
└── README.md              # 项目说明
```

## 🛠️ 技术栈

- **框架**: React 18 + Vite
- **路由**: React Router v6
- **样式**: Tailwind CSS v4
- **UI组件**: shadcn/ui
- **图标**: Lucide Icons
- **状态管理**: React Hooks
- **HTTP请求**: Fetch API

## 🔒 安全建议

### 生产环境部署

⚠️ **重要**: 不要在前端直接暴露API密钥！

推荐方案：
1. 使用后端代理转发API请求
2. 在服务器端管理API密钥
3. 实现用户认证和授权
4. 设置请求频率限制

### 示例后端代理（Node.js + Express）

```javascript
const express = require('express')
const app = express()

app.post('/api/generate', async (req, res) => {
  const { prompt, preset } = req.body
  
  // 在服务器端调用AI API
  const result = await fetch('https://api.example.com/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}` // 服务器端密钥
    },
    body: JSON.stringify({ prompt, preset })
  })
  
  const data = await result.json()
  res.json(data)
})
```

## 📊 功能路线图

### ✅ 已完成
- [x] 基础UI框架
- [x] 遮罩编辑器
- [x] 多图上传
- [x] 6种专业功能预设
- [x] 智能提示词优化
- [x] API集成层
- [x] 项目管理
- [x] 历史记录
- [x] 账户设置

### 🚧 开发中
- [ ] 用户认证系统
- [ ] 支付集成
- [ ] 云端存储
- [ ] 协作功能

### 📅 计划中
- [ ] 移动端适配
- [ ] 插件系统
- [ ] API开放平台
- [ ] 企业私有化部署

## 💰 商业模式

### 订阅套餐
- **免费版**: ¥0/月 - 10次/月，基础功能
- **基础版**: ¥99/月 - 200次/月，所有预设
- **专业版**: ¥299/月 - 600次/月，视频+3D
- **企业版**: ¥1999/月起 - 无限次数，API访问

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 开源协议

MIT License

## 📞 联系我们

- 邮箱: contact@aidesign.com
- 电话: 400-888-8888
- 地址: 北京市朝阳区xxx大厦

---

**注意**: 本项目为演示版本，实际使用需要配置真实的API密钥和后端服务。

