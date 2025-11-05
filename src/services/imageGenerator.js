import { supabase } from '@/lib/supabase'
import { getEdgeFunctionEndpoint, getConfig } from './apiConfig'

/**
 * 图像生成服务
 * 通过 Supabase Edge Function 调用 Gemini API
 */

/**
 * 生成图像
 * @param {object} params - 生成参数
 * @param {string} params.prompt - 用户输入的提示词
 * @param {string} [params.preset='general'] - 预设类型
 * @param {string} [params.image=null] - 输入图像（base64或URL）
 * @param {string} [params.mask=null] - 遮罩图像（base64）
 * @param {number} [params.width=1024] - 图像宽度
 * @param {number} [params.height=1024] - 图像高度
 * @param {number} [params.numImages=1] - 生成图像数量
 * @param {string} [params.metaPrompt=null] - LLM meta-prompt（用于智能组装提示词）
 * @returns {Promise<object>} - 生成结果
 */
export async function generateImage(params) {
  const {
    prompt,
    preset = 'general',
    image = null,
    images = null,
    mask = null,
    width = 1024,
    height = 1024,
    numImages = 1,
    metaPrompt = null
  } = params

  try {
    console.log('调用 Edge Function 生成图像...')
    console.log('参数:', {
      prompt,
      preset,
      hasImage: !!image,
      hasImages: !!images,
      imageCount: images?.length || (image ? 1 : 0),
      hasMask: !!mask,
      width,
      height,
      numImages,
      hasMetaPrompt: !!metaPrompt
    })

    // 获取当前用户的访问令牌
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('用户未登录')
    }

    // 调用 Supabase Edge Function
    const edgeFunctionUrl = getEdgeFunctionEndpoint()
    const config = getConfig()

    const timeout = Number(config.timeout) || 0
    let timeoutWarningTimer = null
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        prompt,
        preset,
        image,
        images,
        mask,
        width,
        height,
        numImages,
        metaPrompt  // 传递 meta-prompt 给 Edge Function
      })
    }

    if (timeout > 0) {
      console.info('[generateImage] 请求超时阈值(毫秒):', timeout)
      timeoutWarningTimer = setTimeout(() => {
        console.warn('[generateImage] 请求仍在进行中，已超过设定阈值。等待 Edge Function 返回结果...')
      }, timeout)
    }

    let response
    try {
      response = await fetch(edgeFunctionUrl, fetchOptions)
    } finally {
      if (timeoutWarningTimer) {
        clearTimeout(timeoutWarningTimer)
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Edge Function 错误: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('图像生成成功:', result)

    return result
  } catch (error) {
    console.error('图像生成失败:', error)
    throw error
  }
}

/**
 * 批量生成图像
 * @param {Array} requests - 生成请求数组
 * @returns {Promise<Array>} - 生成结果数组
 */
export async function batchGenerateImages(requests) {
  const results = []

  // 串行处理，避免并发过多
  for (const request of requests) {
    try {
      const result = await generateImage(request)
      results.push({ success: true, data: result })
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }

  return results
}
