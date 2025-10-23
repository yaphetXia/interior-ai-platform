-- 创建生成历史记录表
CREATE TABLE IF NOT EXISTS generation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    preset VARCHAR(50),
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    storage_paths TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at ON generation_history(created_at DESC);

-- 启用 RLS (Row Level Security)
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看和操作自己的记录
CREATE POLICY "用户只能查看自己的生成历史"
    ON generation_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的生成历史"
    ON generation_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的生成历史"
    ON generation_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_generation_history_updated_at
    BEFORE UPDATE ON generation_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 创建 Storage bucket (如果不存在)
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- 设置 Storage RLS 策略
CREATE POLICY "用户可以上传自己的图片"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'generated-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "用户可以查看所有公开图片"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'generated-images');

CREATE POLICY "用户可以删除自己的图片"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'generated-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
