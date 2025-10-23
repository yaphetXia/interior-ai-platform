import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Grid3x3, 
  List,
  Calendar,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Edit,
  Download
} from 'lucide-react'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')

  // 模拟项目数据
  const projects = [
    {
      id: 1,
      name: '现代简约客厅方案',
      date: '2025-10-10',
      imageCount: 12,
      thumbnail: null
    },
    {
      id: 2,
      name: '新中式卧室设计',
      date: '2025-10-08',
      imageCount: 8,
      thumbnail: null
    },
    {
      id: 3,
      name: '北欧风餐厅改造',
      date: '2025-10-05',
      imageCount: 15,
      thumbnail: null
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">我的项目</h1>
              <p className="text-muted-foreground">管理和查看所有设计项目</p>
            </div>
            <Button onClick={() => navigate('/workspace')}>
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>

          {/* 搜索和视图切换 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">还没有项目</h3>
            <p className="text-muted-foreground mb-6">创建第一个项目开始设计吧</p>
            <Button onClick={() => navigate('/workspace')}>
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-card"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-muted-foreground opacity-50" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {project.imageCount} 张
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{project.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.date}</span>
                    <span>{project.imageCount} 张图片</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

