-- 添加url字段到jobs表
-- 这个脚本需要在Supabase SQL编辑器中运行

-- 添加url字段
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS url TEXT;

-- 验证字段是否添加成功
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'jobs' AND column_name = 'url'; 