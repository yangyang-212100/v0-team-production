# Supabase 数据库设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册账号
2. 创建新项目
3. 记录项目 URL 和 API Key

## 2. 设置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 3. 创建数据库表

在 Supabase 的 SQL 编辑器中运行 `database/schema.sql` 文件中的内容：

```sql
-- 创建 jobs 表
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT '已投递',
  applied_date DATE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 25,
  next_action VARCHAR(255),
  next_action_date DATE,
  description TEXT,
  requirements TEXT,
  salary VARCHAR(100),
  location VARCHAR(255),
  type VARCHAR(50) DEFAULT '全职',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 reminders 表
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  time TIME,
  date VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  type VARCHAR(50) DEFAULT '任务',
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 insights 表
CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  company VARCHAR(255),
  content TEXT,
  tags TEXT[],
  read_time VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. 插入示例数据

运行以下 SQL 插入示例数据：

```sql
-- 插入示例职位数据
INSERT INTO jobs (company, position, status, applied_date, progress, next_action, next_action_date, description, requirements, salary, location, type) VALUES
('腾讯', '高级前端工程师', '面试 - 第二轮', '2024-01-15', 60, '技术面试', '2024-01-20', '负责微信小程序开发平台的前端架构设计和开发', '5年以上前端开发经验，熟悉React、Vue.js，有小程序开发经验', '35-50万', '深圳', '全职'),
('阿里巴巴', '全栈开发工程师', '已投递', '2024-01-18', 25, '跟进HR', '2024-01-22', '负责淘宝商家后台系统的全栈开发', '熟悉Java、Spring Boot、React，有电商系统开发经验', '30-45万', '杭州', '全职'),
('字节跳动', '资深前端工程师', '电话筛选', '2024-01-10', 40, '准备现场面试', '2024-01-25', '负责抖音创作者工具的前端开发', '熟悉现代前端技术栈，有视频处理相关经验优先', '40-60万', '北京', '全职'),
('美团', '前端技术专家', '已完成', '2024-01-05', 100, '等待offer', '2024-01-28', '负责美团外卖商家端的前端技术架构', '7年以上前端经验，有大型项目架构经验', '45-65万', '北京', '全职');

-- 插入示例提醒数据
INSERT INTO reminders (title, time, date, company, type, completed, priority) VALUES
('跟进阿里巴巴HR', '10:00', '今天', '阿里巴巴', '跟进', false, 'high'),
('腾讯技术面试准备', '14:00', '明天', '腾讯', '面试', false, 'urgent'),
('提交字节跳动作业', '17:00', '1月23日', '字节跳动', '截止日期', false, 'high'),
('完成简历更新', '09:00', '今天', '通用', '任务', true, 'medium'),
('研究美团公司文化', '15:30', '昨天', '美团', '研究', true, 'low');

-- 插入示例洞察数据
INSERT INTO insights (title, description, type, company, content, tags, read_time) VALUES
('腾讯面试攻略', '基于最新面试经验总结的技巧分享', '面试', '腾讯', '腾讯面试注重基础能力和项目经验。技术面试通常包含算法题、系统设计和项目深挖。建议准备常见的前端算法题，了解微信生态的技术架构，准备好详细的项目介绍。行为面试会关注团队协作和学习能力。', ARRAY['面试技巧', '算法', '项目经验'], '5分钟'),
('阿里巴巴企业文化深度解析', '了解阿里的价值观和工作氛围', '文化', '阿里巴巴', '阿里巴巴秉承"让天下没有难做的生意"的使命，注重客户第一、团队合作、拥抱变化等价值观。工作节奏较快，但提供良好的成长机会。面试时要体现出对用户体验的关注和商业思维。', ARRAY['企业文化', '价值观', '工作环境'], '8分钟'),
('字节跳动相似职位推荐', '发现了3个匹配您背景的新职位', '职位', '字节跳动', '基于您的技能匹配，推荐以下职位：1. 抖音前端工程师 - 负责短视频相关功能开发；2. 今日头条全栈工程师 - 负责推荐系统前端展示；3. 飞书前端专家 - 负责协作工具的用户体验优化。', ARRAY['职位推荐', '技能匹配', '新机会'], '3分钟');
```

## 5. 设置行级安全策略 (RLS)

在 Supabase 中为每个表启用 RLS 并设置策略：

```sql
-- 为 jobs 表启用 RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（开发环境）
CREATE POLICY "Allow all operations" ON jobs FOR ALL USING (true);

-- 为 reminders 表启用 RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（开发环境）
CREATE POLICY "Allow all operations" ON reminders FOR ALL USING (true);

-- 为 insights 表启用 RLS
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（开发环境）
CREATE POLICY "Allow all operations" ON insights FOR ALL USING (true);
```

## 6. 验证设置

1. 启动开发服务器：`npm run dev`
2. 访问应用，检查是否能看到数据库中的数据
3. 尝试添加、编辑、删除数据，确认数据库操作正常

## 故障排除

### 问题：看不到数据
- 检查环境变量是否正确设置
- 确认数据库表已创建
- 检查浏览器控制台是否有错误信息

### 问题：无法添加数据
- 检查 RLS 策略设置
- 确认 API Key 权限
- 查看网络请求是否成功

### 问题：环境变量不生效
- 重启开发服务器
- 确认 `.env.local` 文件在项目根目录
- 检查变量名是否正确