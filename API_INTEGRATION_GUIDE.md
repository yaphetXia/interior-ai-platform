# API集成指南

本文档详细说明如何将真实的AI图像生成API集成到平台中。

## 快速开始

### 1. 配置API密钥

复制环境变量示例文件：

```bash
cp .env.example .env
```

在 `.env` 文件中填入你的API密钥。

### 2. 选择API提供商

在 `src/services/apiConfig.js` 中修改 `provider` 字段：

```javascript
const DEFAULT_CONFIG = {
  provider: API_PROVIDERS.GOOGLE_IMAGEN, // 修改为你想使用的提供商
  // ...
}
```

支持的提供商：
- `GOOGLE_IMAGEN` - Google Imagen 2.5/3.0
- `OPENAI_DALLE` - OpenAI DALL-E 3
- `STABILITY_AI` - Stability AI SDXL
- `CUSTOM` - 自定义API

### 3. 测试API连接

在工作台页面上传图片并输入描述，点击"生成图像"按钮测试。

## API提供商详细配置

### Google Imagen

**获取API密钥：**
1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 创建项目并启用Imagen API
3. 生成API密钥

**配置示例：**
```javascript
googleImagen: {
  apiKey: 'AIza...',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict',
  model: 'imagen-3.0-generate-001'
}
```

**支持功能：**
- ✅ 文生图
- ✅ 图生图
- ✅ 遮罩编辑（Inpainting）
- ✅ 负面提示词
- ✅ 批量生成

### OpenAI DALL-E 3

**获取API密钥：**
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建API密钥

**配置示例：**
```javascript
openai: {
  apiKey: 'sk-...',
  endpoint: 'https://api.openai.com/v1/images/generations',
  model: 'dall-e-3'
}
```

**支持功能：**
- ✅ 文生图
- ❌ 图生图（需使用DALL-E 2）
- ❌ 遮罩编辑
- ✅ 提示词优化

**注意事项：**
- DALL-E 3每次只能生成1张图
- 支持的尺寸：1024x1024, 1024x1792, 1792x1024

### Stability AI

**获取API密钥：**
1. 访问 [Stability AI Platform](https://platform.stability.ai/)
2. 创建账户并获取API密钥

**配置示例：**
```javascript
stabilityAI: {
  apiKey: 'sk-...',
  endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
  model: 'stable-diffusion-xl-1024-v1-0'
}
```

**支持功能：**
- ✅ 文生图
- ✅ 图生图
- ✅ 遮罩编辑
- ✅ 负面提示词
- ✅ 高级参数控制

### 自定义API

如果你使用自建的图像生成服务（如ComfyUI、Fooocus等），可以使用自定义API配置。

**配置示例：**
```javascript
custom: {
  apiKey: 'your-api-key',
  endpoint: 'https://your-domain.com/api/generate',
  model: 'your-model-name'
}
```

**请求格式：**
```json
{
  "prompt": "优化后的英文提示词",
  "negative_prompt": "负面提示词",
  "width": 1024,
  "height": 1024,
  "num_images": 1,
  "image": "base64编码的图像（可选）",
  "mask": "base64编码的遮罩（可选）"
}
```

**响应格式：**
```json
{
  "images": [
    {
      "url": "图像URL或base64"
    }
  ]
}
```

## 提示词优化LLM配置

平台使用LLM将用户的中文描述转换为专业的英文提示词。

### 使用OpenAI GPT-4

```env
VITE_LLM_API_KEY=sk-...
VITE_LLM_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_LLM_MODEL=gpt-4
```

### 使用自定义LLM

任何兼容OpenAI API格式的LLM都可以使用：

```env
VITE_LLM_API_KEY=your-key
VITE_LLM_ENDPOINT=https://your-llm-endpoint.com/v1/chat/completions
VITE_LLM_MODEL=your-model
```

支持的LLM：
- OpenAI GPT-4/GPT-3.5
- Azure OpenAI
- Claude (通过兼容层)
- 本地部署的LLaMA、Qwen等

## 视频生成集成

### 可灵 (Kuaishou Kolors)

```env
VITE_VIDEO_API_KEY=your-kuaishou-api-key
VITE_VIDEO_API_ENDPOINT=https://api.kuaishou.com/video/generate
```

### 混元 (Tencent Hunyuan)

```env
VITE_VIDEO_API_KEY=your-hunyuan-api-key
VITE_VIDEO_API_ENDPOINT=https://api.hunyuan.tencent.com/video/generate
```

## 3D模型生成集成

### Luma AI

```env
VITE_3D_API_KEY=your-luma-api-key
VITE_3D_API_ENDPOINT=https://api.lumalabs.ai/generate
```

## 代码集成示例

### 在React组件中使用

```javascript
import { generateImage } from '@/services/imageGenerator'

// 生成图像
const handleGenerate = async () => {
  try {
    const result = await generateImage({
      prompt: '现代简约客厅，浅色木地板',
      preset: 'general',
      width: 1024,
      height: 1024,
      numImages: 1
    })
    
    console.log('生成的图像:', result.images)
  } catch (error) {
    console.error('生成失败:', error)
  }
}
```

### 带遮罩的图像生成

```javascript
const result = await generateImage({
  prompt: '替换为灰色布艺沙发',
  preset: 'furniture',
  image: uploadedImageBase64,
  mask: maskDataBase64,
  width: 1024,
  height: 1024
})
```

### 批量生成

```javascript
import { batchGenerateImages } from '@/services/imageGenerator'

const requests = [
  { prompt: '现代客厅', preset: 'general' },
  { prompt: '新中式卧室', preset: 'general' },
  { prompt: '北欧餐厅', preset: 'general' }
]

const results = await batchGenerateImages(requests)
```

## 错误处理

所有API调用都应该包含错误处理：

```javascript
try {
  const result = await generateImage(params)
  // 处理成功结果
} catch (error) {
  if (error.message.includes('API密钥')) {
    // 提示用户配置API密钥
  } else if (error.message.includes('额度')) {
    // 提示用户额度不足
  } else {
    // 其他错误
  }
}
```

## 性能优化建议

1. **并发控制**：限制同时发起的API请求数量
2. **缓存结果**：对相同的提示词缓存生成结果
3. **队列管理**：使用队列系统管理大量请求
4. **降级策略**：API失败时使用备用方案

## 成本控制

1. **设置额度限制**：在用户账户中设置月度额度
2. **监控使用情况**：记录每次API调用的成本
3. **优化提示词**：减少不必要的重新生成
4. **使用缓存**：避免重复生成相同内容

## 安全建议

1. **API密钥保护**：
   - ❌ 不要将API密钥提交到Git
   - ✅ 使用环境变量
   - ✅ 在生产环境使用后端代理

2. **请求验证**：
   - 验证用户输入
   - 限制请求频率
   - 检查内容安全性

3. **数据隐私**：
   - 不要将用户数据发送到未授权的服务
   - 遵守数据保护法规

## 故障排查

### API密钥无效
- 检查 `.env` 文件是否正确配置
- 确认API密钥有效且有足够额度
- 检查API提供商的服务状态

### 生成失败
- 查看浏览器控制台的错误信息
- 检查网络连接
- 确认提示词符合API要求

### 提示词优化失败
- 检查LLM API配置
- 使用降级方案（简单翻译）

## 联系支持

如有问题，请：
1. 查看 [常见问题文档](./FAQ.md)
2. 提交 [GitHub Issue](https://github.com/your-repo/issues)
3. 联系技术支持：support@example.com

