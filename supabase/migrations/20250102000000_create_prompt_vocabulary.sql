-- 创建提示词词汇表
CREATE TABLE IF NOT EXISTS prompt_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    chinese_term TEXT NOT NULL,
    english_term TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_prompt_vocabulary_category ON prompt_vocabulary(category);
CREATE INDEX IF NOT EXISTS idx_prompt_vocabulary_chinese ON prompt_vocabulary(chinese_term);

-- 启用 RLS (Row Level Security)
ALTER TABLE prompt_vocabulary ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：所有人可读（公开词汇表）
CREATE POLICY "允许所有人查看词汇表"
    ON prompt_vocabulary
    FOR SELECT
    USING (true);

-- 创建更新时间戳的触发器
CREATE TRIGGER update_prompt_vocabulary_updated_at
    BEFORE UPDATE ON prompt_vocabulary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入初始词汇数据

-- 1. 动作 (action) - 4条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('action', '替换', 'Replace', 1),
('action', '添加', 'Add', 2),
('action', '转换', 'Transform', 3),
('action', '融入', 'Incorporate', 4);

-- 2. 对象 (object) - 13条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('object', '天花板', 'ceiling', 1),
('object', '椅子', 'chair', 2),
('object', '扶手椅', 'armchair', 3),
('object', '地毯', 'carpet', 4),
('object', '毯子', 'rug', 5),
('object', '桌子', 'table', 6),
('object', '花艺', 'floral arrangement', 7),
('object', '中心装饰', 'centerpiece', 8),
('object', '人物', 'figure', 9),
('object', '女性', 'woman', 10),
('object', '男性', 'man', 11),
('object', '大堂', 'lobby', 12),
('object', '接待区', 'reception area', 13);

-- 3. 光影 (lighting) - 5条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('lighting', '明亮自然光', 'bright natural daylight', 1),
('lighting', '温暖环境光', 'warm ambient indoor lighting', 2),
('lighting', '柔和漫射光', 'soft diffused lighting', 3),
('lighting', '投射阴影', 'subtle cast shadows', 4),
('lighting', '夜间氛围', 'nighttime ambiance lighting', 5);

-- 4. 色彩与风格 (color_style) - 7条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('color_style', '暖色调', 'warm tones', 1),
('color_style', '中性色调', 'neutral palette', 2),
('color_style', '丰富色调', 'rich palette', 3),
('color_style', '单色线条', 'monochromatic black and white', 4),
('color_style', '侘寂风', 'Wabi-sabi style', 5),
('color_style', '手绘线稿', 'hand-drawn line art style', 6),
('color_style', '极简日式', 'Japanese minimalist', 7);

-- 5. 效果要求 (integration) - 4条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('integration', '无缝融合', 'seamless integration', 1),
('integration', '保持逼真', 'photorealistic integration', 2),
('integration', '保持透视', 'maintain perspective', 3),
('integration', '保持空间格局', 'maintain original spatial layout', 4);

-- 6. 摄影表现 (camera) - 4条
INSERT INTO prompt_vocabulary (category, chinese_term, english_term, sort_order) VALUES
('camera', '尼康相机', 'Capture with Nikon D850', 1),
('camera', '专业室内摄影', 'professional interior photography look', 2),
('camera', '夜间风格', '10 PM ambiance style', 3),
('camera', '室内摄影效果', 'interior space photography result', 4);
