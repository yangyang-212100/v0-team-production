"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Briefcase, Clock, MessageSquare, Mic, Plus, Users, Building2, Send, BarChart3, CheckCircle2, Circle, AlertCircle, Eye, Edit, ExternalLink, AlarmClock, Moon, Sun, TrendingUp, Calendar, Target, FileText, Settings } from 'lucide-react'

// 模拟数据
const mockJobs = [
  {
    id: 1,
    company: "腾讯",
    position: "高级前端工程师",
    status: "面试 - 第二轮",
    appliedDate: "2024-01-15",
    progress: 60,
    nextAction: "技术面试",
    nextActionDate: "2024-01-20",
    description: "负责微信小程序开发平台的前端架构设计和开发",
    requirements: "5年以上前端开发经验，熟悉React、Vue.js，有小程序开发经验",
    salary: "35-50万",
    location: "深圳",
    type: "全职",
  },
  {
    id: 2,
    company: "阿里巴巴",
    position: "全栈开发工程师",
    status: "已投递",
    appliedDate: "2024-01-18",
    progress: 25,
    nextAction: "跟进HR",
    nextActionDate: "2024-01-22",
    description: "负责淘宝商家后台系统的全栈开发",
    requirements: "熟悉Java、Spring Boot、React，有电商系统开发经验",
    salary: "30-45万",
    location: "杭州",
    type: "全职",
  },
  {
    id: 3,
    company: "字节跳动",
    position: "资深前端工程师",
    status: "电话筛选",
    appliedDate: "2024-01-10",
    progress: 40,
    nextAction: "准备现场面试",
    nextActionDate: "2024-01-25",
    description: "负责抖音创作者工具的前端开发",
    requirements: "熟悉现代前端技术栈，有视频处理相关经验优先",
    salary: "40-60万",
    location: "北京",
    type: "全职",
  },
  {
    id: 4,
    company: "美团",
    position: "前端技术专家",
    status: "已完成",
    appliedDate: "2024-01-05",
    progress: 100,
    nextAction: "等待offer",
    nextActionDate: "2024-01-28",
    description: "负责美团外卖商家端的前端技术架构",
    requirements: "7年以上前端经验，有大型项目架构经验",
    salary: "45-65万",
    location: "北京",
    type: "全职",
  },
]

const initialReminders = [
  {
    id: 1,
    title: "跟进阿里巴巴HR",
    time: "10:00",
    date: "今天",
    company: "阿里巴巴",
    type: "跟进",
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    title: "腾讯技术面试准备",
    time: "14:00",
    date: "明天",
    company: "腾讯",
    type: "面试",
    completed: false,
    priority: "urgent",
  },
  {
    id: 3,
    title: "提交字节跳动作业",
    time: "17:00",
    date: "1月23日",
    company: "字节跳动",
    type: "截止日期",
    completed: false,
    priority: "high",
  },
  {
    id: 4,
    title: "完成简历更新",
    time: "09:00",
    date: "今天",
    company: "通用",
    type: "任务",
    completed: true,
    priority: "medium",
  },
  {
    id: 5,
    title: "研究美团公司文化",
    time: "15:30",
    date: "昨天",
    company: "美团",
    type: "研究",
    completed: true,
    priority: "low",
  },
]

