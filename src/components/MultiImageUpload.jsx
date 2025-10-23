import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function MultiImageUpload({ maxImages = 10, onImagesChange }) {
  const [images, setImages] = useState([])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    const remainingSlots = maxImages - images.length
    
    if (files.length > remainingSlots) {
      alert(`最多只能上传${maxImages}张图片，当前还可上传${remainingSlots}张`)
      return
    }

    const newImages = []
    let loaded = 0

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        alert(`文件 ${file.name} 不是图片格式`)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`文件 ${file.name} 超过10MB限制`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push({
          id: Date.now() + index,
          file: file,
          url: e.target.result,
          name: file.name
        })
        
        loaded++
        if (loaded === files.length) {
          const updatedImages = [...images, ...newImages]
          setImages(updatedImages)
          if (onImagesChange) {
            onImagesChange(updatedImages)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }, [images, maxImages, onImagesChange])

  const removeImage = useCallback((id) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    if (onImagesChange) {
      onImagesChange(updatedImages)
    }
  }, [images, onImagesChange])

  const clearAll = useCallback(() => {
    setImages([])
    if (onImagesChange) {
      onImagesChange([])
    }
  }, [onImagesChange])

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      {images.length < maxImages && (
        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer">
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-foreground mb-1">拖拽图像到此处，或点击上传</p>
            <p className="text-sm text-muted-foreground">
              支持 JPG, PNG, WEBP，最大10MB，最多{maxImages}张
            </p>
            <p className="text-sm text-primary mt-2">
              已上传 {images.length} / {maxImages}
            </p>
          </div>
        </label>
      )}

      {/* 图片网格 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">已上传图片 ({images.length})</h3>
            <Button size="sm" variant="outline" onClick={clearAll}>
              <X className="w-4 h-4 mr-1" />
              清空全部
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden border bg-card"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                
                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>

                {/* 文件名 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>还没有上传图片</p>
        </div>
      )}
    </div>
  )
}

