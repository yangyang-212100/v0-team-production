# 求职管家 - 智能职业管理平台

专业的求职管理工具，帮助您高效管理求职流程。

## 功能特性

- 📊 智能仪表盘 - 实时监控求职进度
- 💼 职位管理 - 跟踪申请状态和进度
- ⏰ 任务提醒 - 重要事项及时提醒
- 📈 数据洞察 - 求职数据分析和建议
- 👤 用户系统 - 个人账户和任务管理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 创建 `.env.local` 文件：
```bash
cp env.example .env.local
```

2. 编辑 `.env.local` 文件，填入您的 Supabase 配置：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 运行数据库迁移

在 Supabase 控制台中执行 `database/schema.sql` 文件。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 使用流程

1. **注册账号** - 访问 `/register` 创建新账户
2. **登录系统** - 访问 `/login` 登录您的账户
3. **管理求职** - 使用仪表盘管理职位申请和任务
4. **查看任务** - 点击"我的任务"查看个人任务列表

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **数据库**: Supabase (PostgreSQL)
- **认证**: 自定义用户系统

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   ├── tasks/             # 任务管理页面
│   └── dashboard/         # 仪表板页面
├── components/            # UI 组件
├── lib/                  # 工具库和配置
├── database/             # 数据库脚本
└── public/              # 静态资源
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 许可证

MIT License