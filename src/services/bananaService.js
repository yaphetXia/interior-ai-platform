/**
 * Banana API服务
 * 用于图像反推和分析
 */

/**
 * 分析图像并生成描述
 * @param {string} imageUrl - 图像URL或base64
 * @returns {Promise<object>} - 分析结果
 */
export async function analyzeImage(imageUrl) {
  try {
    // 调用Banana API进行图像分析
    const response = await fetch('https://api.banana.dev/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_BANANA_API_KEY || ''}`
      },
      body: JSON.stringify({
        image: imageUrl,
        task: 'describe',
        detail_level: 'high'
      })
    })

    if (!response.ok) {
      throw new Error(`Banana API错误: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      description: data.description || '',
      objects: data.objects || [],
      lighting: data.lighting || '',
      colors: data.colors || [],
      style: data.style || ''
    }
  } catch (error) {
    console.error('Banana API调用失败:', error)
    
    // 降级方案：使用本地LLM分析
    return await fallbackAnalyze(imageUrl)
  }
}

/**
 * 降级方案：使用本地LLM分析图像
 */
async function fallbackAnalyze(imageUrl) {
  try {
    // 使用GPT-4V或其他视觉模型
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_LLM_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this interior design image in detail. Describe:
1. The main objects and furniture
2. Lighting conditions (natural/artificial, bright/dim, warm/cool)
3. Color palette and style
4. Spatial layout and perspective
5. Materials and textures

Provide a comprehensive description suitable for AI image generation.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error('LLM分析失败')
    }

    const data = await response.json()
    const description = data.choices[0].message.content

    // 从描述中提取关键信息
    return {
      description: description,
      objects: extractObjects(description),
      lighting: extractLighting(description),
      colors: extractColors(description),
      style: extractStyle(description)
    }
  } catch (error) {
    console.error('降级分析失败:', error)
    
    // 最终降级：返回通用描述
    return {
      description: 'A modern interior space with professional design elements, featuring carefully selected furniture, appropriate lighting, and a cohesive color scheme.',
      objects: ['furniture', 'lighting', 'decor'],
      lighting: 'bright natural daylight and warm ambient indoor lighting',
      colors: ['neutral', 'warm'],
      style: 'modern'
    }
  }
}

/**
 * 从描述中提取对象
 */
function extractObjects(description) {
  const objectKeywords = [
    'ceiling', 'chair', 'armchair', 'sofa', 'table', 'desk',
    'carpet', 'rug', 'lamp', 'chandelier', 'wall', 'floor',
    'window', 'door', 'curtain', 'plant', 'artwork', 'mirror'
  ]
  
  const found = []
  const lower = description.toLowerCase()
  
  for (const keyword of objectKeywords) {
    if (lower.includes(keyword)) {
      found.push(keyword)
    }
  }
  
  return found
}

/**
 * 从描述中提取光照信息
 */
function extractLighting(description) {
  const lower = description.toLowerCase()
  
  if (lower.includes('nighttime') || lower.includes('evening') || lower.includes('dim')) {
    return 'nighttime ambiance lighting'
  } else if (lower.includes('soft') && lower.includes('diffused')) {
    return 'soft diffused lighting'
  } else if (lower.includes('bright') && lower.includes('natural')) {
    return 'bright natural daylight and warm ambient indoor lighting'
  } else if (lower.includes('warm')) {
    return 'warm ambient indoor lighting'
  }
  
  return 'bright natural daylight'
}

/**
 * 从描述中提取色彩信息
 */
function extractColors(description) {
  const colorKeywords = {
    'white': 'white',
    'black': 'black',
    'gray': 'gray',
    'grey': 'gray',
    'beige': 'beige',
    'brown': 'brown',
    'blue': 'blue',
    'green': 'green',
    'yellow': 'yellow',
    'red': 'red',
    'pink': 'pink',
    'purple': 'purple',
    'gold': 'gold',
    'silver': 'silver'
  }
  
  const found = []
  const lower = description.toLowerCase()
  
  for (const [keyword, color] of Object.entries(colorKeywords)) {
    if (lower.includes(keyword)) {
      found.push(color)
    }
  }
  
  return found.length > 0 ? found : ['neutral']
}

/**
 * 从描述中提取风格信息
 */
function extractStyle(description) {
  const styleKeywords = {
    'modern': 'modern',
    'contemporary': 'contemporary',
    'minimalist': 'minimalist',
    'luxury': 'luxury',
    'elegant': 'elegant',
    'traditional': 'traditional',
    'rustic': 'rustic',
    'industrial': 'industrial',
    'scandinavian': 'scandinavian',
    'japanese': 'japanese',
    'wabi-sabi': 'wabi-sabi'
  }
  
  const lower = description.toLowerCase()
  
  for (const [keyword, style] of Object.entries(styleKeywords)) {
    if (lower.includes(keyword)) {
      return style
    }
  }
  
  return 'modern'
}

/**
 * 批量分析多张图像
 * @param {Array<string>} imageUrls - 图像URL数组
 * @returns {Promise<Array>} - 分析结果数组
 */
export async function batchAnalyzeImages(imageUrls) {
  const results = []
  
  for (const url of imageUrls) {
    try {
      const result = await analyzeImage(url)
      results.push({ success: true, data: result })
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }
  
  return results
}

