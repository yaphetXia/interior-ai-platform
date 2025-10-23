/**
 * Gemini API 本地测试脚本
 *
 * 用途：测试 Gemini API 的基础连通性和认证是否正常
 *
 * 使用方法：
 * 1. 确保 .env 文件中配置了以下环境变量：
 *    - VITE_GEMINI_API_ENDPOINT
 *    - VITE_GEMINI_API_KEY
 *    - VITE_GEMINI_MODEL
 *
 * 2. 运行测试：
 *    node test-gemini-api.js
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

// 读取配置
const API_ENDPOINT = process.env.VITE_GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta'
const API_KEY = process.env.VITE_GEMINI_API_KEY
const MODEL = process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image'

// 输出配置信息（隐藏敏感信息）
console.log('\n========================================')
console.log('Gemini API 连通性测试')
console.log('========================================\n')

console.log('配置信息：')
console.log(`  API 端点: ${API_ENDPOINT}`)
console.log(`  API Key: ${API_KEY ? `${API_KEY.slice(0, 10)}...${API_KEY.slice(-4)}` : '未配置'}`)
console.log(`  模型: ${MODEL}`)
console.log('\n----------------------------------------\n')

// 验证必要的配置
if (!API_KEY) {
  console.error('❌ 错误: 未配置 VITE_GEMINI_API_KEY')
  console.error('   请在 .env 文件中添加你的 Gemini API Key')
  process.exit(1)
}

// 测试 API 连通性
async function testGeminiAPI() {
  const startTime = Date.now()

  try {
    console.log('🔍 正在测试 API 连通性...\n')

    // 构建 API URL
    // 使用 generateContent 方法进行简单的文本生成测试
    const apiUrl = `${API_ENDPOINT}/models/${MODEL}:generateContent?key=${API_KEY}`

    // 发起请求
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

    const endTime = Date.now()
    const duration = endTime - startTime

    // 检查响应状态
    console.log(`📊 响应状态: ${response.status} ${response.statusText}`)
    console.log(`⏱️  响应时间: ${duration}ms\n`)

    // 解析响应内容
    const data = await response.json()

    if (response.ok) {
      console.log('✅ 测试成功！API 连通性正常\n')
      console.log('响应数据预览：')
      console.log(JSON.stringify(data, null, 2))
      console.log('\n========================================')
      console.log('测试结论: Gemini API 配置正确，可以正常使用')
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
      if (response.status === 401 || response.status === 403) {
        console.log('💡 可能原因：')
        console.log('   - API Key 无效或已过期')
        console.log('   - API Key 权限不足')
        console.log('   - 请访问 https://aistudio.google.com/ 检查你的 API Key\n')
      } else if (response.status === 404) {
        console.log('💡 可能原因：')
        console.log('   - 模型名称错误')
        console.log('   - API 端点 URL 错误')
        console.log('   - 请检查 VITE_GEMINI_MODEL 和 VITE_GEMINI_API_ENDPOINT 配置\n')
      } else if (response.status === 429) {
        console.log('💡 可能原因：')
        console.log('   - API 请求频率超限')
        console.log('   - 请稍后再试\n')
      }

      return false
    }
  } catch (error) {
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
}

// 运行测试
testGeminiAPI()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('未预期的错误：', error)
    process.exit(1)
  })