const mockInsights = [
  {
    id: 1,
    title: "腾讯面试攻略",
    description: "基于最新面试经验总结的技巧分享",
    type: "面试",
    company: "腾讯",
    content: "腾讯面试注重基础能力和项目经验。技术面试通常包含算法题、系统设计和项目深挖。建议准备常见的前端算法题，了解微信生态的技术架构，准备好详细的项目介绍。行为面试会关注团队协作和学习能力。",
    tags: ["面试技巧", "算法", "项目经验"],
    readTime: "5分钟",
  },
  {
    id: 2,
    title: "阿里巴巴企业文化深度解析",
    description: "了解阿里的价值观和工作氛围",
    type: "文化",
    company: "阿里巴巴",
    content: "阿里巴巴秉承'让天下没有难做的生意'的使命，注重客户第一、团队合作、拥抱变化等价值观。工作节奏较快，但提供良好的成长机会。面试时要体现出对用户体验的关注和商业思维。",
    tags: ["企业文化", "价值观", "工作环境"],
    readTime: "8分钟",
  },
  {
    id: 3,
    title: "字节跳动相似职位推荐",
    description: "发现了3个匹配您背景的新职位",
    type: "职位",
    company: "字节跳动",
    content: "基于您的技能匹配，推荐以下职位：1. 抖音前端工程师 - 负责短视频相关功能开发；2. 今日头条全栈工程师 - 负责推荐系统前端展示；3. 飞书前端专家 - 负责协作工具的用户体验优化。",
    tags: ["职位推荐", "技能匹配", "新机会"],
    readTime: "3分钟",
  },
]

const recommendedJobs = [
  {
    id: 5,
    company: "小米",
    position: "高级前端开发工程师",
    location: "北京",
    publishDate: "2天前",
    salary: "30-50万",
    tags: ["React", "Vue.js", "移动端"],
    applyUrl: "https://careers.xiaomi.com",
  },
  {
    id: 6,
    company: "滴滴",
    position: "全栈工程师",
    location: "北京",
    publishDate: "1周前",
    salary: "35-55万",
    tags: ["Node.js", "React", "地图服务"],
    applyUrl: "https://careers.didiglobal.com",
  },
  {
    id: 7,
    company: "京东",
    position: "前端架构师",
    location: "北京",
    publishDate: "3天前",
    salary: "50-80万",
    tags: ["架构设计", "团队管理", "电商"],
    applyUrl: "https://careers.jd.com",
  },
]

// 周数据统计
const weeklyData = [
  { day: "周一", applications: 2, interviews: 1, tasks: 5 },
  { day: "周二", applications: 3, interviews: 0, tasks: 7 },
  { day: "周三", applications: 1, interviews: 2, tasks: 4 },
  { day: "周四", applications: 4, interviews: 1, tasks: 6 },
  { day: "周五", applications: 2, interviews: 3, tasks: 8 },
  { day: "周六", applications: 0, interviews: 0, tasks: 2 },
  { day: "周日", applications: 0, interviews: 0, tasks: 3 },
]

