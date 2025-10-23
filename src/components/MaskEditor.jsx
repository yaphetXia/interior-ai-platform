import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Eraser, Paintbrush, RotateCcw, Download } from 'lucide-react'

export default function MaskEditor({ imageUrl, onMaskChange }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [mode, setMode] = useState('draw') // 'draw' or 'erase'
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)

  // 初始化canvas
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    setContext(ctx)

    // 加载图像
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // 设置canvas尺寸
      const maxWidth = 800
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      // 绘制图像
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      setImage(img)
    }
    img.src = imageUrl

    // 清理函数：确保在组件卸载时清理 Canvas
    return () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [imageUrl])

  // 获取鼠标/触摸位置
  const getPosition = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }, [])

  // 开始绘制
  const startDrawing = useCallback((e) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getPosition(e)
    if (context) {
      context.beginPath()
      context.moveTo(pos.x, pos.y)
    }
  }, [context, getPosition])

  // 绘制中
  const draw = useCallback((e) => {
    if (!isDrawing || !context) return
    e.preventDefault()

    const pos = getPosition(e)
    
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = brushSize

    if (mode === 'draw') {
      // 绘制遮罩（半透明红色）
      context.strokeStyle = 'rgba(255, 0, 0, 0.5)'
      context.globalCompositeOperation = 'source-over'
    } else {
      // 擦除遮罩（恢复原图）
      context.globalCompositeOperation = 'destination-out'
    }

    context.lineTo(pos.x, pos.y)
    context.stroke()
    context.beginPath()
    context.moveTo(pos.x, pos.y)
  }, [isDrawing, context, brushSize, mode, getPosition])

  // 停止绘制
  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      if (context) {
        context.closePath()
      }
      // 通知父组件遮罩已更改
      if (onMaskChange && canvasRef.current) {
        onMaskChange(canvasRef.current.toDataURL())
      }
    }
  }, [isDrawing, context, onMaskChange])

  // 清除遮罩
  const clearMask = useCallback(() => {
    if (!context || !image || !canvasRef.current) return
    
    const canvas = canvasRef.current
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    
    if (onMaskChange) {
      onMaskChange(null)
    }
  }, [context, image, onMaskChange])

  // 下载遮罩
  const downloadMask = useCallback(() => {
    if (!canvasRef.current) return
    
    const link = document.createElement('a')
    link.download = 'mask.png'
    link.href = canvasRef.current.toDataURL()
    link.click()
  }, [])

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === 'draw' ? 'default' : 'outline'}
            onClick={() => setMode('draw')}
          >
            <Paintbrush className="w-4 h-4 mr-2" />
            绘制
          </Button>
          <Button
            size="sm"
            variant={mode === 'erase' ? 'default' : 'outline'}
            onClick={() => setMode('erase')}
          >
            <Eraser className="w-4 h-4 mr-2" />
            擦除
          </Button>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">画笔大小</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            min={5}
            max={100}
            step={5}
            className="flex-1 max-w-xs"
          />
          <span className="text-sm font-medium w-8">{brushSize}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={clearMask}>
            <RotateCcw className="w-4 h-4 mr-2" />
            清除
          </Button>
          <Button size="sm" variant="outline" onClick={downloadMask}>
            <Download className="w-4 h-4 mr-2" />
            下载
          </Button>
        </div>
      </div>

      {/* Canvas画布 */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden border">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
        
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p>请先上传图像</p>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>💡 提示：使用画笔工具在需要替换的区域涂抹，红色区域将被AI重新生成</p>
      </div>
    </div>
  )
}

