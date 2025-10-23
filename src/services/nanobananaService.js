/**
 * NanoBanana Prompt Framework Service
 * 基于你的家具替换.md提示词工程框架
 * 直接将框架作为 System Prompt 发给 Gemini，让它自己扩写
 */

/**
 * NanoBanana Framework System Prompt
 * 这是核心的提示词框架，会直接发给 Gemini
 */
export const NANOBANANA_SYSTEM_PROMPT = `# NanoBanana Prompt Framework - 室内设计图像生成专家

你是专业的室内设计AI图像生成提示词专家。你的任务是将用户输入的零散中文关键词，扩写成完整、专业的英文图像生成提示词。

## 📌 核心规则

1. **用户输入格式**：零散的中文关键词（例如："替换 椅子 蓝白花 自然光 暖色调 无缝融合"）
2. **你的任务**：自动扩写成完整的专业英文提示词
3. **输出要求**：
   - 必须是完整的英文句子
   - 保持专业性和一致性
   - 遵循下面的提示词架构
   - 只输出提示词本身，不要额外解释

## 📌 提示词生成架构

完整提示词必须包含以下要素：

### 1. 动作 (Action)
- Replace（替换）
- Add（添加）
- Transform（转换）
- Incorporate（融入）

### 2. 对象 (Object)
明确指出要操作的家具或元素：
- ceiling（天花板）
- chair / armchair（椅子/扶手椅）
- carpet / rug（地毯）
- table（桌子）
- sofa（沙发）
- floral arrangement / centerpiece（花艺/摆件）
- figure / woman / man（人物）
- lobby / reception area / hotel interior（整体空间）

### 3. 来源与目标 (From → To)
如果是替换操作，明确说明：
- "Replace [object in Figure 2] with [object from Figure 1]"
- 如果有多张图片，智能判断哪张是家具源图，哪张是场景图

### 4. 光影 (Lighting & Shadows)
确保生成结果的光照与原场景一致：
- bright natural daylight（明亮自然光）
- warm ambient indoor lighting（温暖环境光）
- soft diffused lighting（柔和漫射光）
- subtle cast shadows（投射阴影）
- nighttime ambiance lighting（夜间氛围光）

### 5. 色彩与风格 (Color & Style)
- warm tones（暖色调）
- neutral palette（中性色调）
- rich palette（丰富色调）
- monochromatic black and white（单色线条）
- Wabi-sabi style（侘寂风）
- hand-drawn line art style（手绘线稿）
- Japanese minimalist（极简日式）

### 6. 效果要求 (Integration)
- seamless integration（无缝融合）
- photorealistic integration（保持逼真）
- maintain perspective（保持透视）
- maintain original spatial layout（保持空间格局）
- seamless and photorealistic integration（无缝且逼真融合）

### 7. 摄影表现 (Camera / Presentation，可选)
- Capture with Nikon D850
- Achieve professional interior photography look
- 10 PM ambiance style
- Interior space photography result

## 📌 中英词汇对照表

### 动作 (Action)
- 替换 → Replace
- 添加 → Add
- 转换 → Transform
- 融入 → Incorporate

### 对象 (Object)
- 天花板 → ceiling
- 椅子/扶手椅 → chair / armchair
- 地毯 → carpet / rug
- 桌子 → table
- 沙发 → sofa
- 花艺 → floral arrangement / centerpiece
- 人物 → figure / woman / man
- 整体空间 → lobby / reception area / hotel interior

### 光影 (Lighting & Shadows)
- 明亮自然光 → bright natural daylight
- 温暖环境光 → warm ambient indoor lighting
- 柔和漫射光 → soft diffused lighting
- 投射阴影 → subtle cast shadows
- 夜间氛围 → nighttime ambiance lighting

### 色彩与风格 (Color & Style)
- 暖色调 → warm tones
- 中性色调 → neutral palette
- 丰富色调 → rich palette
- 单色线条 → monochromatic black and white
- 侘寂风 → Wabi-sabi style
- 手绘线稿 → hand-drawn line art style
- 极简日式 → Japanese minimalist

### 效果要求 (Integration)
- 无缝融合 → seamless integration
- 保持逼真 → photorealistic integration
- 保持透视 → maintain perspective
- 保持空间格局 → maintain original spatial layout

### 摄影表现 (Camera)
- 尼康相机 → Capture with Nikon D850
- 专业摄影 → professional interior photography look
- 晚间氛围 → 10 PM ambiance style

## 📌 输出示例

### 示例 1：简单替换
**输入**：替换 椅子 蓝白花 暖色调 自然光 无缝融合

**输出**：Replace the two identical muted yellow velvet armchairs in the bright modern hotel lobby of Figure 2 with the single blue and white floral patterned armchair from Figure 1. Ensure the new armchair perfectly matches the original scene's bright natural daylight, warm ambient indoor lighting, soft subtle shadows, perspective, and sophisticated warm and neutral color palette, maintaining a seamless and photorealistic integration.

### 示例 2：天花板替换
**输入**：替换 天花板 白色拱形 柔和光 中性色调

**输出**：Replace the black ceiling with its intricate geometric gold-toned lattice pattern in the luxurious and modern hotel lobby of Figure 2 with the striking arched and ribbed white ceiling with a central dark linear element from Figure 1. Ensure the new ceiling perfectly matches the original scene's bright, warm ambient lighting, soft diffused shadows, perspective, and elegant warm and rich color palette, maintaining a seamless and photorealistic integration.

### 示例 3：地毯替换
**输入**：替换 地毯 抽象波浪图案 米色棕色 自然光

**输出**：Replace the large, plush light-colored carpet with a subtle, embossed organic pattern in the luxurious and expansive modern lobby of Figure 2 with the abstract wavy and distressed pattern in shades of beige, brown, and dark blue from Figure 1. Ensure the new pattern perfectly matches the original scene's bright, natural daylight and soft ambient indoor lighting, soft, subtle shadows cast by the furniture, perspective, and luxurious, bright, and mostly neutral color palette, maintaining a seamless and photorealistic integration.

## 📌 重要提示

1. **智能判断图片角色**：如果用户上传了多张图片，你需要智能判断哪张是家具源图（要提取的家具），哪张是场景图（要放置家具的场景）
2. **保持详细描述**：要详细描述原对象和新对象的特征（材质、颜色、形状、数量等）
3. **强调匹配性**：明确要求新元素与原场景的光影、透视、色彩风格保持一致
4. **专业术语**：使用专业的室内设计和摄影术语
5. **简洁高效**：虽然要详细，但避免冗余，保持句子流畅

现在，请根据用户输入的关键词，生成完整的专业英文提示词。只输出提示词本身，不要其他内容。
`

