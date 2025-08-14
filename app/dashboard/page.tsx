"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Bell, Briefcase, Clock, MessageSquare, Mic, Plus, Users, Building2, Send, BarChart3, CheckCircle2, Circle, AlertCircle, Eye, Edit, ExternalLink, AlarmClock, Moon, Sun, TrendingUp, Calendar, Target, FileText, Settings, Search } from 'lucide-react'
import { useJobs, useReminders, useInsights } from "@/lib/hooks"

export default function JobSearchAssistant() {
  const [userName, setUserName] = useState("小明")
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const router = useRouter()

  // 检查登录状态 - 只在客户端检查
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      const username = localStorage.getItem("username")
      if (!userId) {
        router.replace("/login")
      } else if (username) {
        setUserName(username)
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user_id")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "早上好"
    if (hour < 18) return "下午好"
    return "晚上好"
  }

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

  // 使用 Supabase hooks
  const { jobs, loading: jobsLoading, error: jobsError, addJob, updateJobStatus } = useJobs()
  const { reminders, loading: remindersLoading, error: remindersError, addReminder, toggleReminder } = useReminders()
  const { insights, loading: insightsLoading, error: insightsError } = useInsights()

  const handleToggleReminder = async (id: number, completed: boolean) => {
    await toggleReminder(id, completed)
  }

  const addNewJob = async () => {
    if (!newJob.company.trim() || !newJob.position.trim()) {
      alert("请先填写公司名称和职位名称")
      return
    }
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      alert("用户未登录")
      return
    }
    const job = {
      ...newJob,
      user_id: parseInt(userId),
      applied_date: new Date().toISOString().split("T")[0],
      progress: 25,
      next_action: "跟进",
      next_action_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
    const result = await addJob(job)
    if (result) {
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
  }

  const handleUpdateJobStatus = async (jobId: number, newStatus: string) => {
    const progress = newStatus === "已完成" ? 100 : 
                   newStatus === "面试 - 第二轮" ? 80 :
                   newStatus === "面试 - 第一轮" ? 60 :
                   newStatus === "电话筛选" ? 40 : 25
    await updateJobStatus(jobId, newStatus, progress)
  }

  // 统计数据
  const completedTasks = reminders.filter((r) => r.completed).length
  const pendingTasks = reminders.filter((r) => !r.completed).length
  const totalApplications = jobs.length
  const interviewStage = jobs.filter((job) => 
    job.status.includes("面试") || job.status.includes("电话")
  ).length
  const completedApplications = jobs.filter((job) => job.status === "已完成").length

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

  // 获取当前日期信息
  const today = new Date()
  const currentDate = today.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDates: Date[] = []
  
  // 生成一周的日期
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - today.getDay() + i)
    weekDates.push(date)
  }

  // 检查某天是否有任务
  const hasTaskOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return reminders.some(reminder => 
      reminder.date === dateStr || 
      reminder.date === '今天' && date.getDate() === today.getDate()
    )
  }

  // 加载和错误处理
  if (jobsLoading || remindersLoading || insightsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">正在加载数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 顶部Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="border-2 border-blue-500 rounded-lg px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600">
              <span className="text-white font-bold text-lg">职得</span>
            </div>
          </div>
          <div className="w-8 h-8 border border-blue-300 rounded-full bg-white shadow-sm"></div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 问候和日历区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-gray-600 mt-1">
              今天你有{pendingTasks}项待办
            </p>
          </div>

          {/* 日历 */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="flex space-x-4">
                {weekDays.map((day, index) => {
                  const date = weekDates[index]
                  const isToday = date.getDate() === currentDate
                  const hasTask = hasTaskOnDate(date)
                  const isSelected = selectedDate.getDate() === date.getDate() && 
                                   selectedDate.getMonth() === date.getMonth() && 
                                   selectedDate.getFullYear() === date.getFullYear()
                  return (
                    <div key={index} className="text-center relative">
                      <div className="text-sm text-gray-600 mb-1">{day}</div>
                      <div 
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all duration-200 relative ${
                          isToday 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                            : isSelected
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'text-gray-700 hover:bg-blue-50'
                        }`}
                        onClick={() => {
                          setSelectedDate(date)
                          setIsCalendarOpen(false) // 关闭弹窗，直接显示在下方
                        }}
                      >
                        {date.getDate()}
                        {hasTask && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      {/* 当前日期的指向箭头 */}
                      {isToday && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 待办事项 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {selectedDate.getDate() === currentDate ? '今日待办:' : `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日待办:`}
            </h3>
            <div className="space-y-3">
              {reminders
                .filter((r) => {
                  // 根据选择的日期过滤待办
                  if (selectedDate.getDate() === currentDate) {
                    // 今天：显示未完成的待办
                    return !r.completed
                  } else {
                    // 其他日期：显示该日期的待办
                    const dateStr = selectedDate.toISOString().split('T')[0]
                    return r.date === dateStr || r.date === '今天' && selectedDate.getDate() === currentDate
                  }
                })
                .slice(0, 3)
                .map((reminder) => (
                  <div key={reminder.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{reminder.title}</p>
                        <p className="text-sm text-gray-600">时间: {reminder.time}</p>
                        <p className="text-sm text-gray-600">地点: {reminder.company}</p>
                      </div>
                      <Checkbox
                        checked={reminder.completed}
                        onCheckedChange={() => handleToggleReminder(reminder.id, !reminder.completed)}
                      />
                    </div>
                  </div>
                ))}
              {reminders.filter((r) => {
                if (selectedDate.getDate() === currentDate) {
                  return !r.completed
                } else {
                  const dateStr = selectedDate.toISOString().split('T')[0]
                  return r.date === dateStr || r.date === '今天' && selectedDate.getDate() === currentDate
                }
              }).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>该日期暂无待办事项</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 职位信息区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">职位信息</h2>
            <Search className="h-5 w-5 text-blue-600" />
          </div>

          {jobs.filter(job => job.progress < 100).length === 0 ? (
            /* 空状态 - 新用户或全部完成 */
            <div 
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors bg-gradient-to-r from-blue-50 to-indigo-50"
              onClick={() => setIsAddJobOpen(true)}
            >
              <Plus className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">
                {jobs.length === 0 ? '请点击此处添加您的投递职位信息' : '恭喜！所有职位申请已完成，去OFFER页面查看结果'}
              </p>
              {jobs.length > 0 && (
                <Button 
                  onClick={() => router.push("/tasks")}
                  className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  查看OFFER
                </Button>
              )}
            </div>
          ) : (
                        /* 职位卡片列表 */
            <div className="space-y-4">
              {jobs.filter(job => job.progress < 100).map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-blue-50 border border-blue-200">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">{job.company}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-600 font-medium">{job.position}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">进度</span>
                        <span className="text-sm font-medium text-blue-700">{job.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Progress value={job.progress} className="h-2 bg-blue-100" />
                    </div>

                    <div className="flex space-x-2 mt-4">
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
                              <Select onValueChange={(value) => handleUpdateJobStatus(job.id, value)}>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 添加职位对话框 */}
          <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
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

          {/* 日历详情对话框 */}
          <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedDate.toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} 的任务
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {reminders
                  .filter((reminder) => {
                    const reminderDate = reminder.date === '今天' ? today : new Date(reminder.date)
                    return reminderDate.toDateString() === selectedDate.toDateString()
                  })
                  .map((reminder) => (
                    <div key={reminder.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">时间: {reminder.time}</p>
                          <p className="text-sm text-gray-600">地点: {reminder.company}</p>
                        </div>
                        <Checkbox
                          checked={reminder.completed}
                          onCheckedChange={() => handleToggleReminder(reminder.id, !reminder.completed)}
                        />
                      </div>
                    </div>
                  ))}
                {reminders.filter((reminder) => {
                  const reminderDate = reminder.date === '今天' ? today : new Date(reminder.date)
                  return reminderDate.toDateString() === selectedDate.toDateString()
                }).length === 0 && (
                  <p className="text-gray-500 text-center py-4">这一天没有任务</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-blue-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => router.push("/insights")}
          >
            <span className="text-sm">洞察</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-200"
            onClick={() => setIsAddJobOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => router.push("/tasks")}
          >
            <span className="text-sm">OFFER</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
