import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Clock, Search, Download, Trash2, Image as ImageIcon, Home, LogOut, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { fetchHistory, deleteHistory, searchHistory } from '@/services/historyService'

// 预设类型映射
const presetNameMap = {
  general: '通用生成',
  furniture: '家具替换',
  white_model: '白膜出图',
  sketch: '线稿出图',
  layout: '排版转效果图',
  local: '局部调整'
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  // 加载历史记录
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await fetchHistory({ limit: 100 })
      setHistory(data)
    } catch (error) {
      console.error('加载历史记录失败:', error)
      toast.error('加载历史记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadHistory()
      return
    }

    try {
      setLoading(true)
      const data = await searchHistory(searchQuery, { limit: 100 })
      setHistory(data)
    } catch (error) {
      console.error('搜索失败:', error)
      toast.error('搜索失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理删除
  const handleDelete = async (id) => {
    try {
      setDeleting(id)
      await deleteHistory(id)
      toast.success('删除成功')
      // 从列表中移除
      setHistory(history.filter(item => item.id !== id))
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    } finally {
      setDeleting(null)
    }
  }

  // 下载图片
  const handleDownload = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${Date.now()}-${index}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('下载成功')
    } catch (error) {
      console.error('下载失败:', error)
      toast.error('下载失败')
    }
  }

  // 退出登录
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/workspace')}>
                <Home className="w-4 h-4 mr-2" />
                返回工作台
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">历史记录</h1>
            <p className="text-muted-foreground">查看所有生成历史</p>
          </div>

          {/* 搜索 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索历史记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
            {searchQuery && (
              <Button variant="outline" onClick={() => { setSearchQuery(''); loadHistory() }}>
                清除
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">加载中...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? '未找到匹配的记录' : '还没有历史记录'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? '尝试使用其他关键词搜索' : '开始生成图像后会显示在这里'}
            </p>
            {searchQuery && (
              <Button onClick={() => { setSearchQuery(''); loadHistory() }} className="mt-4">
                查看所有记录
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-xl hover:bg-accent/50 transition-colors bg-card"
              >
                {/* 图片预览区域 - 支持多张图片 */}
                <div className="flex gap-2">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    item.image_urls.slice(0, 2).map((url, idx) => (
                      <div key={idx} className="w-32 h-32 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={url}
                          alt={`生成的图片 ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>'
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
                    </div>
                  )}
                  {item.image_urls && item.image_urls.length > 2 && (
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-muted-foreground">
                        +{item.image_urls.length - 2} 张
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <p className="font-medium mb-1 line-clamp-2">{item.prompt}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.created_at)}
                        </span>
                        {item.preset && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                            {presetNameMap[item.preset] || item.preset}
                          </span>
                        )}
                        {item.image_urls && item.image_urls.length > 0 && (
                          <span className="text-xs">
                            {item.image_urls.length} 张图片
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {item.image_urls && item.image_urls.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item.image_urls[0], 0)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          删除中...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