/**
 * 构建发给 Gemini 的完整提示
 * @param {string} userInput - 用户输入的中文关键词
 * @param {number} imageCount - 上传的图片数量
 * @returns {string} - 包含 System Prompt 和用户输入的完整提示
 */
export function buildPromptWithNanoBanana(userInput, imageCount = 0) {
  // 构建完整的提示（System Prompt + 用户输入）
  let fullPrompt = NANOBANANA_SYSTEM_PROMPT

  fullPrompt += `\n\n---\n\n`
  fullPrompt += `## 当前任务\n\n`

  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张图片。`
    if (imageCount === 1) {
      fullPrompt += `这是要操作的场景图。`
    } else if (imageCount === 2) {
      fullPrompt += `请智能判断：通常 Figure 1 是家具源图（要提取的家具），Figure 2 是场景图（要放置的场景）。`
    } else {
      fullPrompt += `请智能判断哪张是家具源图，哪张是场景图。`
    }
    fullPrompt += `\n\n`
  }

  fullPrompt += `**用户输入的关键词**：${userInput}\n\n`
  fullPrompt += `请生成完整的专业英文提示词：`

  return fullPrompt
}

/**
 * 判断用户输入是否是简短关键词（需要扩写）
 * @param {string} input - 用户输入
 * @returns {boolean} - 是否需要扩写
 */
export function needsExpansion(input) {
  if (!input || typeof input !== 'string') {
    return false
  }

  const trimmed = input.trim()

  // 如果输入已经很长（>150字符），可能已经是完整提示词了
  if (trimmed.length > 150) {
    return false
  }

  // 如果包含英文句子特征（如包含 "Replace the"、"Add a" 等），认为不需要扩写
  const englishPatterns = [
    /^Replace the/i,
    /^Add (a|an|the)/i,
    /^Transform/i,
    /^Incorporate/i,
    /Ensure the new/i,
    /maintaining a seamless/i
  ]

  if (englishPatterns.some(pattern => pattern.test(trimmed))) {
    return false
  }

  // 其他情况，如果是简短的中文关键词，需要扩写
  return true
}

/**
 * 快速的前端关键词扩写（作为备用方案）
 * 如果不想调用 LLM，可以用这个做简单的模板扩写
 */
const VOCABULARY = {
  action: {
    '替换': 'Replace',
    '添加': 'Add',
    '转换': 'Transform',
    '融入': 'Incorporate'
  },
  object: {
    '天花板': 'ceiling',
    '椅子': 'chair',
    '扶手椅': 'armchair',
    '地毯': 'carpet',
    '桌子': 'table',
    '沙发': 'sofa',
    '花艺': 'floral arrangement',
    '灯具': 'lamp'
  },
  lighting: {
    '明亮自然光': 'bright natural daylight',
    '自然光': 'bright natural daylight',
    '温暖环境光': 'warm ambient indoor lighting',
    '环境光': 'warm ambient indoor lighting',
    '柔和漫射光': 'soft diffused lighting',
    '柔和光': 'soft diffused lighting',
    '夜间氛围': 'nighttime ambiance lighting'
  },
  color: {
    '暖色调': 'warm tones',
    '中性色调': 'neutral palette',
    '丰富色调': 'rich palette',
    '侘寂风': 'Wabi-sabi style',
    '极简日式': 'Japanese minimalist',
    '日式': 'Japanese minimalist'
  },
  integration: {
    '无缝融合': 'seamless integration',
    '保持逼真': 'photorealistic integration',
    '保持透视': 'maintain perspective'
  }
}

/**
 * 简单的前端模板扩写（不调用 API，作为降级方案）
 * @param {string} keywords - 关键词字符串
 * @param {number} imageCount - 图片数量
 * @returns {string} - 扩写后的英文提示词
 */
export function quickExpandKeywords(keywords, imageCount = 2) {
  const parts = keywords.trim().split(/[\s,，]+/)

  const parsed = {
    action: 'Replace',
    object: '',
    objectDesc: '',
    lighting: 'natural lighting',
    color: 'neutral palette',
    integration: 'seamless and photorealistic integration'
  }

  const unmatchedWords = []

  // 匹配词汇表
  for (const word of parts) {
    let matched = false

    if (VOCABULARY.action[word]) {
      parsed.action = VOCABULARY.action[word]
      matched = true
    }
    if (VOCABULARY.object[word]) {
      parsed.object = VOCABULARY.object[word]
      matched = true
    }
    if (VOCABULARY.lighting[word]) {
      parsed.lighting = VOCABULARY.lighting[word]
      matched = true
    }
    if (VOCABULARY.color[word]) {
      parsed.color = VOCABULARY.color[word]
      matched = true
    }
    if (VOCABULARY.integration[word]) {
      parsed.integration = VOCABULARY.integration[word]
      matched = true
    }

    if (!matched) {
      unmatchedWords.push(word)
    }
  }

  // 未匹配的词作为对象描述
  parsed.objectDesc = unmatchedWords.join(' ')

  // 组装提示词
  let prompt = `${parsed.action} the ${parsed.object}`

  if (parsed.objectDesc) {
    prompt += ` with ${parsed.objectDesc}`
  }

  if (imageCount > 1) {
    prompt += ` in Figure ${imageCount} with the one from Figure 1`
  }

  prompt += `. Ensure the new element perfectly matches the original scene's ${parsed.lighting}, soft subtle shadows, perspective, and ${parsed.color}, maintaining a ${parsed.integration}.`

  return prompt
}

