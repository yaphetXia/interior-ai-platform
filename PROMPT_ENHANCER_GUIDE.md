# 智能提词器使用指南

## 概述

智能提词器是本平台的核心功能之一，能够将用户的简单中文描述自动转换为专业的英文AI图像生成提示词。

## 核心功能

### 1. 图像反推（Image Analysis）

使用Banana API分析上传的图像，自动识别：
- 主要对象和家具
- 光照条件（自然光/人工光、明亮/昏暗、暖色/冷色）
- 色彩搭配和风格
- 空间布局和透视
- 材质和纹理

### 2. 细化描述（Prompt Enhancement）

基于NanoBanana提示词框架，将零散的中文关键词扩写成完整的专业英文提示词。

**输入示例**：
```
替换 椅子 蓝白花 暖色调 自然光 无缝融合
```

**输出示例**：
```
Replace the two identical muted yellow velvet armchairs in the bright modern hotel lobby of Figure 2 with the single blue and white floral patterned armchair from Figure 1. Ensure the new armchair perfectly matches the original scene's bright natural daylight, warm ambient indoor lighting, soft subtle shadows, perspective, and sophisticated warm and neutral color palette, maintaining a seamless and photorealistic integration.
```

### 3. 便于修改

生成的提示词可以直接在文本框中编辑，支持：
- 实时预览
- 一键复制
- 应用到生成

## 使用方法

### 简单模式

1. **上传图像**（可选）
   - 点击"反推图像内容"按钮
   - 系统自动分析图像并提取关键信息

2. **输入需求**
   - 在"输入需求"框中输入中文关键词
   - 例如：`替换 沙发 灰色布艺 现代简约 自然光`

3. **选择参数**
   - 动作：Replace / Add / Transform / Incorporate
   - 对象：自动检测或手动选择

4. **生成提示词**
   - 点击"生成提示词"按钮
   - 系统自动生成完整的英文提示词

5. **应用或修改**
   - 在"最终提示词"框中查看和编辑
   - 点击"应用到生成"使用该提示词

### 高级模式

高级模式提供更精细的控制：

1. **图像分析**
   - 同简单模式，但可以编辑分析结果

2. **用户需求**
   - 输入详细的需求描述

3. **高级参数设置**
   - **动作 (Action)**: Replace / Add / Transform / Incorporate
   - **对象 (Object)**: ceiling / chair / table / carpet 等
   - **光照 (Lighting)**: 
     - bright natural daylight
     - warm ambient indoor lighting
     - soft diffused lighting
     - nighttime ambiance lighting
   - **阴影 (Shadows)**:
     - soft subtle cast shadows
     - subtle cast shadows
     - soft diffused shadows
   - **色彩风格 (Color & Style)**:
     - warm tones
     - neutral palette
     - rich palette
     - Wabi-sabi style
     - Japanese minimalist
   - **融合效果 (Integration)**:
     - seamless integration
     - photorealistic integration
     - seamless and photorealistic integration
   - **摄影表现 (Camera)**:
     - Capture with Nikon D850
     - Professional interior photography look
     - 10 PM ambiance style

4. **生成和修改**
   - 生成后可以在文本框中直接修改
   - 所有参数都可以调整

## 提示词架构

本提词器基于以下架构生成提示词：

```
[Action] the [Object] in [Scene Description] with [Requirement]. 
Ensure the new element perfectly matches the original scene's 
[Lighting], [Shadows], [Perspective], and [Color Style], 
maintaining a [Integration]. [Camera Settings]
```

### 架构要素

1. **动作 (Action)**
   - Replace - 替换现有元素
   - Add - 添加新元素
   - Transform - 转换风格
   - Incorporate - 融入元素

2. **对象 (Object)**
   - 具体的家具或装饰元素
   - 例如：ceiling, chair, table, carpet

3. **场景描述 (Scene)**
   - 从图像分析中获取
   - 描述整体空间和氛围

4. **光影 (Lighting & Shadows)**
   - 确保生成结果与原场景光照一致
   - 包括光源类型、强度、色温

