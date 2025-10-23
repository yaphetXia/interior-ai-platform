// Supabase Edge Function: generate-image
// 用途：通过星空API (OpenAI兼容格式) 调用 Gemini 生成图像，上传到 Supabase Storage，保存历史记录

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateImageRequest {
  prompt: string
  preset?: string
  image?: string | null         // 单图输入（向后兼容）
  images?: string[] | null      // 多图输入（新增）
  mask?: string | null
  width?: number
  height?: number
  numImages?: number
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. 验证用户认证
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('未提供认证令牌')
    }

    // 创建 Supabase 客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 验证用户令牌
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('认证失败')
    }

    // 2. 解析请求参数
    const requestData: GenerateImageRequest = await req.json()
    const {
      prompt,
      preset = 'general',
      image = null,
      images = null,
      mask = null,
      width = 1024,
      height = 1024,
      numImages = 1
    } = requestData

    if (!prompt) {
      throw new Error('缺少 prompt 参数')
    }

    // 构建图片列表（兼容单图和多图）
    let imageList = images && images.length > 0 ? images : (image ? [image] : [])

    // 对于需要遮罩的功能（家具替换、局部调整），如果提供了遮罩图，则使用遮罩图替换原图
    // 因为遮罩图已经是原图+红色标记的合成图，直接传给Gemini能让它看到用户标记的区域
    if (mask && (preset === 'furniture' || preset === 'local')) {
      console.log('检测到遮罩图，使用带标记的图片')
      // 如果有多图，替换第一张；如果没图，添加遮罩图
      if (imageList.length > 0) {
        imageList[0] = mask  // 用遮罩图替换第一张原图
      } else {
        imageList = [mask]   // 没有上传图片时，直接使用遮罩图
      }
    }

    console.log('生成图像请求:', {
      userId: user.id,
      promptLength: prompt.length,
      preset,
      width,
      height,
      numImages,
      imageCount: imageList.length,
      hasMask: !!mask,
      usingMask: mask && (preset === 'furniture' || preset === 'local')
    })

    // 3. 获取 API 配置 (星空API)
    const apiEndpoint = Deno.env.get('XINGKONG_API_ENDPOINT') ?? 'https://api.wfei.site'
    const apiKey = Deno.env.get('XINGKONG_API_KEY') ?? ''
    const imageModel = 'gemini-2.5-flash-image'  // 图像生成模型
    const textModel = 'gemini-2.5-flash'  // 文本模型（用于提取提示词）

    if (!apiKey) {
      throw new Error('星空API Key 未配置')
    }

    // 4. 处理提示词（两阶段调用）
    let finalPrompt = prompt

    // 检测是否包含 NanoBanana Framework（长提示词）
    // 如果提示词很长（>1000字符），说明包含了完整的Framework
    // 需要先用文本模型提取核心提示词
    if (prompt.length > 1000) {
      console.log('检测到长提示词（包含Framework），使用两阶段处理...')
      console.log('原始提示词长度:', prompt.length, '字符')
      console.log('传递图片数量:', imageList.length)

      try {
        // 构建文本模型的消息内容（包含图片+文本）
        const textMessageContent: any[] = []

        // 先添加所有图片（让文本模型能看到图片）
        if (imageList.length > 0) {
          imageList.forEach((imgUrl, index) => {
            textMessageContent.push({
              type: "image_url",
              image_url: {
                url: imgUrl
              }
            })
            console.log(`阶段1: 已添加第 ${index + 1} 张图片到文本模型请求`)
          })
        }

        // 添加文本提示词
        textMessageContent.push({
          type: "text",
          text: prompt
        })

        // 阶段1：调用文本模型提取核心英文提示词（传递图片+文本）
        const textGenResponse = await fetch(`${apiEndpoint}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: textModel,
            messages: [{
              role: 'user',
              content: imageList.length > 0 ? textMessageContent : prompt
            }],
            max_tokens: 500,
          }),
        })

        if (!textGenResponse.ok) {
          const errorText = await textGenResponse.text()
          console.error('文本模型调用失败:', errorText)
          throw new Error(`提示词提取失败: ${textGenResponse.statusText}`)
        }

        const textGenData = await textGenResponse.json()
        const extractedPrompt = textGenData.choices?.[0]?.message?.content?.trim()

        if (extractedPrompt) {
          finalPrompt = extractedPrompt
          console.log('✓ 成功提取核心提示词:', finalPrompt)
        } else {
          console.warn('文本模型未返回有效提示词，使用原始输入')
        }
      } catch (error) {
        console.error('提示词提取失败，降级使用原始输入:', error)
        // 降级：使用原始提示词
      }
    }
    // 对于简短的非家具替换提示词，使用预设模板增强
    else if (preset !== 'furniture' && prompt.length < 150) {
      console.log('使用预设模板增强提示词...')

      switch (preset) {
        case 'general':
          finalPrompt = `Professional interior design rendering: ${prompt}. High-quality, photorealistic, modern aesthetics, natural lighting, 4K quality`
          break
        case 'white_model':
          finalPrompt = `3D white model to photorealistic render: ${prompt}. Realistic materials, textures, lighting, shadows, professional quality`
          break
        case 'sketch':
          finalPrompt = `Enhance texture quality and material realism of the interior image: ${prompt}. Professional photorealistic rendering, high-detail textures, realistic materials, improved lighting and shadows, maintain original composition`
          break
        case 'layout':
          finalPrompt = `Floor plan to 3D interior visualization: ${prompt}. Depth, perspective, realistic materials, atmospheric lighting`
          break
        case 'local':
          finalPrompt = `Local area editing in interior scene: ${prompt}. Precise modification, maintain surrounding context, seamless blending`
          break
        default:
          finalPrompt = prompt
      }

      console.log('预设优化后的提示词长度:', finalPrompt.length)
    } else {
      console.log('直接使用用户提示词')
    }

    // 5. 调用星空API图像生成 (OpenAI兼容格式)
    console.log('调用星空API图像生成...', apiEndpoint, 'Model:', imageModel)
    console.log('最终提示词长度:', finalPrompt.length, '字符')
    console.log('输入图片数量:', imageList.length)
    console.log('是否有遮罩:', !!mask)

    // 构建消息内容（支持多模态：文本+多图）
    const messageContent: any[] = []

    // 添加所有输入图片（OpenAI格式支持多图）
    if (imageList.length > 0) {
      imageList.forEach((imgUrl, index) => {
        messageContent.push({
          type: "image_url",
          image_url: {
            url: imgUrl  // base64格式: data:image/png;base64,...
          }
        })
        console.log(`已添加第 ${index + 1} 张图片到请求`)
      })
    }

    // 添加文本提示词
    let textPrompt = finalPrompt

    // 当使用遮罩时，明确说明红色区域的含义
    // 这样Gemini能理解红色标记代表要修改的区域，而不是图片的一部分
    if (mask && (preset === 'furniture' || preset === 'local')) {
      textPrompt += `\n\nIMPORTANT INSTRUCTION: The image provided contains semi-transparent RED OVERLAY markings. These red areas indicate the EXACT regions that need to be modified according to the user's request. Please generate a NEW IMAGE where ONLY the content within the red-marked areas is modified, while keeping all other parts of the image completely unchanged. The red overlay itself should NOT appear in the final generated image - it is only a visual guide showing which areas to modify.`
      console.log('已添加遮罩使用说明到提示词')
    }

    messageContent.push({
      type: "text",
      text: textPrompt
    })

    console.log('消息内容元素数:', messageContent.length)

    // 使用 OpenAI 兼容格式
    // 如果只有文本，直接传字符串；如果有图片，传数组
    const requestBody = {
      model: imageModel,
      messages: [{
        role: 'user',
        content: messageContent.length === 1 ? messageContent[0].text : messageContent
      }],
      max_tokens: 4096,
    }

    const apiResponse = await fetch(`${apiEndpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('星空API错误:', errorText)
      throw new Error(`图像生成失败: ${apiResponse.statusText}`)
    }

    const apiData = await apiResponse.json()
    console.log('星空API响应成功')

    // 4. 处理生成的图片
    // 星空API返回格式: { choices: [{ message: { content: "![image](data:image/png;base64,...)" } }] }
    const choices = apiData.choices || []

    if (choices.length === 0) {
      throw new Error('API 未返回图片')
    }

    console.log(`准备处理 ${choices.length} 个候选结果`)

    // 5. 提取 base64 图片数据并上传到 Supabase Storage
    const imageUrls: string[] = []
    const storagePaths: string[] = []

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i]
      const content = choice.message?.content

      if (!content) {
        console.warn(`候选结果 ${i} 不包含内容`)
        continue
      }

      try {
        // 从Markdown格式中提取base64数据
        // 格式: ![image](data:image/png;base64,<base64数据>)
        const base64Match = content.match(/data:image\/(png|jpeg|jpg);base64,([^)]+)/)

        if (!base64Match) {
          console.warn(`候选结果 ${i} 不包含有效的base64图像数据`)
          continue
        }

        const mimeType = base64Match[1] === 'png' ? 'image/png' : 'image/jpeg'
        const base64Data = base64Match[2]

        console.log(`处理图片 ${i + 1}/${choices.length}, MIME type: ${mimeType}`)

        // 将 base64 转换为 ArrayBuffer
        // Deno 环境中使用 atob 解码 base64
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j)
        }
        const imageBlob = bytes.buffer

        // 生成唯一文件名
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const filename = `${user.id}/${timestamp}_${randomId}_${i}.png`
        const storagePath = filename

        console.log('上传到 Supabase Storage:', storagePath)

        // 上传到 Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('generated-images')
          .upload(storagePath, imageBlob, {
            contentType: 'image/png',
            upsert: false,
          })

        if (uploadError) {
          console.error('上传失败:', uploadError)
          throw new Error(`图片上传失败: ${uploadError.message}`)
        }

        // 获取公共 URL
        const { data: urlData } = supabase.storage
          .from('generated-images')
          .getPublicUrl(storagePath)

        imageUrls.push(urlData.publicUrl)
        storagePaths.push(storagePath)

        console.log('图片上传成功:', urlData.publicUrl)
      } catch (error) {
        console.error(`处理图片 ${i} 时出错:`, error)
        // 如果单张图片失败，继续处理其他图片
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('所有图片上传都失败了')
    }

    // 6. 保存生成记录到数据库
    const { error: insertError } = await supabase
      .from('generation_history')
      .insert({
        user_id: user.id,
        prompt: prompt,
        preset: preset,
        image_urls: imageUrls,
        storage_paths: storagePaths,
      })

    if (insertError) {
      console.error('保存历史记录失败:', insertError)
      // 不抛出错误，因为图片已经生成成功
    }

    // 7. 返回结果
    return new Response(
      JSON.stringify({
        success: true,
        images: imageUrls.map((url, idx) => ({
          url,
          storagePath: storagePaths[idx],
        })),
        prompt,
        preset,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge Function 错误:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '未知错误',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
