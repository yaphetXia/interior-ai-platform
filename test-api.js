/**
 * API 连通性测试脚本（支持多个 API）
 *
 * 用途：测试不同 API 的基础连通性和图像生成功能
 *
 * 使用方法：
 * 1. 确保 .env 文件中配置了相应的环境变量
 *
 * 2. 运行测试：
 *    node test-api.js                              # 默认测试星空API文本功能
 *    node test-api.js --api=xingkong --mode=text   # 测试星空API文本功能
 *    node test-api.js --api=xingkong --mode=image  # 测试星空API图像生成
 *    node test-api.js --api=gemini --mode=text     # 测试Gemini API文本功能
 *    node test-api.js --api=gemini --mode=image    # 测试Gemini API图像生成
 *
 * 3. 查看测试结果
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载 .env 文件
dotenv.config({ path: join(__dirname, '.env') })

// 解析命令行参数
const args = process.argv.slice(2)
const apiArg = args.find(arg => arg.startsWith('--api='))
const modeArg = args.find(arg => arg.startsWith('--mode='))
const selectedAPI = apiArg ? apiArg.split('=')[1] : 'xingkong'
const testMode = modeArg ? modeArg.split('=')[1] : 'text' // 'text' 或 'image'

// 读取配置
const CONFIG = {
  gemini: {
    endpoint: process.env.VITE_GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.VITE_GEMINI_API_KEY,
    model: process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image',
  },
  xingkong: {
    endpoint: process.env.VITE_XINGKONG_API_ENDPOINT || 'https://api.wfei.site',
    apiKey: process.env.VITE_XINGKONG_API_KEY,
    model: 'gemini-2.5-flash-image', // 通过星空API调用Gemini模型
  }
}

// 输出配置信息（隐藏敏感信息）
console.log('\n========================================')
console.log('API 连通性测试')
console.log('========================================\n')

const config = CONFIG[selectedAPI]

if (!config) {
  console.error(`❌ 错误: 不支持的 API: ${selectedAPI}`)
  console.error('   支持的选项: gemini, xingkong')
  process.exit(1)
}

console.log(`测试目标: ${selectedAPI.toUpperCase()} API`)
console.log(`测试模式: ${testMode === 'image' ? '图像生成' : '文本生成'}`)
console.log('\n配置信息：')
console.log(`  API 端点: ${config.endpoint}`)
console.log(`  API Key: ${config.apiKey ? `${config.apiKey.slice(0, 10)}...${config.apiKey.slice(-4)}` : '未配置'}`)
console.log(`  模型: ${config.model}`)
console.log('\n----------------------------------------\n')

// 验证必要的配置
if (!config.apiKey) {
  console.error(`❌ 错误: ${selectedAPI} API Key 未配置`)
  console.error(`   请在 .env 文件中添加 VITE_${selectedAPI.toUpperCase()}_API_KEY`)
  process.exit(1)
}

/**
 * 测试 Gemini API（原生格式）
 */
async function testGeminiAPI() {
  const startTime = Date.now()

  try {
    console.log('🔍 正在测试 Gemini API 连通性...\n')

    const apiUrl = `${config.endpoint}/models/${config.model}:generateContent?key=${config.apiKey}`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a connectivity test. Please respond with "OK".'
          }]
        }]
      })
    })

    return await handleResponse(response, startTime, 'Gemini')
  } catch (error) {
    return await handleError(error, startTime, 'Gemini')
  }
}

/**
 * 测试星空API（OpenAI兼容格式 - 文本生成）
 */
async function testXingkongAPI() {
  const startTime = Date.now()

  try {
    console.log('🔍 正在测试星空API连通性（通过OpenAI格式调用Gemini模型）...\n')

    // 使用 OpenAI 兼容格式
    const apiUrl = `${config.endpoint}/v1/chat/completions`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: 'Hello, this is a connectivity test. Please respond with "OK".'
        }],
        max_tokens: 50,
      })
    })

    return await handleResponse(response, startTime, '星空API')
  } catch (error) {
    return await handleError(error, startTime, '星空API')
  }
}

/**
 * 测试星空API图像生成（OpenAI兼容格式 + gemini-2.5-flash-image模型）
 */
async function testXingkongImageGeneration() {
  const startTime = Date.now()

  try {
    console.log('🎨 正在测试星空API图像生成功能...\n')
    console.log('提示词: "A modern minimalist living room with a gray sofa"')
    console.log('模型: gemini-2.5-flash-image\n')

    const apiUrl = `${config.endpoint}/v1/chat/completions`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash-image',
        messages: [{
          role: 'user',
          content: 'Generate an image: A modern minimalist living room with a gray sofa, natural lighting, photorealistic, 4K quality'
        }],
        max_tokens: 4096,
      })
    })

    return await handleImageResponse(response, startTime, '星空API')
  } catch (error) {
    return await handleError(error, startTime, '星空API图像生成')
  }
}

/**
 * 处理 API 响应（文本）
 */