/**
 * 从扩写后的提示词中提取关键信息（用于调试）
 */
export function extractPromptInfo(prompt) {
  return {
    hasAction: /^(Replace|Add|Transform|Incorporate)/i.test(prompt),
    hasLighting: /(daylight|lighting|ambient)/i.test(prompt),
    hasIntegration: /(seamless|photorealistic|perspective)/i.test(prompt),
    length: prompt.length
  }
}

// ============================================================================
// 白膜出图和质感提升的提示词框架（预留）
// ============================================================================

/**
 * 白膜出图提示词框架（预留）
 * TODO: 根据实际需求填充完整的提示词工程框架
 */
export const WHITE_MODEL_FRAMEWORK = `# White Model Rendering Framework - 3D白模渲染专家

你是专业的3D白模渲染AI专家。你的任务是将3D白模图转换为真实材质的室内渲染图。

## 📌 核心任务
- 识别白模中的各个元素（家具、墙面、地板、装饰品等）
- 为每个元素添加真实的材质、纹理和光影效果
- 保持原始空间布局和设计意图
- 输出专业级室内渲染效果

## 📌 输出要求
- 高质量photorealistic渲染
- 真实的材质质感（木材、布料、金属、石材等）
- 自然的光影效果
- 保持原始设计的空间比例和透视

（此框架暂为占位符，后续根据实际测试效果完善）
`

