-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 jobs 表
DROP TABLE IF EXISTS jobs CASCADE;
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
DROP TABLE IF EXISTS reminders CASCADE;
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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

-- 创建公司数据表（AI生成的公司级信息）
CREATE TABLE IF NOT EXISTS company_data (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) UNIQUE NOT NULL,
  culture TEXT,
  products TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建岗位洞察表（AI生成的岗位级信息）
CREATE TABLE IF NOT EXISTS position_insights (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  interview_experience TEXT,
  skill_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_name, position)
);

-- 首先插入用户数据
INSERT INTO users (id, username, password_hash) VALUES
(1, 'demo_user', 'ZGVtb191c2Vy') -- base64编码的 'demo_user'
ON CONFLICT (id) DO NOTHING;

-- 然后插入示例数据
INSERT INTO jobs (user_id, company, position, status, applied_date, progress, next_action, next_action_date, description, requirements, salary, location, type) VALUES
(1, '腾讯', '高级前端工程师', '面试 - 第二轮', '2024-01-15', 60, '技术面试', '2024-01-20', '负责微信小程序开发平台的前端架构设计和开发', '5年以上前端开发经验，熟悉React、Vue.js，有小程序开发经验', '35-50万', '深圳', '全职'),
(1, '阿里巴巴', '全栈开发工程师', '已投递', '2024-01-18', 25, '跟进HR', '2024-01-22', '负责淘宝商家后台系统的全栈开发', '熟悉Java、Spring Boot、React，有电商系统开发经验', '30-45万', '杭州', '全职'),
(1, '字节跳动', '资深前端工程师', '电话筛选', '2024-01-10', 40, '准备现场面试', '2024-01-25', '负责抖音创作者工具的前端开发', '熟悉现代前端技术栈，有视频处理相关经验优先', '40-60万', '北京', '全职'),
(1, '美团', '前端技术专家', '已完成', '2024-01-05', 100, '等待offer', '2024-01-28', '负责美团外卖商家端的前端技术架构', '7年以上前端经验，有大型项目架构经验', '45-65万', '北京', '全职');

INSERT INTO reminders (user_id, title, time, date, company, type, completed, priority) VALUES
(1, '跟进阿里巴巴HR', '10:00', '今天', '阿里巴巴', '跟进', false, 'high'),
(1, '腾讯技术面试准备', '14:00', '明天', '腾讯', '面试', false, 'urgent'),
(1, '提交字节跳动作业', '17:00', '1月23日', '字节跳动', '截止日期', false, 'high'),
(1, '完成简历更新', '09:00', '今天', '通用', '任务', true, 'medium'),
(1, '研究美团公司文化', '15:30', '昨天', '美团', '研究', true, 'low');

INSERT INTO insights (title, description, type, company, content, tags, read_time) VALUES
('腾讯面试攻略', '基于最新面试经验总结的技巧分享', '面试', '腾讯', '腾讯面试注重基础能力和项目经验。技术面试通常包含算法题、系统设计和项目深挖。建议准备常见的前端算法题，了解微信生态的技术架构，准备好详细的项目介绍。行为面试会关注团队协作和学习能力。', ARRAY['面试技巧', '算法', '项目经验'], '5分钟'),
('阿里巴巴企业文化深度解析', '了解阿里的价值观和工作氛围', '文化', '阿里巴巴', '阿里巴巴秉承"让天下没有难做的生意"的使命，注重客户第一、团队合作、拥抱变化等价值观。工作节奏较快，但提供良好的成长机会。面试时要体现出对用户体验的关注和商业思维。', ARRAY['企业文化', '价值观', '工作环境'], '8分钟'),
('字节跳动相似职位推荐', '发现了3个匹配您背景的新职位', '职位', '字节跳动', '基于您的技能匹配，推荐以下职位：1. 抖音前端工程师 - 负责短视频相关功能开发；2. 今日头条全栈工程师 - 负责推荐系统前端展示；3. 飞书前端专家 - 负责协作工具的用户体验优化。', ARRAY['职位推荐', '技能匹配', '新机会'], '3分钟'); 