async function handleResponse(response, startTime, apiName) {
  const endTime = Date.now()
  const duration = endTime - startTime

  console.log(`📊 响应状态: ${response.status} ${response.statusText}`)
  console.log(`⏱️  响应时间: ${duration}ms\n`)

  const data = await response.json()

  if (response.ok) {
    console.log(`✅ 测试成功！${apiName} 连通性正常\n`)
    console.log('响应数据预览：')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n========================================')
    console.log(`测试结论: ${apiName} 配置正确，可以正常使用`)
    console.log('========================================\n')
    return true
  } else {
    console.log('❌ 测试失败！\n')
    console.log('错误详情：')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n========================================')
    console.log('测试结论: API 请求失败，请检查配置')
    console.log('========================================\n')

    // 提供常见错误的解决建议
    provideErrorSuggestions(response.status)
    return false
  }
}

/**
 * 处理图像生成响应
 */
async function handleImageResponse(response, startTime, apiName) {
  const endTime = Date.now()
  const duration = endTime - startTime

  console.log(`📊 响应状态: ${response.status} ${response.statusText}`)
  console.log(`⏱️  响应时间: ${duration}ms\n`)

  const data = await response.json()

  if (response.ok) {
    console.log(`✅ 图像生成成功！\n`)

    // 分析响应结构
    console.log('========================================')
    console.log('响应数据结构分析')
    console.log('========================================\n')

    console.log('完整响应:')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n----------------------------------------\n')

    // 尝试提取图像数据
    const message = data.choices?.[0]?.message
    if (message) {
      console.log('消息内容类型:', typeof message.content)
      console.log('消息角色:', message.role)

      if (typeof message.content === 'string') {
        console.log('内容长度:', message.content.length, '字符')
        console.log('内容预览（前200字符）:', message.content.substring(0, 200))

        // 检查是否包含base64图像数据
        if (message.content.includes('base64') || message.content.includes('data:image')) {
          console.log('\n✅ 发现可能的图像数据（base64编码）')
        } else if (message.content.startsWith('http')) {
          console.log('\n✅ 发现可能的图像URL')
        }
      } else if (Array.isArray(message.content)) {
        console.log('内容是数组，包含', message.content.length, '个元素')
        message.content.forEach((item, idx) => {
          console.log(`  元素 ${idx}:`, Object.keys(item))
        })
      } else if (typeof message.content === 'object') {
        console.log('内容是对象，键:', Object.keys(message.content))
      }
    }

    console.log('\n========================================')
    console.log(`测试结论: ${apiName} 图像生成功能可用`)
    console.log('请查看上述响应结构，了解如何提取图像数据')
    console.log('========================================\n')
    return true
  } else {
    console.log('❌ 图像生成失败！\n')
    console.log('错误详情：')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n========================================')
    console.log('测试结论: 图像生成请求失败')
    console.log('========================================\n')
    provideErrorSuggestions(response.status)
    return false
  }
}

/**
 * 处理错误
 */
async function handleError(error, startTime, apiName) {
  const endTime = Date.now()
  const duration = endTime - startTime

  console.log(`❌ 测试失败！（耗时: ${duration}ms）\n`)
  console.log('错误信息：')
  console.log(error.message)
  console.log('\n========================================')
  console.log('测试结论: 网络错误或配置问题')
  console.log('========================================\n')

  console.log('💡 可能原因：')
  console.log('   - 网络连接问题')
  console.log('   - API 端点 URL 错误')
  console.log('   - 防火墙或代理设置阻止了请求\n')

  return false
}

/**
 * 提供错误解决建议
 */
function provideErrorSuggestions(statusCode) {
  if (statusCode === 401 || statusCode === 403) {
    console.log('💡 可能原因：')
    console.log('   - API Key 无效或已过期')
    console.log('   - API Key 权限不足')
    console.log('   - 请检查你的 API Key 是否正确\n')
  } else if (statusCode === 404) {
    console.log('💡 可能原因：')
    console.log('   - 模型名称错误')
    console.log('   - API 端点 URL 错误')
    console.log('   - 请检查配置中的模型名称和端点\n')
  } else if (statusCode === 429) {
    console.log('💡 可能原因：')
    console.log('   - API 请求频率超限')
    console.log('   - 配额已用尽')
    console.log('   - 请稍后再试\n')
  } else if (statusCode === 400) {
    console.log('💡 可能原因：')
    console.log('   - 请求参数格式错误')
    console.log('   - 模型不支持当前的请求格式')
    console.log('   - 请检查 API 文档确认正确的请求格式\n')
  }
}

/**
 * 主测试函数
 */
async function runTest() {
  let success = false

  // 根据测试模式选择测试函数
  if (testMode === 'image') {
    // 图像生成测试
    if (selectedAPI === 'xingkong') {
      success = await testXingkongImageGeneration()
    } else {
      console.error('❌ 暂不支持该API的图像生成测试')
      process.exit(1)
    }
  } else {
    // 文本生成/连通性测试
    if (selectedAPI === 'gemini') {
      success = await testGeminiAPI()
    } else if (selectedAPI === 'xingkong') {
      success = await testXingkongAPI()
    }
  }

  process.exit(success ? 0 : 1)
}

// 运行测试
runTest().catch(error => {
  console.error('未预期的错误：', error)
  process.exit(1)
})