5. **色彩与风格 (Color & Style)**
   - 色彩搭配
   - 设计风格
   - 材质质感

6. **效果要求 (Integration)**
   - seamless - 无缝融合
   - photorealistic - 照片级真实
   - maintain perspective - 保持透视

7. **摄影表现 (Camera)**
   - 可选项
   - 增强专业感

## 优秀提示词案例

### 案例1：天花板替换

```
Replace the black ceiling with its intricate geometric gold-toned lattice pattern in the luxurious and modern hotel lobby of Figure 2 with the striking arched and ribbed white ceiling with a central dark linear element from Figure 1. Ensure the new ceiling perfectly matches the original scene's bright, warm ambient lighting, soft diffused shadows, perspective, and elegant warm and rich color palette, maintaining a seamless and photorealistic integration.
```

**关键点**：
- 详细描述原对象（黑色天花板，金色格子图案）
- 详细描述新对象（拱形白色天花板，中央暗线）
- 明确场景（豪华现代酒店大堂）
- 强调光影匹配（明亮温暖环境光，柔和阴影）
- 要求无缝融合

### 案例2：椅子替换

```
Replace the two identical muted yellow velvet armchairs with dark throw pillows in the luxurious and bright contemporary hotel lobby of Figure 2 with the single blue and white floral patterned armchair with dark wooden frames from Figure 1. Ensure the new armchair perfectly matches the original scene's bright, diffused natural daylight and warm ambient indoor lighting, soft, subtle cast shadows, perspective, and sophisticated warm and neutral color palette, maintaining a seamless and photorealistic integration.
```

**关键点**：
- 数量明确（两把 → 一把）
- 材质描述（天鹅绒 → 花纹布艺）
- 色彩对比（柔黄色 → 蓝白花）
- 光照细节（明亮漫射自然光 + 温暖环境光）

### 案例3：地毯替换

```
Replace the large, plush light-colored carpet with a subtle, embossed organic pattern in the luxurious and expansive modern lobby of Figure 2 with the abstract wavy and distressed pattern in shades of beige, brown, and dark blue from Figure 1. Ensure the new pattern perfectly matches the original scene's bright, natural daylight and soft ambient indoor lighting, soft, subtle shadows cast by the furniture, perspective, and luxurious, bright, and mostly neutral color palette, maintaining a seamless and photorealistic integration.
```

**关键点**：
- 图案描述（浮雕有机图案 → 抽象波浪做旧图案）
- 色彩细节（浅色 → 米色、棕色、深蓝）
- 阴影细节（家具投射的柔和阴影）

### 案例4：桌面装饰替换

```
Replace the large, round, dark-topped table with its thick, light-colored base and the expansive, lush green botanical arrangement featuring some white flowers atop it in the grand, modern luxury lobby with high ceilings and large windows of Figure 2 with the elegant dark marble-top round table with its unique sculptural dark base, lavishly adorned with abundant pastel-colored and white floral arrangements in white textured vases, smaller flower arrangements in clear glass vases, and multiple glowing white pillar candles from Figure 1. Ensure the new centerpiece perfectly matches the original scene's bright, natural daylight and warm ambient indoor lighting, soft subtle cast shadows, perspective, and neutral bright and slightly warm color palette, maintaining a seamless and photorealistic integration.
```

**关键点**：
- 复杂对象的详细描述
- 多个元素的组合（桌子 + 花艺 + 蜡烛）
- 材质对比（深色桌面 → 深色大理石）
- 装饰细节（花瓶材质、蜡烛光效）

## 精简输入词表

### 中文 → 英文映射

#### 动作
- 替换 → Replace
- 添加 → Add
- 转换 → Transform
- 融入 → Incorporate

#### 对象
- 天花板 → ceiling
- 椅子/扶手椅 → chair / armchair
- 地毯 → carpet / rug
- 桌子 → table
- 花艺 → floral arrangement
- 沙发 → sofa
- 灯具 → lamp / chandelier

