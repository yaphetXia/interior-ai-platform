import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Image, Video, Box, Check, ArrowRight, Menu, X } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Image className="w-8 h-8" />,
      title: '家具替换',
      description: '智能识别并替换家具，保持原有光影效果'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: '白膜出图',
      description: '从3D白模快速生成真实材质效果图'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '线稿出图',
      description: '手绘草图秒变专业效果图'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: '视频生成',
      description: '静态效果图转动态漫游视频'
    },
    {
      icon: <Box className="w-8 h-8" />,
      title: '3D模型',
      description: '效果图反向生成3D模型'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: '批量处理',
      description: '一次处理多个空间方案'
    }
  ]

  const pricingPlans = [
    {
      name: '免费版',
      price: '¥0',
      period: '/月',
      features: ['每月10次图像生成', '基础功能', '带水印', '1024x1024分辨率'],
      buttonText: '免费开始',
      highlighted: false
    },
    {
      name: '基础版',
      price: '¥99',
      period: '/月',
      features: ['每月200次图像生成', '所有专业预设', '无水印', '2048x2048分辨率', '智能提示词优化'],
      buttonText: '立即订阅',
      highlighted: false
    },
    {
      name: '专业版',
      price: '¥299',
      period: '/月',
      features: ['每月600次图像生成', '视频生成(20次/月)', '3D模型生成(10次/月)', '4096x4096分辨率', '优先队列', '项目管理'],
      buttonText: '立即订阅',
      highlighted: true
    },
    {
      name: '企业版',
      price: '¥1999',
      period: '/月起',
      features: ['无限次数或大额包', 'API接口访问', '私有化部署', '专属客户经理', 'SLA保障', '品牌定制'],
      buttonText: '联系我们',
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">
              AI设计助手
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">功能</a>
            <a href="#pricing" className="hover:text-primary transition-colors cursor-pointer">定价</a>
            <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors">关于</button>
            <Button 
              onClick={() => navigate('/workspace')}
              className="bg-primary hover:bg-primary/90"
            >
              进入工作台
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className="block py-2">功能</a>
              <a href="#pricing" className="block py-2">定价</a>
              <button onClick={() => navigate('/about')} className="block py-2 w-full text-left">关于</button>
              <Button onClick={() => navigate('/workspace')} className="w-full">
                进入工作台
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 gradient-bg">
        <div className="max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-8 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI赋能室内设计</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">
              30秒生成
            </span>
            <br />
            <span className="text-white drop-shadow-lg">
              专业效果图
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            智能提示词优化 · 专业功能预设 · 一键生成高质量渲染图
            <br />
            为中国室内设计师打造的AI创作平台
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate('/workspace')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 group"
            >
              免费开始
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-6"
            >
              观看演示
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-white/80">生成图像</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">节省小时</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30秒</div>
              <div className="text-white/80">平均生成时间</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">专为室内设计师打造</h2>
            <p className="text-xl text-muted-foreground">丰富的专业功能预设，让AI真正理解你的需求</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index
                    ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 transform -translate-y-2 shadow-lg'
                    : 'bg-card border-border hover:border-primary/30'
                }`}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  hoveredFeature === index ? 'bg-primary/30 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">选择适合你的方案</h2>
            <p className="text-xl text-muted-foreground">灵活的订阅制，随时升级或取消</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 transform scale-105 shadow-xl'
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full mb-4">
                    最受欢迎
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => {
                    if (plan.buttonText === '免费开始') {
                      navigate('/workspace')
                    } else if (plan.buttonText === '联系我们') {
                      navigate('/about')
                    } else {
                      navigate('/settings')
                    }
                  }}
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-secondary hover:bg-secondary/90'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-bg rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">准备好提升设计效率了吗？</h2>
            <p className="text-xl text-white/90 mb-8">
              立即开始，免费体验AI设计助手的强大功能
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/workspace')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              免费开始创作
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">AI设计助手</span>
              </div>
              <p className="text-sm text-muted-foreground">
                专为中国室内设计师打造的AI创作平台
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">产品</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">功能介绍</a></li>
                <li><a href="#pricing" className="hover:text-foreground">定价方案</a></li>
                <li><a href="#" className="hover:text-foreground">API文档</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">公司</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/about')} className="hover:text-foreground">关于我们</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-foreground">团队介绍</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-foreground">联系我们</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">支持</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">帮助中心</a></li>
                <li><a href="#" className="hover:text-foreground">用户协议</a></li>
                <li><a href="#" className="hover:text-foreground">隐私政策</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 AI设计助手. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

