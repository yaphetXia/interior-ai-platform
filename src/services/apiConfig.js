/**
 * API配置文件
 *
 * 使用说明：
 * 1. 复制 .env.example 为 .env
 * 2. 在 .env 中填入你的 Supabase 和 Gemini API 配置
 * 3. 生产环境中，图像生成将通过 Supabase Edge Function 代理
 */

// 配置
const CONFIG = {
  // Supabase 配置
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Google AI Studio (Gemini) API 配置（仅用于开发测试）
  // 生产环境中，API Key 应该保存在 Supabase Edge Function 的环境变量中
  gemini: {
    endpoint: import.meta.env.VITE_GEMINI_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image',
  },

  // API超时配置
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '120000'),

  // 最大生成图片数量
  maxImagesPerGeneration: parseInt(import.meta.env.VITE_MAX_IMAGES_PER_GENERATION || '4'),
}

// 获取配置
export function getConfig() {
  return CONFIG
}

// 获取 Supabase 配置
export function getSupabaseConfig() {
  return CONFIG.supabase
}

// 获取 Gemini API 配置
export function getGeminiConfig() {
  return CONFIG.gemini
}

// 获取 Edge Function 端点
// 生产环境中使用 Edge Function 调用 Gemini API
export function getEdgeFunctionEndpoint() {
  const supabaseUrl = CONFIG.supabase.url
  if (!supabaseUrl) {
    throw new Error('Supabase URL 未配置')
  }
  return `${supabaseUrl}/functions/v1/generate-image`
}

// 验证必要的配置
export function validateConfig() {
  const errors = []

  // 检查 Supabase 配置
  if (!CONFIG.supabase.url) {
    errors.push('Supabase URL 未配置 (VITE_SUPABASE_URL)')
  }
  if (!CONFIG.supabase.anonKey) {
    errors.push('Supabase Anon Key 未配置 (VITE_SUPABASE_ANON_KEY)')
  }

  // 检查 Gemini 配置（开发环境）
  if (import.meta.env.DEV) {
    if (!CONFIG.gemini.endpoint) {
      errors.push('Gemini API 端点未配置 (VITE_GEMINI_API_ENDPOINT)')
    }
    if (!CONFIG.gemini.apiKey) {
      errors.push('Gemini API Key 未配置 (VITE_GEMINI_API_KEY)')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

