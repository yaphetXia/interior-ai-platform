# Generate Image Edge Function

这个 Supabase Edge Function 用于：
1. 接收前端的图像生成请求
2. 调用 Gemini API (api.wfei.site) 生成图像
3. 将生成的图像上传到 Supabase Storage
4. 保存生成历史记录到数据库
5. 返回图像 URL 给前端

## 前置要求

1. 安装 Supabase CLI
```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

2. 登录 Supabase CLI
```bash
supabase login
```

3. 关联到你的 Supabase 项目
```bash
supabase link --project-ref your-project-ref
```

## 环境变量配置

在 Supabase Dashboard 中配置以下 Edge Function 环境变量：

1. 进入 Supabase Dashboard > Edge Functions > Secrets
2. 添加以下环境变量：

```
GEMINI_API_ENDPOINT=https://api.wfei.site
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-image
```

## 部署

```bash
# 部署 Edge Function
supabase functions deploy generate-image

# 查看日志
supabase functions logs generate-image
```

## 测试

本地测试：
```bash
supabase functions serve generate-image --env-file ./supabase/.env.local
```

## 注意事项

### 需要根据实际 API 修改的地方

`index.ts` 文件中标记了 `TODO` 的地方需要根据你的 api.wfei.site 实际 API 格式修改：

1. **API 端点路径**（第92行）
   ```typescript
   // 当前: ${geminiEndpoint}/v1/generate
   // 需要修改为实际的端点路径
   ```

2. **请求体格式**（第85-93行）
   ```typescript
   // 根据 api.wfei.site 的实际请求格式修改
   const geminiRequestBody = { ... }
   ```

3. **响应解析**（第109行）
   ```typescript
   // 根据实际响应格式修改
   const generatedImages = geminiData.images || []
   ```

4. **图片数据提取**（第117-122行）
   ```typescript
   // 根据实际返回的图片格式修改（Base64/URL/Blob等）
   ```

### 数据库表结构

确保在 Supabase Dashboard 中创建了 `generation_history` 表：

```sql
CREATE TABLE generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  preset VARCHAR(50),
  image_urls TEXT[],
  storage_paths TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加索引提升查询性能
CREATE INDEX idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX idx_generation_history_created_at ON generation_history(created_at DESC);
```

### Storage Bucket

确保创建了 `generated-images` Storage Bucket：

```sql
-- 在 Supabase Dashboard > Storage 中创建 bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true);

-- 设置访问策略
CREATE POLICY "用户可以查看自己的图片"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "用户可以上传图片"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 故障排查

1. **认证失败**
   - 检查前端是否正确传递了 Authorization header
   - 确认 Supabase JWT token 有效

2. **Gemini API 调用失败**
   - 检查 GEMINI_API_KEY 环境变量是否正确设置
   - 查看 Edge Function 日志获取详细错误信息
   - 验证 API 端点和请求格式是否正确

3. **图片上传失败**
   - 确认 Storage Bucket 已创建
   - 检查 Storage 访问策略是否正确
   - 验证图片 Base64 编码是否正确

4. **历史记录保存失败**
   - 确认数据库表已创建
   - 检查 RLS (Row Level Security) 策略