#### 光影
- 明亮自然光 → bright natural daylight
- 温暖环境光 → warm ambient indoor lighting
- 柔和漫射光 → soft diffused lighting
- 投射阴影 → subtle cast shadows
- 夜间氛围 → nighttime ambiance lighting

#### 色彩风格
- 暖色调 → warm tones
- 中性色调 → neutral palette
- 丰富色调 → rich palette
- 侘寂风 → Wabi-sabi style
- 极简日式 → Japanese minimalist

#### 效果要求
- 无缝融合 → seamless integration
- 保持逼真 → photorealistic integration
- 保持透视 → maintain perspective

## API配置

### Banana API

提词器使用Banana API进行图像反推分析。

**配置步骤**：

1. 访问 [Banana.dev](https://banana.dev/)
2. 注册账户并获取API密钥
3. 在 `.env` 文件中配置：

```env
VITE_BANANA_API_KEY=your_banana_api_key_here
```

### 降级方案

如果Banana API不可用，系统会自动使用降级方案：

1. **GPT-4V分析**
   - 使用OpenAI的视觉模型分析图像
   - 需要配置 `VITE_LLM_API_KEY`

2. **通用描述**
   - 使用预设的通用场景描述
   - 不需要额外配置

## 最佳实践

### 1. 图像质量

- 上传高清图像（推荐1024x1024以上）
- 确保图像清晰，光线充足
- 避免过度压缩

### 2. 关键词输入

- 使用简洁的关键词
- 按照"动作 + 对象 + 特征 + 光影 + 效果"的顺序
- 例如：`替换 椅子 蓝白花 自然光 无缝融合`

### 3. 参数调整

- 根据实际场景选择光照类型
- 注意色彩风格与原图的协调
- 融合效果建议选择"seamless and photorealistic"

### 4. 提示词修改

- 生成后仔细检查提示词
- 根据需要调整细节描述
- 可以添加特定的材质或风格要求

## 常见问题

### Q: 图像分析失败怎么办？

A: 系统会自动使用降级方案。你也可以：
1. 检查网络连接
2. 确认API密钥配置正确
3. 手动输入场景描述

### Q: 生成的提示词不够准确？

A: 可以：
1. 切换到高级模式，手动调整参数
2. 在生成后的文本框中直接编辑
3. 参考案例，学习专业提示词的写法

### Q: 如何提高生成质量？

A: 建议：
1. 使用高质量的参考图像
2. 提供详细的需求描述
3. 选择合适的功能预设
4. 使用遮罩编辑器精准控制区域

### Q: 支持哪些语言？

A: 
- 输入：支持中文关键词
- 输出：自动生成英文提示词
- 系统会自动翻译和扩写

## 技术实现

### 核心组件

- `PromptEnhancer.jsx` - 提词器UI组件
- `bananaService.js` - Banana API服务
- `promptOptimizer.js` - 提示词优化逻辑

### 工作流程

```
用户上传图像
    ↓
Banana API分析
    ↓
提取关键信息（对象、光照、色彩）
    ↓
用户输入需求
    ↓
基于框架生成提示词
    ↓
用户修改和应用
    ↓
调用图像生成API
```

### 数据流

```javascript
// 1. 图像分析
const result = await analyzeBanana(imageUrl)
// result = { description, objects, lighting, colors, style }

// 2. 提取参数
extractKeyInfo(result.description)

// 3. 生成提示词
const prompt = generatePrompt({
  action: 'Replace',
  object: result.objects[0],
  lighting: result.lighting,
  ...
})

// 4. 应用到生成
onPromptGenerated(prompt)
```

## 更新日志

### v1.0.0 (2025-01-15)
- ✅ 初始版本发布
- ✅ 支持Banana API图像反推
- ✅ 简单模式和高级模式
- ✅ 基于NanoBanana框架的提示词生成
- ✅ 便于修改的UI界面
- ✅ 降级方案支持

---

**提示**: 本提词器是平台的核心竞争力，建议深入学习提示词架构，以获得最佳生成效果。

