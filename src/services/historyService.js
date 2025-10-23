import { supabase } from '@/lib/supabase'

/**
 * 历史记录服务
 * 管理用户的图像生成历史记录
 */

/**
 * 获取当前用户的历史记录
 * @param {object} options - 查询选项
 * @param {number} [options.limit=50] - 返回记录数量
 * @param {number} [options.offset=0] - 偏移量（用于分页）
 * @returns {Promise<Array>} - 历史记录数组
 */
export async function fetchHistory(options = {}) {
  const { limit = 50, offset = 0 } = options

  try {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('用户未登录')
    }

    // 查询历史记录
    const { data, error } = await supabase
      .from('generation_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error('获取历史记录失败:', error)
    throw error
  }
}

/**
 * 获取单条历史记录详情
 * @param {string} id - 记录ID
 * @returns {Promise<object>} - 历史记录详情
 */
export async function fetchHistoryById(id) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('用户未登录')
    }

    const { data, error } = await supabase
      .from('generation_history')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('获取历史记录详情失败:', error)
    throw error
  }
}

/**
 * 删除历史记录
 * @param {string} id - 记录ID
 * @returns {Promise<void>}
 */
export async function deleteHistory(id) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('用户未登录')
    }

    // 先获取记录，确保是当前用户的记录
    const record = await fetchHistoryById(id)
    if (!record) {
      throw new Error('记录不存在')
    }

    // 删除 Storage 中的图片
    if (record.storage_paths && record.storage_paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('generated-images')
        .remove(record.storage_paths)

      if (storageError) {
        console.warn('删除图片失败:', storageError)
        // 不抛出错误，继续删除数据库记录
      }
    }

    // 删除数据库记录
    const { error } = await supabase
      .from('generation_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('删除历史记录失败:', error)
    throw error
  }
}

/**
 * 批量删除历史记录
 * @param {Array<string>} ids - 记录ID数组
 * @returns {Promise<void>}
 */
export async function batchDeleteHistory(ids) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('用户未登录')
    }

    // 获取所有要删除的记录
    const { data: records, error: fetchError } = await supabase
      .from('generation_history')
      .select('*')
      .in('id', ids)
      .eq('user_id', user.id)

    if (fetchError) {
      throw fetchError
    }

    // 收集所有图片路径
    const storagePaths = []
    records.forEach(record => {
      if (record.storage_paths && record.storage_paths.length > 0) {
        storagePaths.push(...record.storage_paths)
      }
    })

    // 批量删除图片
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('generated-images')
        .remove(storagePaths)

      if (storageError) {
        console.warn('批量删除图片失败:', storageError)
      }
    }

    // 批量删除数据库记录
    const { error } = await supabase
      .from('generation_history')
      .delete()
      .in('id', ids)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('批量删除历史记录失败:', error)
    throw error
  }
}

/**
 * 搜索历史记录
 * @param {string} keyword - 搜索关键词
 * @param {object} options - 查询选项
 * @returns {Promise<Array>} - 匹配的历史记录
 */
export async function searchHistory(keyword, options = {}) {
  const { limit = 50, offset = 0 } = options

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('用户未登录')
    }

    const { data, error } = await supabase
      .from('generation_history')
      .select('*')
      .eq('user_id', user.id)
      .or(`prompt.ilike.%${keyword}%,preset.ilike.%${keyword}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error('搜索历史记录失败:', error)
    throw error
  }
}
