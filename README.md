# 求职管家 - Job Search Assistant

一个现代化的求职管理应用，帮助您跟踪求职进度、管理面试提醒和获取职场洞察。

## 功能特性

- 📊 **仪表盘**: 实时查看求职进度和统计数据
- 💼 **职位管理**: 跟踪申请状态和面试进度
- ⏰ **提醒系统**: 管理面试和任务提醒
- 🧠 **智能洞察**: 基于数据的个性化建议
- 🌙 **深色模式**: 支持明暗主题切换

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Hooks

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd v0-team-production
```

### 2. 安装依赖

```bash
npm install
```

### 3. 设置 Supabase 数据库

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. 在 Supabase SQL 编辑器中运行 `database/schema.sql` 文件内容
4. 设置行级安全策略 (RLS)

详细设置步骤请参考 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js 应用页面
├── components/             # UI 组件
│   └── ui/               # 基础 UI 组件
├── lib/                   # 工具函数和配置
│   ├── database.ts       # 数据库 API
│   ├── hooks.ts          # 自定义 Hooks
│   ├── supabase.ts       # Supabase 客户端
│   └── types.ts          # TypeScript 类型定义
├── database/              # 数据库相关文件
│   └── schema.sql        # 数据库表结构
└── public/               # 静态资源
```

## 数据库设计

### 主要表结构

- **jobs**: 职位申请记录
- **reminders**: 提醒事项
- **insights**: 职场洞察

## 开发指南

### 添加新功能

1. 在 `lib/types.ts` 中定义类型
2. 在 `lib/database.ts` 中添加 API 函数
3. 在 `lib/hooks.ts` 中创建自定义 Hook
4. 在页面组件中使用 Hook

### 环境变量

确保在 `.env.local` 中设置正确的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量
3. 部署

### 其他平台

确保设置正确的环境变量和构建命令。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License