export default function JobSearchAssistant() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [quickInput, setQuickInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [userName] = useState("小李")
  const [reminders, setReminders] = useState(initialReminders)
  const [jobs, setJobs] = useState(mockJobs)
  const [selectedInsight, setSelectedInsight] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [isAddAlarmOpen, setIsAddAlarmOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [newJob, setNewJob] = useState({
    company: "",
    position: "",
    status: "已投递",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    type: "全职",
  })
  const [newAlarm, setNewAlarm] = useState({
    title: "",
    time: "",
    date: "",
    company: "",
    type: "任务",
    priority: "medium",
  })

  const handleQuickInput = (input: string) => {
    console.log("处理输入:", input)
    // 这里可以添加AI处理逻辑
    setQuickInput("")
  }

  const toggleReminder = (id: number) => {
    setReminders(
      reminders.map((reminder) => 
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "早上好"
    if (hour < 18) return "下午好"
    return "晚上好"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已投递":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "电话筛选":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "面试 - 第一轮":
      case "面试 - 第二轮":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "已完成":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "已拒绝":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
      case "high":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20"
      case "medium":
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      case "low":
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-800/20"
      default:
        return "border-l-4 border-gray-300 bg-gray-50 dark:bg-gray-800/20"
    }
  }

  const addNewJob = () => {
    const job = {
      ...newJob,
      id: jobs.length + 1,
      appliedDate: new Date().toISOString().split("T")[0],
      progress: 25,
      nextAction: "跟进",
      nextActionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
    setJobs([...jobs, job])
    setNewJob({
      company: "",
      position: "",
      status: "已投递",
      description: "",
      requirements: "",
      salary: "",
      location: "",
      type: "全职",
    })
    setIsAddJobOpen(false)
  }

  const addNewAlarm = () => {
    const alarm = {
      ...newAlarm,
      id: reminders.length + 1,
      completed: false,
    }
    setReminders([...reminders, alarm])
    setNewAlarm({
      title: "",
      time: "",
      date: "",
      company: "",
      type: "任务",
      priority: "medium",
    })
    setIsAddAlarmOpen(false)
  }

  const updateJobStatus = (jobId: number, newStatus: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: newStatus,
              progress: newStatus === "已完成" ? 100 : 
                       newStatus === "面试 - 第二轮" ? 80 :
                       newStatus === "面试 - 第一轮" ? 60 :
                       newStatus === "电话筛选" ? 40 : 25,
            }
          : job,
      ),
    )
  }

  // 计算统计数据
  const completedTasks = reminders.filter((r) => r.completed).length
  const pendingTasks = reminders.filter((r) => !r.completed).length
  const totalApplications = jobs.length
  const interviewStage = jobs.filter((job) => 
    job.status.includes("面试") || job.status.includes("电话")
  ).length
  const completedApplications = jobs.filter((job) => job.status === "已完成").length

  // 圆形进度组件
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#3b82f6" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            fill="none" 
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>
    )
  }

  // 迷你柱状图组件
  const MiniBarChart = ({ data, height = 60 }) => {
    const maxValue = Math.max(...data.map((d) => d.applications))

    return (
      <div className="flex items-end space-x-1" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-primary rounded-t w-full min-h-[4px] transition-all duration-300"
              style={{
                height: `${maxValue > 0 ? (item.applications / maxValue) * (height - 20) : 4}px`,
              }}
            />
            <span className="text-xs text-muted-foreground mt-1">{item.day.slice(-1)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b bg-card px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">求职管家</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>仪表盘</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>洞察</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>职位管理</span>
            </TabsTrigger>
            <TabsTrigger value="alarms" className="flex items-center space-x-2">
              <AlarmClock className="h-4 w-4" />
              <span>提醒</span>
            </TabsTrigger>
          </TabsList>

          {/* 仪表盘标签页 */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* 个性化问候 */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {getGreeting()}，{userName}！
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      您有 {pendingTasks} 个待办任务，{interviewStage} 个面试机会正在进行中
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{totalApplications}</div>
                    <div className="text-sm text-muted-foreground">活跃申请</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 数据可视化概览 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 任务完成率 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <CircularProgress
                          percentage={Math.round((completedTasks / (completedTasks + pendingTasks)) * 100) || 0}
                          size={80}
                          color="#10b981"
                        />
                        <div className="text-center mt-3">
                          <p className="text-sm font-medium">任务完成率</p>
                          <p className="text-xs text-muted-foreground">
                            {completedTasks}/{completedTasks + pendingTasks}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>任务完成详情</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3">已完成任务 ({completedTasks})</h4>
                      {reminders
                        .filter((r) => r.completed)
                        .map((task) => (
                          <div key={task.id} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{task.title}</span>
                              <p className="text-xs text-muted-foreground">{task.company}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 mb-3">待完成任务 ({pendingTasks})</h4>
                      {reminders
                        .filter((r) => !r.completed)
                        .map((task) => (
                          <div key={task.id} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-2">
                            <Circle className="h-4 w-4 text-blue-500" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{task.title}</span>
                              <p className="text-xs text-muted-foreground">{task.company}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* 本周申请 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-sm text-muted-foreground">本周申请</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <MiniBarChart data={weeklyData} height={40} />
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>本周申请详情</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">{day.day}</span>
                        <div className="flex space-x-4 text-xs">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                            申请: {day.applications}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            面试: {day.interviews}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                            任务: {day.tasks}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* 面试阶段 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-2xl font-bold">{interviewStage}</p>
                          <p className="text-sm text-muted-foreground">面试阶段</p>
                        </div>
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <Progress value={(interviewStage / totalApplications) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {Math.round((interviewStage / totalApplications) * 100)}% 进入面试
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>面试阶段职位</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {jobs
                      .filter((job) => job.status.includes("面试") || job.status.includes("电话"))
                      .map((job) => (
                        <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {job.company} - {job.position}
                            </p>
                            <p className="text-sm text-muted-foreground">{job.status}</p>
                            <p className="text-xs text-muted-foreground">{job.location}</p>
                          </div>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* 成功率 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <CircularProgress 
                          percentage={Math.round((completedApplications / totalApplications) * 100) || 0} 
                          size={80} 
                          color="#f59e0b" 
                        />
                        <div className="text-center mt-3">
                          <p className="text-sm font-medium">成功率</p>
                          <p className="text-xs text-muted-foreground">
                            {completedApplications}/{totalApplications} 完成
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>申请成功详情</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-3">已完成申请 ({completedApplications})</h4>
                      {jobs
                        .filter((job) => job.status === "已完成")
                        .map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-2">
                            <div>
                              <span className="text-sm font-medium">{job.company}</span>
                              <p className="text-xs text-muted-foreground">{job.position}</p>
                            </div>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>
                        ))}
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 mb-3">进行中申请 ({totalApplications - completedApplications})</h4>
                      {jobs
                        .filter((job) => job.status !== "已完成")
                        .map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-2">
                            <div>
                              <span className="text-sm font-medium">{job.company}</span>
                              <p className="text-xs text-muted-foreground">{job.position}</p>
                            </div>
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 今日任务概览 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    今日任务概览
                  </div>
                  <Badge variant="outline">
                    {completedTasks}/{completedTasks + pendingTasks} 已完成
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 待办事项 */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <Circle className="h-4 w-4 mr-2 text-blue-500" />
                      待办事项 ({pendingTasks})
                    </h4>
                    <div className="space-y-2">
                      {reminders
                        .filter((r) => !r.completed && r.date === "今天")
                        .map((item) => (
                          <div key={item.id} className={`p-3 rounded-lg ${getPriorityColor(item.priority)}`}>
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                checked={item.completed} 
                                onCheckedChange={() => toggleReminder(item.id)} 
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.title}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-muted-foreground">{item.time}</p>
                                  <Badge variant="outline" className="text-xs">{item.company}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 已完成事项 */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      已完成 ({completedTasks})
                    </h4>
                    <div className="space-y-2">
                      {reminders
                        .filter((r) => r.completed)
                        .slice(0, 3)
                        .map((item) => (
                          <div key={item.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium line-through text-muted-foreground">{item.title}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-muted-foreground">{item.time}</p>
                                  <Badge variant="outline" className="text-xs">{item.company}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 紧急事项 */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      紧急事项 (2)
                    </h4>
                    <div className="space-y-2">
                      {reminders
                        .filter((r) => r.priority === "urgent" && !r.completed)
                        .map((item) => (
                          <div key={item.id} className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.title}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-red-600">{item.date} {item.time}</p>
                                  <Badge variant="outline" className="text-xs">{item.company}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快速输入对话框 */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">AI 助手</span>
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="告诉我您想做什么... (例如：'腾讯新职位'，'更新阿里到面试阶段')"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleQuickInput(quickInput)}
                    className="flex-1"
                  />
                  <Button
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    onClick={() => setIsListening(!isListening)}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleQuickInput(quickInput)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {isListening && (
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-xs text-muted-foreground">正在聆听...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 洞察标签页 */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">职场洞察</h2>
                <p className="text-muted-foreground">基于数据分析的个性化建议</p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                偏好设置
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockInsights.map((insight) => (
                <Dialog key={insight.id}>
                  <DialogTrigger asChild>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {insight.title}
                          </CardTitle>
                          <Badge variant="outline">{insight.company}</Badge>
                        </div>
                        <CardDescription>{insight.description}</CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{insight.readTime}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {insight.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          阅读详情
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        {insight.title}
                        <Badge variant="outline">{insight.company}</Badge>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {insight.readTime}
                          </span>
                          <span className="text-xs">类型: {insight.type}</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {insight.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed">{insight.content}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {/* 推荐职位 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  为您推荐
                </CardTitle>
                <CardDescription>基于您的申请历史和技能匹配</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{job.position}</h4>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">地点:</span>
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">薪资:</span>
                            <span className="font-medium">{job.salary}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">发布:</span>
                            <span>{job.publishDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {job.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full" onClick={() => window.open(job.applyUrl, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          立即申请
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 职位管理标签页 */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">职位管理</h2>
                <p className="text-muted-foreground">管理您的求职申请进度</p>
              </div>
              <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加申请
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>添加新的职位申请</DialogTitle>
                    <DialogDescription>
                      记录您的求职申请，跟踪进度
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">公司名称</Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">职位名称</Label>
                      <Input
                        id="position"
                        value={newJob.position}
                        onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                        placeholder="请输入职位名称"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">工作地点</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="请输入工作地点"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">工作类型</Label>
                      <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="全职">全职</SelectItem>
                          <SelectItem value="兼职">兼职</SelectItem>
                          <SelectItem value="实习">实习</SelectItem>
                          <SelectItem value="合同工">合同工</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">申请状态</Label>
                      <Select value={newJob.status} onValueChange={(value) => setNewJob({ ...newJob, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="已投递">已投递</SelectItem>
                          <SelectItem value="电话筛选">电话筛选</SelectItem>
                          <SelectItem value="面试 - 第一轮">面试 - 第一轮</SelectItem>
                          <SelectItem value="面试 - 第二轮">面试 - 第二轮</SelectItem>
                          <SelectItem value="已完成">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salary">薪资范围</Label>
                      <Input
                        id="salary"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        placeholder="例如：20-30万"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">职位描述</Label>
                      <Textarea
                        id="description"
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="请输入职位描述"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="requirements">职位要求</Label>
                      <Textarea
                        id="requirements"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        placeholder="请输入职位要求"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={addNewJob}>
                      添加申请
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{job.company}</CardTitle>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div>{job.position}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3 mr-1" />
                        {job.location} • {job.type}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>申请进度</span>
                          <span className="font-medium">{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">申请日期:</span>
                          <span>{job.appliedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">下一步:</span>
                          <span className="font-medium">{job.nextAction}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">薪资:</span>
                          <span className="font-medium">{job.salary}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              详情
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center justify-between">
                                {job.company} - {job.position}
                                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label>工作地点</Label>
                                  <p className="text-muted-foreground mt-1">{job.location}</p>
                                </div>
                                <div>
                                  <Label>工作类型</Label>
                                  <p className="text-muted-foreground mt-1">{job.type}</p>
                                </div>
                                <div>
                                  <Label>薪资范围</Label>
                                  <p className="text-muted-foreground mt-1">{job.salary}</p>
                                </div>
                                <div>
                                  <Label>申请进度</Label>
                                  <p className="text-muted-foreground mt-1">{job.progress}%</p>
                                </div>
                              </div>
                              <div>
                                <Label>职位描述</Label>
                                <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                              </div>
                              <div>
                                <Label>职位要求</Label>
                                <p className="text-sm text-muted-foreground mt-1">{job.requirements}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-1" />
                              更新
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>更新申请状态</DialogTitle>
                              <DialogDescription>
                                更新 {job.company} - {job.position} 的申请状态
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>选择新状态</Label>
                                <Select onValueChange={(value) => updateJobStatus(job.id, value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择状态" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="已投递">已投递</SelectItem>
                                    <SelectItem value="电话筛选">电话筛选</SelectItem>
                                    <SelectItem value="面试 - 第一轮">面试 - 第一轮</SelectItem>
                                    <SelectItem value="面试 - 第二轮">面试 - 第二轮</SelectItem>
                                    <SelectItem value="已完成">已完成</SelectItem>
                                    <SelectItem value="已拒绝">已拒绝</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 提醒标签页 */}
          <TabsContent value="alarms" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">提醒管理</h2>
                <p className="text-muted-foreground">管理您的任务和重要事项提醒</p>
              </div>
              <Dialog open={isAddAlarmOpen} onOpenChange={setIsAddAlarmOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加提醒
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新提醒</DialogTitle>
                    <DialogDescription>
                      设置重要事项的提醒，不错过任何机会
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">提醒标题</Label>
                      <Input
                        id="title"
                        value={newAlarm.title}
                        onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
                        placeholder="请输入提醒标题"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="time">时间</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newAlarm.time}
                          onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">日期</Label>
                        <Input
                          id="date"
                          value={newAlarm.date}
                          onChange={(e) => setNewAlarm({ ...newAlarm, date: e.target.value })}
                          placeholder="例如：今天、明天、1月25日"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">相关公司</Label>
                      <Input
                        id="company"
                        value={newAlarm.company}
                        onChange={(e) => setNewAlarm({ ...newAlarm, company: e.target.value })}
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">提醒类型</Label>
                        <Select
                          value={newAlarm.type}
                          onValueChange={(value) => setNewAlarm({ ...newAlarm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="任务">任务</SelectItem>
                            <SelectItem value="面试">面试</SelectItem>
                            <SelectItem value="跟进">跟进</SelectItem>
                            <SelectItem value="截止日期">截止日期</SelectItem>
                            <SelectItem value="研究">研究</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">优先级</Label>
                        <Select
                          value={newAlarm.priority}
                          onValueChange={(value) => setNewAlarm({ ...newAlarm, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">低</SelectItem>
                            <SelectItem value="medium">中</SelectItem>
                            <SelectItem value="high">高</SelectItem>
                            <SelectItem value="urgent">紧急</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddAlarmOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={addNewAlarm}>
                      添加提醒
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlarmClock className="h-5 w-5 mr-2" />
                    今日提醒
                  </CardTitle>
                  <CardDescription>
                    今天需要完成的任务和事项
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reminders
                      .filter((r) => r.date === "今天")
                      .map((reminder) => (
                        <div
                          key={reminder.id}
                          className={`p-3 rounded-lg border ${getPriorityColor(reminder.priority)} ${
                            reminder.completed ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={reminder.completed}
                                onCheckedChange={() => toggleReminder(reminder.id)}
                              />
                              <div>
                                <p
                                  className={`font-medium text-sm ${
                                    reminder.completed ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {reminder.title}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                                  <Badge variant="outline" className="text-xs">{reminder.type}</Badge>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">{reminder.company}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    即将到来
                  </CardTitle>
                  <CardDescription>
                    未来几天的重要提醒
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reminders
                      .filter((r) => r.date !== "今天" && !r.completed)
                      .sort((a, b) => {
                        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
                        return priorityOrder[b.priority] - priorityOrder[a.priority]
                      })
                      .map((reminder) => (
                        <div
                          key={reminder.id}
                          className={`p-3 rounded-lg border ${getPriorityColor(reminder.priority)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{reminder.title}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {reminder.date} {reminder.time}
                                  </p>
                                  <Badge variant="outline" className="text-xs">{reminder.type}</Badge>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">{reminder.company}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 提醒统计 */}
            <Card>
              <CardHeader>
                <CardTitle>提醒统计</CardTitle>
                <CardDescription>您的任务完成情况概览</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
                    <div className="text-sm text-muted-foreground">待完成</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-muted-foreground">已完成</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {reminders.filter(r => r.priority === "urgent" && !r.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">紧急</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {reminders.filter(r => r.priority === "high" && !r.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">高优先级</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
