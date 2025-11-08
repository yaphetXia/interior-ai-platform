import { supabase } from '@/lib/supabase'

/**
 * NanoBanana Prompt Framework Service
 * 基于你的家具替换.md提示词工程框架
 * 直接将框架作为 System Prompt 发给 Gemini，让它自己扩写
 */

// 各提示词框架已迁移至 Supabase 表 prompt_frameworks，不再保留本地常量

const FRAMEWORK_CACHE_TTL = 1000 * 60 * 5 // 5分钟
let frameworkCache = null
let frameworkCacheExpiry = 0

async function loadFrameworksFromSupabase() {
  if (frameworkCache && Date.now() < frameworkCacheExpiry) {
    return frameworkCache
  }

  const { data, error } = await supabase
    .from('prompt_frameworks')
    .select('preset, content')

  if (error) {
    throw new Error(`[PromptFramework] 加载失败：${error.message}`)
  }

  const map = {}
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item?.preset && item?.content) {
        map[item.preset] = item.content
      }
    })
  }

  frameworkCache = map
  frameworkCacheExpiry = Date.now() + FRAMEWORK_CACHE_TTL
  return frameworkCache
}

async function getFrameworkContent(preset) {
  const frameworks = await loadFrameworksFromSupabase()
  const content = frameworks[preset]
  if (!content) {
    throw new Error(`[PromptFramework] 数据库缺少 "${preset}" 框架内容`)
  }
  return content
}

/**
 * 构建发给 Gemini 的完整提示
 * @param {string} userInput - 用户输入的中文关键词
 * @param {number} imageCount - 上传的图片数量
 * @returns {Promise<string>} - 包含 System Prompt 和用户输入的完整提示
 */
export async function buildPromptWithNanoBanana(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('furniture')
  let fullPrompt = framework

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
 * 构建通用生成的完整提示
 * @param {string} userInput - 用户输入的需求
 * @param {number} imageCount - 上传的图片数量
 * @returns {Promise<string>}
 */
export async function buildGeneralPrompt(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('general')
  let fullPrompt = framework

  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张参考图片，可用于补充风格语义。\n\n`
  }
  fullPrompt += `**用户需求**：${userInput}\n\n`
  fullPrompt += `请输出完整的英文提示词：`
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

/**
 * 构建白膜出图的完整提示
 * @param {string} userInput - 用户输入的材质要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {Promise<string>} - 包含框架和用户输入的完整提示
 */
export async function buildWhiteModelPrompt(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('white_model')
  let fullPrompt = framework
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
 * @returns {Promise<string>} - 包含框架和用户输入的完整提示
 */
export async function buildTextureEnhancePrompt(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('sketch')
  let fullPrompt = framework
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张需要提升质感的图片。\n\n`
  }
  fullPrompt += `**提升要求**：${userInput}\n\n`
  fullPrompt += `请增强材质质感和细节：`
  return fullPrompt
}

/**
 * 构建排版转效果图的完整提示
 * @param {string} userInput - 用户输入的设计要求
 * @param {number} imageCount - 上传的图片数量
 * @returns {Promise<string>} - 包含框架和用户输入的完整提示
 */
export async function buildLayoutPrompt(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('layout')
  let fullPrompt = framework
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
 * @returns {Promise<string>} - 包含框架和用户输入的完整提示
 */
export async function buildLocalEditPrompt(userInput, imageCount = 0) {
  const framework = await getFrameworkContent('local')
  let fullPrompt = framework
  fullPrompt += `\n\n---\n\n## 当前任务\n\n`
  if (imageCount > 0) {
    fullPrompt += `用户上传了 ${imageCount} 张图片，并标记了需要调整的区域。\n\n`
  }
  fullPrompt += `**局部调整要求**：${userInput}\n\n`
  fullPrompt += `请精准修改标记区域：`
  return fullPrompt
}
