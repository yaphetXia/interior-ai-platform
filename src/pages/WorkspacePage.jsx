import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import MaskEditor from '@/components/MaskEditor'
import { generateImage } from '@/services/imageGenerator'
import { useAuth } from '@/contexts/AuthContext'
import {
  buildPromptWithNanoBanana,
  needsExpansion,
  buildWhiteModelPrompt,
  buildTextureEnhancePrompt,
  buildLayoutPrompt,
  buildLocalEditPrompt
} from '@/services/nanobananaService'
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Clock,
  Home,
  Settings,
  User,
  LogOut,
  Zap,
  Download,
  Heart,
  Share2,
  RefreshCw,
  Layers,
  X,
  Info
} from 'lucide-react'

export default function WorkspacePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [selectedPreset, setSelectedPreset] = useState('general')
  const [description, setDescription] = useState('')
  const [uploadedImages, setUploadedImages] = useState([]) // 统一使用数组管理多图
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // 当前选中的图像索引
  const [maskData, setMaskData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState([])

  const presets = [
    { id: 'general', name: '通用生成', icon: <Sparkles className="w-4 h-4" />, description: '从文字描述生成高质量效果图', disabled: false, maxImages: 1 },
    { id: 'furniture', name: '家具替换', icon: <ImageIcon className="w-4 h-4" />, needsMask: true, description: '智能识别并替换家具，保持光影效果', disabled: false, maxImages: 2 },
    { id: 'white_model', name: '白膜出图', icon: <Zap className="w-4 h-4" />, description: '3D白模快速生成真实材质渲染图', disabled: false, maxImages: 10 },
    { id: 'sketch', name: '质感提升', icon: <ImageIcon className="w-4 h-4" />, description: '提升图像材质质感，增强真实感和细节表现', disabled: false, maxImages: 10 },
    { id: 'layout', name: '排版转效果图', icon: <ImageIcon className="w-4 h-4" />, description: '平面布局图生成3D效果图', disabled: false, maxImages: 10 },
    { id: 'local', name: '局部调整', icon: <Layers className="w-4 h-4" />, needsMask: true, description: '精准编辑图像的特定区域', disabled: false, maxImages: 10 }
  ]

  const currentPreset = presets.find(p => p.id === selectedPreset)

  // 处理多图上传
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files)

    // 获取当前预设的最大图片限制
    const maxImages = currentPreset?.maxImages || 10
    const currentTotal = uploadedImages.length + files.length

    if (currentTotal > maxImages) {
      alert(`当前功能"${currentPreset?.name}"最多上传 ${maxImages} 张图片`)
      return
    }

    const newImages = []
    let loadedCount = 0

    files.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`文件 ${file.name} 超过10MB限制`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push({
          id: Date.now() + index,
          url: e.target.result,
          name: file.name
        })
        loadedCount++

        if (loadedCount === files.length) {
          setUploadedImages([...uploadedImages, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // 删除图片
  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1))
    }
  }

  // 生成图像
  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('请输入需求描述')
      return
    }

    if (uploadedImages.length === 0 && selectedPreset !== 'general') {
      alert('请先上传图片')
      return
    }

    // 遮罩编辑器已隐藏，不再验证遮罩数据
    // if (currentPreset?.needsMask && !maskData) {
    //   alert('该功能需要使用遮罩编辑器标记区域')
    //   return
    // }

    setIsGenerating(true)
    setProgress(0)

    try {
      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90))
      }, 500)

      // 处理提示词 - 根据预设使用不同的框架
      let finalPrompt = description

      // 家具替换模式：使用 NanoBanana Framework
      if (selectedPreset === 'furniture' && needsExpansion(description)) {
        try {
          finalPrompt = buildPromptWithNanoBanana(description, uploadedImages.length)
          if (import.meta.env.DEV) {
            console.log('原始输入:', description)
            console.log('使用 NanoBanana Framework (家具替换)')
            console.log('提示词长度:', finalPrompt.length, '字符')
          }
        } catch (error) {
          console.error('构建提示失败，使用原始输入:', error)
          finalPrompt = description
        }
      }
      // 白膜出图模式：使用 White Model Framework（可选启用）
      else if (selectedPreset === 'white_model' && needsExpansion(description)) {
        try {
          finalPrompt = buildWhiteModelPrompt(description, uploadedImages.length)
          if (import.meta.env.DEV) {
            console.log('原始输入:', description)
            console.log('使用 White Model Framework')
            console.log('提示词长度:', finalPrompt.length, '字符')
          }
        } catch (error) {
          console.error('构建提示失败，使用原始输入:', error)
          finalPrompt = description
        }
      }
      // 质感提升模式：使用 Texture Enhancement Framework（可选启用）
      else if (selectedPreset === 'sketch' && needsExpansion(description)) {
        try {
          finalPrompt = buildTextureEnhancePrompt(description, uploadedImages.length)
          if (import.meta.env.DEV) {
            console.log('原始输入:', description)
            console.log('使用 Texture Enhancement Framework')
            console.log('提示词长度:', finalPrompt.length, '字符')
          }
        } catch (error) {
          console.error('构建提示失败，使用原始输入:', error)
          finalPrompt = description
        }
      }
      // 排版转效果图模式：使用 Layout Framework（可选启用）
      else if (selectedPreset === 'layout' && needsExpansion(description)) {
        try {
          finalPrompt = buildLayoutPrompt(description, uploadedImages.length)
          if (import.meta.env.DEV) {
            console.log('原始输入:', description)
            console.log('使用 Layout Framework')
            console.log('提示词长度:', finalPrompt.length, '字符')
          }
        } catch (error) {
          console.error('构建提示失败，使用原始输入:', error)
          finalPrompt = description
        }
      }
      // 局部调整模式：使用 Local Edit Framework（可选启用）
      else if (selectedPreset === 'local' && needsExpansion(description)) {
        try {
          finalPrompt = buildLocalEditPrompt(description, uploadedImages.length)
          if (import.meta.env.DEV) {
            console.log('原始输入:', description)
            console.log('使用 Local Edit Framework')
            console.log('提示词长度:', finalPrompt.length, '字符')
          }
        } catch (error) {
          console.error('构建提示失败，使用原始输入:', error)
          finalPrompt = description
        }
      }
      // 其他模式或长提示词：直接使用用户输入
      else {
        if (import.meta.env.DEV) {
          console.log('直接使用用户输入（已经是完整提示或不需要扩写）')
        }
      }

      // 构建图片列表（支持多图输入）
      const imageList = uploadedImages.length > 0
        ? uploadedImages.map(img => img.url)
        : []

      console.log('准备发送的图片数量:', imageList.length)

      // 调用图像生成API
      // finalPrompt 已经包含了 NanoBanana Framework（如果需要的话）
      // Gemini 会直接理解并生成图片
      const result = await generateImage({
        prompt: finalPrompt,
        preset: selectedPreset,
        image: imageList.length === 1 ? imageList[0] : null,  // 单图保持向后兼容
        images: imageList.length > 1 ? imageList : null,       // 多图使用新字段
        mask: maskData,
        width: 1024,
        height: 1024,
        numImages: 1
      })

      clearInterval(progressInterval)
      setProgress(100)

      // 显示生成结果
      setGeneratedImages(result.images || [])

    } catch (error) {
      console.error('生成失败:', error)
      alert('生成失败: ' + error.message)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background flex dark">
      {/* Sidebar */}
      <div className="w-72 bg-card border-r flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">
              AI设计助手
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-3" />
            首页
          </Button>
          <Button 
            variant="default" 
            className="w-full justify-start bg-primary"
          >
            <Sparkles className="w-4 h-4 mr-3" />
            工作台
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/history')}
          >
            <Clock className="w-4 h-4 mr-3" />
            历史记录
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：标题 */}
            <div>
              <h1 className="text-2xl font-bold">AI图像生成工作台</h1>
              <p className="text-sm text-muted-foreground mt-1">
                上传图片，输入需求，智能生成专业室内设计效果图
              </p>
            </div>

            {/* 右侧：用户信息和操作 */}
            <div className="flex items-center gap-3">
              {/* 用户邮箱 */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>

              {/* 设置按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* 退出登录按钮 */}
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={async () => {
                  await signOut()
                  navigate('/login')
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Panel - 输入区 */}
              <div className="space-y-6">
                
                {/* 图片上传 */}
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    上传图片（最多{currentPreset?.maxImages || 10}张）
                  </h3>
                  
                  {/* 上传按钮 */}
                  <div className="mb-4">
                    <label className="block">
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">点击上传或拖拽图片</p>
                        <p className="text-xs text-muted-foreground">
                          支持 JPG, PNG, WEBP，单个文件不超过10MB
                          {currentPreset?.maxImages === 1 && '，仅支持单张图片'}
                          {currentPreset?.maxImages === 2 && '，最多2张图片'}
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImagesUpload}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>

                  {/* 已上传图片列表 */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        已上传 {uploadedImages.length} 张图片
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {uploadedImages.map((img, index) => (
                          <div
                            key={img.id}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                              selectedImageIndex === index ? 'border-primary' : 'border-border'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeImage(index)
                              }}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                              图{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 遮罩编辑器 */}
                {true && currentPreset?.needsMask && uploadedImages.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" />
                      遮罩编辑器
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        使用画笔工具涂抹需要替换或调整的区域，系统会智能处理该区域
                      </p>
                    </div>
                    <MaskEditor
                      imageUrl={uploadedImages[selectedImageIndex]?.url}
                      onMaskChange={setMaskData}
                    />
                  </div>
                )}

                {/* 功能预设 */}
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">功能预设</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {presets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => !preset.disabled && setSelectedPreset(preset.id)}
                        disabled={preset.disabled}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          preset.disabled
                            ? 'opacity-50 cursor-not-allowed border-border bg-muted/30'
                            : selectedPreset === preset.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {preset.icon}
                          <span className="font-medium text-sm">{preset.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {preset.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 需求描述 */}
                <div className="bg-card rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">需求描述</h3>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="例如：把第二张图的蓝色椅子放到第一张图的沙发旁边&#10;或：将这个客厅改成现代简约风格，使用浅色木地板和灰色布艺沙发"
                    className="min-h-32 bg-muted/50 border-border focus:border-primary"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    {description.length} 字符
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 mt-3 flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      💡 提示：直接用中文描述需求即可，系统会自动优化提示词以获得最佳效果
                    </p>
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      生成中... {progress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      生成图像
                    </>
                  )}
                </Button>

                {/* 进度条 */}
                {isGenerating && (
                  <div className="bg-card rounded-xl p-6 border">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>生成进度</span>
                        <span className="text-primary font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {progress < 30 && '正在分析图像...'}
                        {progress >= 30 && progress < 60 && '正在优化提示词...'}
                        {progress >= 60 && progress < 90 && '正在生成图像...'}
                        {progress >= 90 && '即将完成...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - 预览和结果区 */}
              <div className="space-y-6">
                
                {/* 当前选中图片预览 */}
                {uploadedImages.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-4">
                      当前选中：图片 {selectedImageIndex + 1}
                    </h3>
                    <div className="rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={uploadedImages[selectedImageIndex]?.url}
                        alt="预览"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}

                {/* 生成结果 */}
                {generatedImages.length > 0 && (
                  <div className="bg-card rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-4">生成结果</h3>
                    <div className="space-y-4">
                      {generatedImages.map((img, index) => (
                        <div key={index} className="space-y-3">
                          <div className="rounded-lg overflow-hidden bg-muted/30">
                            <img
                              src={img.url}
                              alt={`生成结果 ${index + 1}`}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Heart className="w-4 h-4 mr-1" />
                              收藏
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Share2 className="w-4 h-4 mr-1" />
                              分享
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 空状态 */}
                {uploadedImages.length === 0 && generatedImages.length === 0 && (
                  <div className="bg-card rounded-xl p-12 border text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">开始创作</h3>
                    <p className="text-sm text-muted-foreground">
                      上传图片并输入需求，即可生成专业的室内设计效果图
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