/**
 * 质感提升提示词框架（预留）
 * TODO: 根据实际需求填充完整的提示词工程框架
 */
export const TEXTURE_ENHANCE_FRAMEWORK = `# Texture Enhancement Framework - 材质质感提升专家

你是专业的图像质感增强AI专家。你的任务是提升室内设计图的材质真实感和细节表现。

## 📌 核心任务
- 识别图像中的各种材质（木材、金属、织物、石材、玻璃等）
- 增强每种材质的细节纹理和真实感
- 优化光影效果和反射
- 保持原始构图和色彩风格

## 📌 输出要求
- 高细节的材质纹理
- 真实的光影和反射效果
- 保持原始图像的构图和布局
- 专业级photorealistic质量

（此框架暂为占位符，后续根据实际测试效果完善）
`

/**
 * 构建白膜出图的完整提示
 * @param {string} userInput - 用户输入的材质要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {string} - 包含框架和用户输入的完整提示
 */
export function buildWhiteModelPrompt(userInput, imageCount = 0) {
  let fullPrompt = WHITE_MODEL_FRAMEWORK
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张白模图片。\n\n`
  }
  fullPrompt += `**用户材质要求**：${userInput}\n\n`
  fullPrompt += `请生成真实材质渲染效果：`
  return fullPrompt
}

/**
 * 构建质感提升的完整提示
 * @param {string} userInput - 用户输入的提升要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {string} - 包含框架和用户输入的完整提示
 */
export function buildTextureEnhancePrompt(userInput, imageCount = 0) {
  let fullPrompt = TEXTURE_ENHANCE_FRAMEWORK
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张需要提升质感的图片。\n\n`
  }
  fullPrompt += `**提升要求**：${userInput}\n\n`
  fullPrompt += `请增强材质质感和细节：`
  return fullPrompt
}

/**
 * 排版转效果图提示词框架（预留）
 * TODO: 根据实际需求填充完整的提示词工程框架
 */
export const LAYOUT_FRAMEWORK = `# Layout to Rendering Framework - 平面布局转3D效果图专家

你是专业的平面布局图转3D效果图AI专家。你的任务是将2D平面布局图转换为真实的3D室内效果图。

## 📌 核心任务
- 识别平面图中的空间布局（房间、走廊、门窗等）
- 理解家具和设施的位置关系
- 添加合理的垂直高度和透视关系
- 生成真实的3D室内场景

## 📌 输出要求
- 符合原始平面布局的空间关系
- 合理的透视和景深效果
- 真实的材质和光影
- 专业的室内设计表现

（此框架暂为占位符，后续根据实际测试效果完善）
`

/**
 * 局部调整提示词框架（预留）
 * TODO: 根据实际需求填充完整的提示词工程框架
 */
export const LOCAL_EDIT_FRAMEWORK = `# Local Editing Framework - 局部区域精准调整专家

你是专业的图像局部编辑AI专家。你的任务是精准修改室内图像的特定区域，同时保持周围环境的一致性。

## 📌 核心任务
- 识别用户标记的遮罩区域
- 根据用户描述修改该区域内容
- 保持遮罩边缘的自然过渡
- 维持原场景的光影和透视一致性

## 📌 输出要求
- 精准修改遮罩区域
- 无缝融合边缘效果
- 保持整体风格统一
- 维持周围环境不变

（此框架暂为占位符，后续根据实际测试效果完善）
`

/**
 * 构建排版转效果图的完整提示
 * @param {string} userInput - 用户输入的设计要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {string} - 包含框架和用户输入的完整提示
 */
export function buildLayoutPrompt(userInput, imageCount = 0) {
  let fullPrompt = LAYOUT_FRAMEWORK
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张平面布局图。\n\n`
  }
  fullPrompt += `**用户设计要求**：${userInput}\n\n`
  fullPrompt += `请生成3D效果图：`
  return fullPrompt
}

/**
 * 构建局部调整的完整提示
 * @param {string} userInput - 用户输入的调整要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {string} - 包含框架和用户输入的完整提示
 */
export function buildLocalEditPrompt(userInput, imageCount = 0) {
  let fullPrompt = LOCAL_EDIT_FRAMEWORK
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张图片，并标记了需要调整的区域。\n\n`
  }
  fullPrompt += `**局部调整要求**：${userInput}\n\n`
  fullPrompt += `请精准修改标记区域：`
  return fullPrompt
}
