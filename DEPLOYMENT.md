# 部署完成指南

## ✅ 已完成的自动化部署

以下步骤已通过 CLI 自动完成：

1. ✅ Edge Function 已部署到 Supabase
   - 函数名称: `generate-image`
   - 使用模型: `gemini-2.5-flash-image`（Google AI Studio）
   - 项目 ID: `glnsizwohuzzlsknoxjf`

2. ✅ 数据库表已创建
   - 表名: `generation_history`
   - 包含字段: id, user_id, prompt, preset, image_urls, storage_paths, created_at, updated_at
   - 已启用 RLS (Row Level Security)
   - 已创建索引和触发器

3. ✅ Storage Bucket 已创建
   - Bucket 名称: `generated-images`
   - 访问权限: 公开读取
   - 已配置 RLS 策略

---

## ⚠️ 需要手动完成的配置

由于账户权限限制，以下配置需要在 Supabase Dashboard 中手动完成：

### 1. 设置 Edge Function 环境变量

**步骤：**

1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/glnsizwohuzzlsknoxjf

2. 导航到: **Edge Functions** → **generate-image** → **Settings**

3. 在 **Secrets** 或 **Environment Variables** 部分添加以下变量：

   ```
   GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
   GEMINI_API_KEY=AIzaSyAmKzx2r4ovCcjPZq79kX-7nk3VipPgK2Q
   GEMINI_MODEL=gemini-2.5-flash-image
   ```

4. 点击 **Save** 保存配置

⚠️ **重要**: 设置环境变量后，Edge Function 会自动重新部署。等待部署完成（通常 10-30 秒）。

---

### 2. 创建测试用户

**步骤：**

1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/glnsizwohuzzlsknoxjf

2. 导航到: **Authentication** → **Users**

3. 点击 **Add user** → **Create new user**

4. 填写信息：
   - Email: 你的测试邮箱（例如: test@example.com）
   - Password: 设置一个强密码（至少 6 位）
   - Auto Confirm User: **勾选** （跳过邮箱验证）

5. 点击 **Create user**

---

### 3. 验证 Storage Bucket 配置

**步骤：**

1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/glnsizwohuzzlsknoxjf

2. 导航到: **Storage**

3. 确认存在名为 `generated-images` 的 bucket

4. 点击 bucket 名称，进入设置

5. 验证配置：
   - **Public bucket**: 应该是 **开启** 状态
   - **File size limit**: 建议设置为 50MB
   - **Allowed MIME types**: `image/*` 或留空（允许所有类型）

---

## 🧪 测试应用

完成上述配置后，按照以下步骤测试应用：

### 1. 启动开发服务器

```bash
cd /Users/xiayuan/AI设计项目/interior-ai-platform-complete-archive/interior-ai-platform
npm run dev
```

### 2. 访问应用

打开浏览器访问: http://localhost:5173

### 3. 测试登录

1. 页面会自动跳转到登录页面
2. 使用你创建的测试用户登录
3. 登录成功后应该跳转到工作台页面

### 4. 测试图像生成

1. 在工作台中选择一个预设（例如：通用生成）
2. 输入提示词，例如: "modern living room with minimalist design"
3. 点击"生成"按钮
4. 等待图像生成（通常需要 10-30 秒）
5. 查看生成的图像

### 5. 测试历史记录

1. 点击顶部导航的"历史记录"
2. 应该能看到刚才生成的记录
3. 测试下载和删除功能

---

## 🔍 常见问题排查

### Edge Function 调用失败

**问题**: 生成图像时报错 "API Key 未配置"

**解决方案**:
1. 检查 Edge Function 环境变量是否正确设置
2. 在 Supabase Dashboard 中查看 Edge Function 日志
3. 确保 Edge Function 已重新部署（设置环境变量后会自动重新部署）

---

### 图片上传失败

**问题**: 生成的图片无法保存

**解决方案**:
1. 检查 `generated-images` bucket 是否存在
2. 检查 bucket 的 RLS 策略是否正确
3. 查看浏览器控制台的错误信息

---

### 登录后无法生成图像

**问题**: 提示"用户未登录"或认证错误

**解决方案**:
1. 清除浏览器缓存和 localStorage
2. 重新登录
3. 检查 `.env` 文件中的 Supabase 配置是否正确

---

## 📝 环境变量清单

确保 `.env` 文件包含以下配置：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://glnsizwohuzzlsknoxjf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbnNpendvaHV6emxza25veGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTAzMDksImV4cCI6MjA3NjM4NjMwOX0.stbzwEXkXNtp_CrUEALtdGaJcBoS5n9Gs4xdASbsS44

# Google AI Studio (Gemini) API 配置（前端配置，仅用于显示，实际调用在 Edge Function）
VITE_GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
VITE_GEMINI_API_KEY=AIzaSyAmKzx2r4ovCcjPZq79kX-7nk3VipPgK2Q
VITE_GEMINI_MODEL=gemini-2.5-flash-image

# 其他配置
VITE_APP_ENV=development
VITE_API_TIMEOUT=120000
VITE_MAX_IMAGES_PER_GENERATION=4
```

---

## 🎉 部署完成！

完成以上步骤后，你的室内设计 AI 平台就完全部署好了！

如有任何问题，请检查：
1. Supabase Dashboard 的 Edge Function 日志
2. 浏览器开发者工具的控制台
3. Network 面板的 API 请求响应
