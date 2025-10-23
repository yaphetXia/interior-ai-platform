import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, CreditCard, Bell, Shield, Key } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '设计师',
    email: 'designer@example.com',
    phone: '138****8888'
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">账户设置</h1>
          <p className="text-muted-foreground">管理您的账户信息和偏好设置</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              个人信息
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="w-4 h-4 mr-2" />
              订阅管理
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              通知设置
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              安全设置
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="w-4 h-4 mr-2" />
              API密钥
            </TabsTrigger>
          </TabsList>

          {/* 个人信息 */}
          <TabsContent value="profile" className="space-y-6">
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">基本信息</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <Button>保存更改</Button>
              </div>
            </div>
          </TabsContent>

          {/* 订阅管理 */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">当前套餐</h3>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold">基础版</p>
                  <p className="text-muted-foreground">¥99/月</p>
                </div>
                <Button>升级套餐</Button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">本月已用额度</span>
                  <span className="font-medium">45 / 200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">下次续费日期</span>
                  <span className="font-medium">2025-11-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">自动续费</span>
                  <span className="font-medium text-green-600">已开启</span>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">账单历史</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">2025-10-15</p>
                    <p className="text-sm text-muted-foreground">基础版月费</p>
                  </div>
                  <span className="font-medium">¥99.00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">2025-09-15</p>
                    <p className="text-sm text-muted-foreground">基础版月费</p>
                  </div>
                  <span className="font-medium">¥99.00</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 通知设置 */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">通知偏好</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">生成完成通知</p>
                    <p className="text-sm text-muted-foreground">图像生成完成后发送通知</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">额度提醒</p>
                    <p className="text-sm text-muted-foreground">额度即将用完时提醒</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">功能更新</p>
                    <p className="text-sm text-muted-foreground">新功能上线时通知</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 安全设置 */}
          <TabsContent value="security" className="space-y-6">
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">密码管理</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">当前密码</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password">新密码</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>更新密码</Button>
              </div>
            </div>
          </TabsContent>

          {/* API密钥 */}
          <TabsContent value="api" className="space-y-6">
            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">API访问密钥</h3>
              <p className="text-sm text-muted-foreground mb-4">
                仅企业版用户可使用API接口。请妥善保管您的API密钥，不要泄露给他人。
              </p>
              <div className="space-y-4">
                <div>
                  <Label>API密钥</Label>
                  <div className="flex gap-2">
                    <Input value="sk-xxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                    <Button variant="outline">复制</Button>
                  </div>
                </div>
                <Button variant="destructive">重新生成密钥</Button>
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">API使用统计</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">本月调用次数</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">总调用次数</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

