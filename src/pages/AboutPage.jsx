import { Button } from '@/components/ui/button'
import { Sparkles, Users, Target, Award, Mail, MapPin, Phone } from 'lucide-react'

export default function AboutPage() {
  const team = [
    { name: '张明', role: 'CEO & 创始人', avatar: null },
    { name: '李华', role: 'CTO', avatar: null },
    { name: '王芳', role: '产品总监', avatar: null },
    { name: '刘强', role: '设计总监', avatar: null }
  ]

  const cases = [
    {
      title: '某知名地产公司样板间设计',
      description: '为客户快速生成50+套样板间效果图，缩短设计周期70%',
      stats: '节省成本: ¥200,000+'
    },
    {
      title: '中型设计工作室效率提升',
      description: '帮助工作室实现设计流程数字化，月产能提升3倍',
      stats: '效率提升: 300%'
    },
    {
      title: '独立设计师创业成功',
      description: '降低创业门槛，帮助设计师快速响应客户需求',
      stats: '客户满意度: 95%'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">关于我们</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">让AI赋能每一位设计师</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            我们致力于打造最专业的室内设计AI工具，帮助设计师提升效率、降低成本、释放创造力
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">我们的使命</h3>
            <p className="text-muted-foreground">
              通过AI技术降低设计门槛，让每一位设计师都能高效创作出专业级作品
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">我们的愿景</h3>
            <p className="text-muted-foreground">
              成为中国室内设计师最信赖的AI创作平台，推动行业数字化转型
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">我们的价值观</h3>
            <p className="text-muted-foreground">
              专业、创新、高效、以用户为中心，持续为设计师创造价值
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">核心团队</h2>
            <p className="text-muted-foreground">来自顶尖科技公司和设计机构的专业团队</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">成功案例</h2>
          <p className="text-muted-foreground">已帮助数千位设计师提升效率</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((case_, index) => (
            <div key={index} className="border rounded-xl p-6 hover:shadow-lg transition-shadow bg-card">
              <h3 className="font-semibold mb-3">{case_.title}</h3>
              <p className="text-muted-foreground mb-4">{case_.description}</p>
              <div className="text-sm font-medium text-primary">{case_.stats}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">联系我们</h2>
            <p className="text-muted-foreground">有任何问题或合作意向，欢迎联系我们</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="font-medium mb-1">邮箱</p>
              <p className="text-sm text-muted-foreground">contact@aidesign.com</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="font-medium mb-1">电话</p>
              <p className="text-sm text-muted-foreground">400-888-8888</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="font-medium mb-1">地址</p>
              <p className="text-sm text-muted-foreground">北京市朝阳区xxx大厦</p>
            </div>
          </div>
          <div className="text-center">
            <Button size="lg">
              <Mail className="w-4 h-4 mr-2" />
              发送邮件
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

