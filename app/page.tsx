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
import { Bell, Briefcase, Clock, MessageSquare, Mic, Plus, Users, Building2, Send, BarChart3, CheckCircle2, Circle, AlertCircle, Eye, Edit, ExternalLink, AlarmClock, Moon, Sun, TrendingUp, Calendar, Target, FileText, Settings, Search, LogOut, User, ChevronDown, Trash2, MapPin, DollarSign, X } from 'lucide-react'
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { useJobs, useReminders, useInsights } from "@/lib/hooks"
import { Logo } from "@/components/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function JobSearchAssistant() {
  const [userName, setUserName] = useState("小明")
  const [isAddJobOpen, setIsAddJobOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [generateInsight, setGenerateInsight] = useState(true)
  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false)
  const [isSearchJobOpen, setIsSearchJobOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isJobListSearching, setIsJobListSearching] = useState(false)
  const [jobListSearchQuery, setJobListSearchQuery] = useState("")
  const [jobListSearchResults, setJobListSearchResults] = useState<any[]>([])
  const router = useRouter()

  // 检查登录状态 - 只在客户端检查
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      const username = localStorage.getItem("username")
      if (!userId) {
        router.replace("/welcome")
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

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false)
    handleLogout()
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
    url: "",
  })

  // 使用 Supabase hooks
  const { jobs, loading: jobsLoading, error: jobsError, addJob, updateJobStatus, deleteJob } = useJobs()
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
      requirements: newJob.description, // 将岗位JD存储到requirements字段
    }
    console.log('Adding job:', job, 'generateInsight:', generateInsight)
    const result = await addJob(job, generateInsight)
    console.log('Add job result:', result)
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
        url: "",
      })
      setGenerateInsight(false) // 重置洞察选项
      setIsAddJobOpen(false) // 自动关闭窗口
      console.log('Dialog should close now')
    } else {
      console.log('Add job failed, result is null')
    }
  }

  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string>("")
  const [updatingDateTime, setUpdatingDateTime] = useState<string>("")
  const [updatingLocationType, setUpdatingLocationType] = useState<string>("线下")
  const [updatingLocation, setUpdatingLocation] = useState<string>("")
  const [updatingSalary, setUpdatingSalary] = useState<string>("")

  const handleUpdateJobStatus = async (jobId: number, newStatus: string) => {
    if (!newStatus) {
      alert("请选择新的状态")
      return
    }
    
    const progress = newStatus === "OFFER" ? 100 : 
                   newStatus === "三面" ? 90 :
                   newStatus === "二面" ? 70 :
                   newStatus === "一面" ? 50 :
                   newStatus === "笔试" ? 30 : 
                   newStatus === "已拒绝" ? 0 : 25
    
    const result = await updateJobStatus(
      jobId, 
      newStatus, 
      progress, 
      updatingDateTime || undefined,
      updatingLocationType || undefined,
      updatingLocation || undefined,
      updatingSalary || undefined
    )
    if (result) {
      // 更新成功后关闭对话框
      setUpdatingJobId(null)
      setUpdatingStatus("")
      setUpdatingDateTime("")
      setUpdatingLocationType("线下")
      setUpdatingLocation("")
      setUpdatingSalary("")
      console.log('Job status updated successfully')
    } else {
      console.log('Failed to update job status')
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (confirm("确定要删除这个职位申请吗？删除后无法恢复。")) {
      const result = await deleteJob(jobId)
      if (result) {
        // 删除成功后，检查是否需要删除洞察数据
        const deletedJob = jobs.find(job => job.id === jobId)
        if (deletedJob) {
          // 检查该公司是否还有其他职位
          const remainingJobs = jobs.filter(job => 
            job.id !== jobId && job.company === deletedJob.company
          )
          
          if (remainingJobs.length === 0) {
            // 如果该公司没有其他职位了，删除公司洞察数据
            try {
              await fetch(`/api/insights/delete-company`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ company: deletedJob.company }),
              })
            } catch (error) {
              console.error('Error deleting company insights:', error)
            }
          } else {
            // 如果该公司还有其他职位，只删除该职位的洞察数据
            try {
              await fetch(`/api/insights/delete-position`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  company: deletedJob.company, 
                  position: deletedJob.position 
                }),
              })
            } catch (error) {
              console.error('Error deleting position insights:', error)
            }
          }
        }
      }
    }
  }

  const searchJobs = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = jobs.filter(job => {
      const company = job.company || ''
      const position = job.position || ''
      const location = job.location || ''
      const salary = job.salary || ''
      const description = job.description || ''
      const requirements = job.requirements || ''
      const status = job.status || ''
      const type = job.type || ''

      const searchText = `${company} ${position} ${location} ${salary} ${description} ${requirements} ${status} ${type}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })

    setSearchResults(results)
  }

  const searchJobList = (query: string) => {
    if (!query.trim()) {
      setJobListSearchResults([])
      return
    }

    const results = jobs.filter(job => {
      const company = job.company || ''
      const position = job.position || ''
      const location = job.location || ''
      const salary = job.salary || ''
      const description = job.description || ''
      const requirements = job.requirements || ''
      const status = job.status || ''
      const type = job.type || ''

      const searchText = `${company} ${position} ${location} ${salary} ${description} ${requirements} ${status} ${type}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })

    setJobListSearchResults(results)
  }

  // 获取当前日期信息
  const today = new Date()

  const handleSelectJobForUpdate = (job: any) => {
    // 设置当前要更新的职位ID和状态
    setUpdatingJobId(job.id)
    setUpdatingStatus(job.status || "已投递")
    setUpdatingDateTime(job.interview_datetime || "")
    setUpdatingLocationType(job.interview_location_type || "线下")
    setUpdatingLocation(job.interview_location || "")
    setUpdatingSalary(job.salary || "")

    // 关闭搜索对话框，打开现有的更新对话框
    setIsSearchJobOpen(false)
  }

  // 获取某天的所有任务（包括提醒和面试/笔试）
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const tasks = []
    
    // 添加提醒任务
    const dayReminders = reminders.filter(reminder => 
      reminder.date === dateStr || 
      reminder.date === '今天' && date.getDate() === today.getDate()
    )
    tasks.push(...dayReminders.map(reminder => ({
      ...reminder,
      type: 'reminder',
      time: reminder.time
    })))
    
         // 添加面试/笔试任务（排除OFFER状态的职位）
     const dayInterviews = jobs.filter(job => 
       job.interview_datetime && 
       new Date(job.interview_datetime).toDateString() === date.toDateString() &&
       job.status !== "OFFER"
     )
    tasks.push(...dayInterviews.map(job => ({
      id: `interview-${job.id}`,
      title: `${job.company} - ${job.position}`,
      time: new Date(job.interview_datetime!).toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      company: job.company,
      position: job.position,
      interview_datetime: job.interview_datetime!,
      interview_location: job.interview_location,
      interview_location_type: job.interview_location_type,
      status: job.status,
      type: 'interview',
      completed: false
    })))
    
    // 按时间排序
    return tasks.sort((a, b) => {
      const timeA = a.time
      const timeB = b.time
      return timeA.localeCompare(timeB)
    })
  }

  // 检查任务是否已过期
  const isTaskExpired = (task: any, date: Date) => {
    // 检查日期是否已过
    const taskDate = new Date(date)
    const today = new Date()
    const isDatePassed = taskDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    if (isDatePassed) return true
    
    // 如果是今天，检查时间是否已过
    if (taskDate.getDate() === today.getDate() && 
        taskDate.getMonth() === today.getMonth() && 
        taskDate.getFullYear() === today.getFullYear()) {
      
      const taskTime = task.time
      const currentTime = today.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      return taskTime < currentTime
    }
    
    return false
  }

  // 统计数据
  const completedTasks = reminders.filter((r) => r.completed).length
  const todayTasks = getTasksForDate(today)
  const pendingTasks = todayTasks.filter((task) => !task.completed).length
  const totalApplications = jobs.length
  const interviewStage = jobs.filter((job) => 
    job.status.includes("面试") || job.status.includes("电话")
  ).length
  const completedApplications = jobs.filter((job) => job.status === "已完成").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已投递":
        return "bg-[#E0E9F0] text-[#4A5568] border-[#B4C2CD]"
      case "笔试":
        return "bg-[#FEF5E7] text-[#C05621] border-[#F6AD55]"
      case "一面":
        return "bg-[#FED7D7] text-[#C53030] border-[#FC8181]"
      case "二面":
        return "bg-[#FED7D7] text-[#C53030] border-[#FC8181]"
      case "三面":
        return "bg-[#FED7D7] text-[#C53030] border-[#FC8181]"
      case "OFFER":
        return "bg-[#C6F6D5] text-[#22543D] border-[#68D391]"
      case "已拒绝":
        return "bg-[#E2E8F0] text-[#64748B] border-[#CBD5E1]"
      default:
        return "bg-[#E0E9F0] text-[#4A5568] border-[#B4C2CD]"
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "已投递":
        return "bg-[#2a97f3]"
      case "笔试":
        return "bg-[#2a97f3]"
      case "一面":
        return "bg-[#2a97f3]"
      case "二面":
        return "bg-[#2a97f3]"
      case "三面":
        return "bg-[#2a97f3]"
      case "OFFER":
        return "bg-[#2a97f3]"
      case "已拒绝":
        return "bg-[#2a97f3]"
      default:
        return "bg-[#2a97f3]"
    }
  }

  const currentDate = today.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDates: Date[] = []
  
  // 生成当日和前后三天的日期（共7天，当日居中）
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    weekDates.push(date)
  }

  // 检查某天是否有任务
  const hasTaskOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const hasReminders = reminders.some(reminder => 
      reminder.date === dateStr || 
      reminder.date === '今天' && date.getDate() === today.getDate()
    )
         const hasInterviews = jobs.some(job => 
       job.interview_datetime && 
       new Date(job.interview_datetime).toDateString() === date.toDateString() &&
       job.status !== "OFFER"
     )
    return hasReminders || hasInterviews
  }

  // 检查某天是否有未过期的任务（用于日历指示器）
  const hasActiveTaskOnDate = (date: Date) => {
    const tasks = getTasksForDate(date)
    return tasks.some(task => !isTaskExpired(task, date))
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
     <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
        </div>
      
      {/* 顶部Header */}
      <header className="bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-[#E0E9F0] px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Logo size="lg" className="flex-shrink-0" />
              <div className="border-2 border-[#E0E9F0] rounded-xl px-4 py-2 bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] shadow-sm">
                <span className="text-gray-700 font-bold text-lg">职得</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
                className="relative h-8 w-8 rounded-full p-0 hover:bg-[#E0E9F0]/30"
            >
            <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-xl shadow-lg"
            >
              <DropdownMenuItem 
                className="flex items-center text-gray-700 hover:bg-[#E0E9F0]/30 focus:bg-[#E0E9F0]/30"
                onClick={() => router.push("/settings")}
              >
                <User className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                修改账号信息
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#E0E9F0]" />
              <DropdownMenuItem 
                className="flex items-center text-gray-700 hover:bg-[#E0E9F0]/30 focus:bg-[#E0E9F0]/30"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <LogOut className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="px-4 py-6 pb-24 space-y-6">
        {/* 问候和日历区域 */}
        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E9F0] relative z-10">
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
              <Calendar className="h-5 w-5 text-[#B4C2CD]" />
                             <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                                  {weekDates.map((date, index) => {
                    const isToday = date.getDate() === currentDate && 
                                   date.getMonth() === today.getMonth() && 
                                   date.getFullYear() === today.getFullYear()
                    const hasActiveTask = hasActiveTaskOnDate(date)
                    const isSelected = selectedDate.getDate() === date.getDate() && 
                                     selectedDate.getMonth() === date.getMonth() && 
                                     selectedDate.getFullYear() === date.getFullYear()
                    const dayName = weekDays[date.getDay()]
                    return (
                      <div key={index} className="text-center relative flex-shrink-0">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">{dayName}</div>
                       <div 
                         className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-200 relative ${
                           isToday 
                             ? 'bg-gradient-to-r from-[#4285f4] to-[#2a97f3] text-white shadow-lg' 
                             : isSelected
                             ? 'bg-[#acd6fa] text-gray-700 border-2 border-[#B4C2CD]'
                             : 'text-gray-700 hover:bg-[#E0E9F0]/50'
                         }`}
                         onClick={() => {
                           setSelectedDate(date)
                           setIsCalendarOpen(false) // 关闭弹窗，直接显示在下方
                         }}
                       >
                         {date.getDate()}
                                                  {hasActiveTask && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-[#B4C2CD] rounded-full border-2 border-white shadow-sm"></div>
                          )}
                         </div>
                                               {/* 当前日期的指向箭头 */}
                         {isToday && (
                           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                             <div className="w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-transparent border-t-[#B4C2CD]"></div>
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
                               {getTasksForDate(selectedDate)
                  .filter((task) => {
                    // 根据选择的日期过滤任务
                    if (selectedDate.getDate() === currentDate) {
                      // 今天：显示未完成的任务
                      return !task.completed
                    } else {
                      // 其他日期：显示该日期的所有任务
                      return true
                    }
                  })
                  .slice(0, 5)
                  .map((task) => {
                    const isExpired = isTaskExpired(task, selectedDate)
                    return (
                                         <div key={task.id} className={`rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                       isExpired 
                         ? "bg-gray-100 border-gray-300 opacity-75" 
                          : "bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] border-[#B4C2CD]/30"
                     }`}>
                                            <div className="flex items-start justify-between">
                         <div className="flex-1">
                                                     <div className="flex items-center justify-between mb-2">
                              <p className={`font-medium ${isExpired ? "text-gray-500" : "text-gray-800"}`}>{task.title}</p>
                              {task.type === 'interview' && (
                                <Badge className={`${isExpired ? "bg-gray-300 text-gray-600 border-gray-400" : getStatusColor((task as any).status)} text-xs px-2 py-1 flex-shrink-0`}>
                                  {(task as any).status}
                                </Badge>
                              )}
                            </div>
                           <p className={`text-sm mb-1 ${isExpired ? "text-gray-500" : "text-gray-600"}`}>时间: {task.time}</p>
                          
                                                     {task.type === 'interview' && (task as any).interview_location && (
                             <div className="mt-2">
                               {(task as any).interview_location_type === "线上" ? (
                                 <div className="flex items-center space-x-2">
                                   <span className={`text-sm ${isExpired ? "text-gray-500" : "text-gray-600"}`}>会议链接:</span>
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     className={`text-xs h-6 px-2 ${
                                       isExpired 
                                         ? "border-gray-400 text-gray-500 hover:bg-gray-200" 
                                         : "border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                                     }`}
                                     onClick={() => window.open((task as any).interview_location, '_blank')}
                                   >
                                     <ExternalLink className="h-3 w-3 mr-1" />
                                     跳转会议
                                   </Button>
                                 </div>
                               ) : (
                                 <div className="flex items-start space-x-2">
                                   <MapPin className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isExpired ? "text-gray-400" : "text-[#B4C2CD]"}`} />
                                   <div>
                                     <p className={`text-sm ${isExpired ? "text-gray-500" : "text-gray-600"}`}>面试地点:</p>
                                     <p className={`text-sm font-medium ${isExpired ? "text-gray-500" : "text-gray-700"}`}>{(task as any).interview_location}</p>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}
                           
                           {task.type === 'reminder' && (
                             <p className={`text-sm ${isExpired ? "text-gray-500" : "text-gray-600"}`}>地点: {task.company}</p>
                           )}
                        </div>
                        
                                                 {task.type === 'reminder' && (
                           <Checkbox
                             checked={task.completed}
                             onCheckedChange={() => handleToggleReminder(task.id as number, !task.completed)}
                           />
                         )}
                      </div>
                    </div>
                  )})}
               {getTasksForDate(selectedDate).filter((task) => {
                 if (selectedDate.getDate() === currentDate) {
                   return !task.completed
                 } else {
                   return true
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
         <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E9F0] relative z-10">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-gray-800">职位信息</h2>
             <div className="flex items-center space-x-2">
               {isJobListSearching ? (
                 <div className="flex items-center space-x-2">
                   <Input
                     value={jobListSearchQuery}
                     onChange={(e) => {
                       setJobListSearchQuery(e.target.value)
                       searchJobList(e.target.value)
                     }}
                     placeholder="搜索职位..."
                     className="w-48 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-8 text-gray-700 placeholder-gray-500 text-sm"
                     autoComplete="off"
                   />
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                       setIsJobListSearching(false)
                       setJobListSearchQuery("")
                       setJobListSearchResults([])
                     }}
                     className="h-8 w-8 p-0 text-[#B4C2CD] hover:bg-[#E0E9F0]/30"
                   >
                     <X className="h-4 w-4" />
                   </Button>
                 </div>
               ) : (
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setIsJobListSearching(true)}
                    className="h-8 w-8 p-0 text-black hover:bg-[#E0E9F0]/30"
                 >
                    <Search className="h-6 w-6" />
                 </Button>
               )}
             </div>
           </div>

                     {jobs.length === 0 ? (
            /* 空状态 - 新用户或全部完成 */
            <div 
              className="border-2 border-dashed border-[#B4C2CD] rounded-2xl p-8 text-center cursor-pointer hover:border-[#E0E9F0] hover:bg-[#E0E9F0]/20 transition-colors bg-gradient-to-r from-[#F5F8FA] to-[#E0E9F0]"
              onClick={() => setIsAddJobOpen(true)}
            >
              <Plus className="h-12 w-12 text-[#B4C2CD] mx-auto mb-4" />
                             <p className="text-gray-600 text-sm">
                 请点击此处添加您的投递职位信息
               </p>
                        </div>
                     ) : (
             /* 职位卡片列表 */
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {isJobListSearching && jobListSearchQuery ? (
                 // 显示搜索结果
                 jobListSearchResults.length > 0 ? (
                                     jobListSearchResults
                    .sort((a, b) => {
                      // 已拒绝的排在最后
                      if (a.status === "已拒绝" && b.status !== "已拒绝") return 1
                      if (a.status !== "已拒绝" && b.status === "已拒绝") return -1
                      // OFFER的排在已拒绝之前
                      if (a.status === "OFFER" && b.status !== "OFFER" && b.status !== "已拒绝") return 1
                      if (a.status !== "OFFER" && b.status === "OFFER" && a.status !== "已拒绝") return -1
                      // 其他按创建时间排序
                      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                    })
                     .map((job) => (
                       <Card key={job.id} className={`hover:shadow-xl transition-all duration-300 border rounded-2xl shadow-sm hover:shadow-lg ${
                         job.status === "已拒绝" 
                           ? "bg-gray-100/90 border-gray-400 opacity-90" 
                           : "bg-[#F8FAFC] border-[#E0E9F0]"
                       }`}>
                         <CardContent className="p-6">
                           <div className="flex items-start justify-between mb-4">
                             <div>
                               <h3 className={`font-semibold text-lg ${
                                 job.status === "已拒绝" ? "text-gray-500" : "text-gray-900"
                               }`}>{job.company}</h3>
                               <p className={`${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-gray-600"
                               }`}>{job.position}</p>
                             </div>
                             <Badge className={`${getStatusColor(job.status)} border rounded-full px-3 py-1 text-xs font-medium`}>
                               {job.status}
                             </Badge>
                           </div>
                           
                           <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center space-x-2">
                               <span className={`text-sm ${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-gray-500"
                               }`}>进度</span>
                               <span className={`text-sm font-medium ${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-[#B4C2CD]"
                               }`}>{job.progress}%</span>
                             </div>
                           </div>

                           <div className="mb-4">
                             <div className={`w-full rounded-full h-2 ${
                               job.status === "已拒绝" ? "bg-gray-200" : "bg-[#E0E9F0]"
                             }`}>
                               <div 
                                 className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.status)}`}
                                 style={{ width: `${job.progress}%` }}
                               />
                             </div>
                           </div>

                           <div className="flex space-x-2 mt-4">
                             <Dialog>
                               <DialogTrigger asChild>
                                 <Button variant="outline" size="sm" className="flex-1">
                                   <Eye className="h-4 w-4 mr-1" />
                                   详情
                                 </Button>
                               </DialogTrigger>
                               <DialogContent className="max-w-4xl max-h-[90vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl overflow-hidden">
                                 <DialogHeader className="px-6 py-4 border-b border-[#E0E9F0]">
                                   <DialogTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
                                     <div>
                                       <h2 className="text-2xl font-bold text-gray-800 mb-1">{job.company}</h2>
                                       <p className="text-lg text-gray-600">{job.position}</p>
                                     </div>
                                     <Badge className={`${getStatusColor(job.status)} text-sm px-3 py-1`}>{job.status}</Badge>
                                   </DialogTitle>
                                 </DialogHeader>
                                 <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                   {/* 基本信息 */}
                                   <div className="grid grid-cols-3 gap-4">
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">工作地点</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.location || '未填写'}</p>
                                     </div>
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">工作类型</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.type || '全职'}</p>
                                     </div>
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">申请进度</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.progress}%</p>
                                     </div>
                                   </div>

                                   {/* 面试信息 */}
                                   {(job.interview_datetime || job.interview_location) && (
                                     <div className="bg-[#E0E9F0]/30 rounded-lg p-4">
                                       <h4 className="font-medium text-gray-800 mb-3">面试安排</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {job.interview_datetime && (
                                           <div className="flex items-center space-x-2">
                                             <Clock className="h-4 w-4 text-[#B4C2CD]" />
                                             <div>
                                               <p className="text-sm text-gray-500">面试时间</p>
                                               <p className="font-medium text-gray-800">
                                                 {new Date(job.interview_datetime).toLocaleString('zh-CN')}
                                               </p>
                                             </div>
                                           </div>
                                         )}
                                         {job.interview_location && (
                                           <div className="flex items-start space-x-2">
                                             <MapPin className="h-4 w-4 text-[#B4C2CD] mt-1" />
                                             <div className="flex-1">
                                               <p className="text-sm text-gray-500 mb-2">
                                                 {job.interview_location_type === "线上" ? "会议链接" : "面试地点"}
                                               </p>
                                               <div className="space-y-2">
                                                 <p className="text-sm text-gray-600 break-all">
                                                   {job.interview_location}
                                                 </p>
                                                 {job.interview_location_type === "线上" && (
                                                   <Button
                                                     size="sm"
                                                     variant="outline"
                                                     className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                                                     onClick={() => window.open(job.interview_location, '_blank')}
                                                   >
                                                     <ExternalLink className="h-3 w-3 mr-1" />
                                                     跳转会议链接
                                                   </Button>
                                                 )}
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                   )}

                                   {/* 投递网址 */}
                                   {job.url && (
                                     <div>
                                       <Label className="text-gray-700 font-medium">投递网址</Label>
                                       <div className="mt-2 flex items-center space-x-3">
                                         <span className="text-sm text-gray-600 flex-1 truncate">{job.url}</span>
                                         <Button
                                           size="sm"
                                           variant="outline"
                                           className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                                           onClick={() => window.open(job.url, '_blank')}
                                         >
                                           <ExternalLink className="h-4 w-4 mr-1" />
                                           跳转
                                         </Button>
                                       </div>
                                     </div>
                                   )}

                                   {/* 岗位JD */}
                                   <div>
                                     <Label className="text-gray-700 font-medium">岗位JD</Label>
                                     <div className="mt-2 bg-[#E0E9F0]/10 rounded-lg p-4 border border-[#E0E9F0]/30 max-h-48 overflow-y-auto">
                                       <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                         {job.requirements || job.description || '暂无岗位JD信息'}
                                       </p>
                                     </div>
                                   </div>

                                   {/* 申请日期 */}
                                   <div className="text-sm text-gray-500 pb-4">
                                     申请日期：{job.applied_date}
                                   </div>
                                 </div>
                               </DialogContent>
                             </Dialog>

                             <Button 
                               size="sm" 
                               className="flex-1 bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 border border-[#B4C2CD]"
                               onClick={() => {
                                 setUpdatingJobId(job.id)
                                 setUpdatingStatus(job.status)
                                 setUpdatingDateTime("")
                                 setUpdatingLocationType("线下")
                                 setUpdatingLocation("")
                                 setUpdatingSalary(job.salary || "")
                               }}
                             >
                               <Edit className="h-4 w-4 mr-1" />
                               更新
                             </Button>

                             <Dialog open={updatingJobId === job.id} onOpenChange={(open) => {
                               if (!open) {
                                 setUpdatingJobId(null)
                                 setUpdatingStatus("")
                               }
                             }}>
                               <DialogContent className="max-w-lg max-h-[85vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl overflow-hidden">
                                 <DialogHeader className="pb-4 border-b border-[#E0E9F0] flex-shrink-0">
                                   <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
                                     <Edit className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                                     更新申请状态
                                   </DialogTitle>
                                   <DialogDescription className="text-gray-600 mt-1">
                                     更新 <span className="font-medium text-gray-700">{job.company}</span> - <span className="font-medium text-gray-700">{job.position}</span> 的申请状态
                                   </DialogDescription>
                                 </DialogHeader>
                                 
                                 <div className="py-6 space-y-6 px-1 overflow-y-auto max-h-[calc(85vh-200px)]">
                                   {/* 新状态选择 */}
                                   <div>
                                     <Label className="text-gray-700 font-medium mb-2 block">选择新状态</Label>
                                     <Select onValueChange={(value) => setUpdatingStatus(value)} value={updatingStatus}>
                                       <SelectTrigger className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white">
                                         <SelectValue placeholder="选择状态" />
                                       </SelectTrigger>
                                       <SelectContent>
                                         <SelectItem value="已投递">已投递</SelectItem>
                                         <SelectItem value="笔试">笔试</SelectItem>
                                         <SelectItem value="一面">一面</SelectItem>
                                         <SelectItem value="二面">二面</SelectItem>
                                         <SelectItem value="三面">三面</SelectItem>
                                         <SelectItem value="OFFER">OFFER</SelectItem>
                                         <SelectItem value="已拒绝">已拒绝</SelectItem>
                                       </SelectContent>
                                     </Select>
                                   </div>
                                   
                                   {/* 面试安排 */}
                                   <div className="bg-[#F5F8FA] rounded-lg p-4 border border-[#E0E9F0]/30">
                                     <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                       <Clock className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                                       面试安排
                                     </h4>
                                     
                                     <div className="space-y-4">
                                       {/* 时间选择 */}
                                       <div>
                                         <Label className="text-gray-700 font-medium text-sm mb-2 block">面试时间</Label>
                                         <DateTimePicker
                                           value={updatingDateTime}
                                           onChange={setUpdatingDateTime}
                                         />
                                       </div>

                                       {/* 地点类型 */}
                                       <div>
                                         <Label className="text-gray-700 font-medium text-sm mb-2 block">面试方式</Label>
                                         <Select onValueChange={(value) => setUpdatingLocationType(value)} value={updatingLocationType}>
                                           <SelectTrigger className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white">
                                             <SelectValue />
                                           </SelectTrigger>
                                           <SelectContent>
                                             <SelectItem value="线下">线下面试</SelectItem>
                                             <SelectItem value="线上">线上面试</SelectItem>
                                           </SelectContent>
                                         </Select>
                                       </div>
                                     </div>
                                     
                                     {/* 地点/链接输入 */}
                                     <div className="mt-4">
                                       <Label className="text-gray-700 font-medium text-sm mb-2 block">
                                         {updatingLocationType === "线上" ? "会议链接" : "面试地点"}
                                       </Label>
                                       <Input
                                         value={updatingLocation}
                                         onChange={(e) => setUpdatingLocation(e.target.value)}
                                         placeholder={updatingLocationType === "线上" ? "请输入会议链接（如：https://meet.google.com/xxx-yyyy-zzz）" : "请输入具体地点（如：北京市朝阳区xxx大厦15楼）"}
                                         className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white"
                                       />
                                     </div>
                                   </div>

                                   {/* 薪资信息 */}
                                   <div className="bg-[#F5F8FA] rounded-lg p-4 border border-[#E0E9F0]/30">
                                     <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                       <DollarSign className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                                       薪资信息
                                     </h4>
                                     
                                     <div>
                                       <Label className="text-gray-700 font-medium text-sm mb-2 block">薪资范围</Label>
                                       <Input
                                         value={updatingSalary}
                                         onChange={(e) => setUpdatingSalary(e.target.value)}
                                         placeholder="请输入薪资范围（如：15-25K、面议等）"
                                         className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white"
                                       />
                                     </div>
                                   </div>
                                 </div>
                                 
                                 <div className="flex justify-end space-x-3 pt-4 pb-4 border-t border-[#E0E9F0] bg-white px-6 flex-shrink-0">
                                   <Button 
                                     variant="outline" 
                                     onClick={() => {
                                       setUpdatingJobId(null)
                                       setUpdatingStatus("")
                                       setUpdatingDateTime("")
                                       setUpdatingLocationType("线下")
                                       setUpdatingLocation("")
                                       setUpdatingSalary("")
                                     }}
                                     className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30 px-6 py-2"
                                   >
                                     取消
                                   </Button>
                                   <Button 
                                     onClick={() => handleUpdateJobStatus(job.id, updatingStatus)}
                                     disabled={!updatingStatus}
                                     className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 disabled:opacity-50 px-6 py-2"
                                   >
                                     确认更新
                                   </Button>
                                 </div>
                               </DialogContent>
                             </Dialog>

                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="flex-1 border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                               onClick={() => handleDeleteJob(job.id)}
                             >
                               <Trash2 className="h-4 w-4 mr-1" />
                               删除
                             </Button>
                           </div>
                         </CardContent>
                       </Card>
                     ))
                   ) : (
                     <div className="col-span-full text-center py-12 text-gray-500">
                       <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                       <p className="text-lg font-medium">未找到相关职位</p>
                       <p className="text-sm text-gray-400 mt-1">请尝试其他关键词</p>
                     </div>
                   )
                 ) : (
                                       // 显示所有职位
                    jobs
                      .sort((a, b) => {
                        // 已拒绝的排在最后
                        if (a.status === "已拒绝" && b.status !== "已拒绝") return 1
                        if (a.status !== "已拒绝" && b.status === "已拒绝") return -1
                        // OFFER的排在已拒绝之前
                        if (a.status === "OFFER" && b.status !== "OFFER" && b.status !== "已拒绝") return 1
                        if (a.status !== "OFFER" && b.status === "OFFER" && a.status !== "已拒绝") return -1
                        // 其他按创建时间排序
                        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                      })
                     .map((job) => (
                       <Card key={job.id} className={`hover:shadow-xl transition-all duration-300 border rounded-2xl shadow-sm hover:shadow-lg ${
                         job.status === "已拒绝" 
                           ? "bg-gray-100/90 border-gray-400 opacity-90" 
                           : "bg-[#F8FAFC] border-[#E0E9F0]"
                       }`}>
                         <CardContent className="p-6">
                           <div className="flex items-start justify-between mb-4">
                             <div>
                               <h3 className={`font-semibold text-lg ${
                                 job.status === "已拒绝" ? "text-gray-500" : "text-gray-900"
                               }`}>{job.company}</h3>
                               <p className={`${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-gray-600"
                               }`}>{job.position}</p>
                             </div>
                             <Badge className={`${getStatusColor(job.status)} border rounded-full px-3 py-1 text-xs font-medium`}>
                               {job.status}
                             </Badge>
                           </div>
                           
                           <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center space-x-2">
                               <span className={`text-sm ${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-gray-500"
                               }`}>进度</span>
                               <span className={`text-sm font-medium ${
                                 job.status === "已拒绝" ? "text-gray-400" : "text-[#B4C2CD]"
                               }`}>{job.progress}%</span>
                             </div>
                           </div>

                           <div className="mb-4">
                             <div className={`w-full rounded-full h-2 ${
                               job.status === "已拒绝" ? "bg-gray-200" : "bg-[#E0E9F0]"
                             }`}>
                               <div 
                                 className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.status)}`}
                                 style={{ width: `${job.progress}%` }}
                               />
                             </div>
                           </div>

                           <div className="flex space-x-2 mt-4">
                             <Dialog>
                               <DialogTrigger asChild>
                                 <Button variant="outline" size="sm" className="flex-1">
                                   <Eye className="h-4 w-4 mr-1" />
                                   详情
                                 </Button>
                               </DialogTrigger>
                               <DialogContent className="max-w-4xl max-h-[90vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl overflow-hidden">
                                 <DialogHeader className="px-6 py-4 border-b border-[#E0E9F0]">
                                   <DialogTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
                                     <div>
                                       <h2 className="text-2xl font-bold text-gray-800 mb-1">{job.company}</h2>
                                       <p className="text-lg text-gray-600">{job.position}</p>
                                     </div>
                                     <Badge className={`${getStatusColor(job.status)} text-sm px-3 py-1`}>{job.status}</Badge>
                                   </DialogTitle>
                                 </DialogHeader>
                                 <div className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                   {/* 基本信息 */}
                                   <div className="grid grid-cols-3 gap-4">
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">工作地点</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.location || '未填写'}</p>
                                     </div>
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">工作类型</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.type || '全职'}</p>
                                     </div>
                                     <div className="bg-[#E0E9F0]/20 rounded-lg p-3">
                                       <Label className="text-gray-700 font-medium text-sm">申请进度</Label>
                                       <p className="text-gray-800 mt-1 font-medium">{job.progress}%</p>
                                     </div>
                                   </div>

                                   {/* 面试信息 */}
                                   {(job.interview_datetime || job.interview_location) && (
                                     <div className="bg-[#E0E9F0]/30 rounded-lg p-4">
                                       <h4 className="font-medium text-gray-800 mb-3">面试安排</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {job.interview_datetime && (
                                           <div className="flex items-center space-x-2">
                                             <Clock className="h-4 w-4 text-[#B4C2CD]" />
                                             <div>
                                               <p className="text-sm text-gray-500">面试时间</p>
                                               <p className="font-medium text-gray-800">
                                                 {new Date(job.interview_datetime).toLocaleString('zh-CN')}
                                               </p>
                                             </div>
                                           </div>
                                         )}
                                         {job.interview_location && (
                                           <div className="flex items-start space-x-2">
                                             <MapPin className="h-4 w-4 text-[#B4C2CD] mt-1" />
                                             <div className="flex-1">
                                               <p className="text-sm text-gray-500 mb-2">
                                                 {job.interview_location_type === "线上" ? "会议链接" : "面试地点"}
                                               </p>
                                               <div className="space-y-2">
                                                 <p className="text-sm text-gray-600 break-all">
                                                   {job.interview_location}
                                                 </p>
                                                 {job.interview_location_type === "线上" && (
                                                   <Button
                                                     size="sm"
                                                     variant="outline"
                                                     className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                                                     onClick={() => window.open(job.interview_location, '_blank')}
                                                   >
                                                     <ExternalLink className="h-3 w-3 mr-1" />
                                                     跳转会议链接
                                                   </Button>
                                                 )}
                                               </div>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     </div>
                                   )}

                                   {/* 投递网址 */}
                                   {job.url && (
                                     <div>
                                       <Label className="text-gray-700 font-medium">投递网址</Label>
                                       <div className="mt-2 flex items-center space-x-3">
                                         <span className="text-sm text-gray-600 flex-1 truncate">{job.url}</span>
                                         <Button
                                           size="sm"
                                           variant="outline"
                                           className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                                           onClick={() => window.open(job.url, '_blank')}
                                         >
                                           <ExternalLink className="h-4 w-4 mr-1" />
                                           跳转
                                         </Button>
                                       </div>
                                     </div>
                                   )}

                                   {/* 岗位JD */}
                                   <div>
                                     <Label className="text-gray-700 font-medium">岗位JD</Label>
                                     <div className="mt-2 bg-[#E0E9F0]/10 rounded-lg p-4 border border-[#E0E9F0]/30 max-h-48 overflow-y-auto">
                                       <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                         {job.requirements || job.description || '暂无岗位JD信息'}
                                       </p>
                                     </div>
                                   </div>

                                   {/* 申请日期 */}
                                   <div className="text-sm text-gray-500 pb-4">
                                     申请日期：{job.applied_date}
                                   </div>
                                 </div>
                               </DialogContent>
                             </Dialog>

                             <Button 
                               size="sm" 
                               className="flex-1 bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 border border-[#B4C2CD]"
                               onClick={() => {
                                 setUpdatingJobId(job.id)
                                 setUpdatingStatus(job.status)
                                 setUpdatingDateTime("")
                                 setUpdatingLocationType("线下")
                                 setUpdatingLocation("")
                                 setUpdatingSalary(job.salary || "")
                               }}
                             >
                               <Edit className="h-4 w-4 mr-1" />
                               更新
                             </Button>

                             <Dialog open={updatingJobId === job.id} onOpenChange={(open) => {
                               if (!open) {
                                 setUpdatingJobId(null)
                                 setUpdatingStatus("")
                               }
                             }}>
                               <DialogContent className="max-w-lg max-h-[85vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl overflow-hidden">
                                 <DialogHeader className="pb-4 border-b border-[#E0E9F0] flex-shrink-0">
                                   <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
                                     <Edit className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                                     更新申请状态
                                   </DialogTitle>
                                   <DialogDescription className="text-gray-600 mt-1">
                                     更新 <span className="font-medium text-gray-700">{job.company}</span> - <span className="font-medium text-gray-700">{job.position}</span> 的申请状态
                                   </DialogDescription>
                                 </DialogHeader>
                                 
                                 <div className="py-6 space-y-6 px-1 overflow-y-auto max-h-[calc(85vh-200px)]">
                                   {/* 新状态选择 */}
                                   <div>
                                     <Label className="text-gray-700 font-medium mb-2 block">选择新状态</Label>
                                     <Select onValueChange={(value) => setUpdatingStatus(value)} value={updatingStatus}>
                                       <SelectTrigger className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white">
                                         <SelectValue placeholder="选择状态" />
                                       </SelectTrigger>
                                       <SelectContent>
                                         <SelectItem value="已投递">已投递</SelectItem>
                                         <SelectItem value="笔试">笔试</SelectItem>
                                         <SelectItem value="一面">一面</SelectItem>
                                         <SelectItem value="二面">二面</SelectItem>
                                         <SelectItem value="三面">三面</SelectItem>
                                         <SelectItem value="OFFER">OFFER</SelectItem>
                                         <SelectItem value="已拒绝">已拒绝</SelectItem>
                                       </SelectContent>
                                     </Select>
                                   </div>
                                   
                                   {/* 面试安排 */}
                                   <div className="bg-[#F5F8FA] rounded-lg p-4 border border-[#E0E9F0]/30">
                                     <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                       <Clock className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                                       面试安排
                                     </h4>
                                     
                                     <div className="space-y-4">
                                       {/* 时间选择 */}
                                       <div>
                                         <Label className="text-gray-700 font-medium text-sm mb-2 block">面试时间</Label>
                                         <DateTimePicker
                                           value={updatingDateTime}
                                           onChange={setUpdatingDateTime}
                                         />
                                       </div>

                                       {/* 地点类型 */}
                                       <div>
                                         <Label className="text-gray-700 font-medium text-sm mb-2 block">面试方式</Label>
                                         <Select onValueChange={(value) => setUpdatingLocationType(value)} value={updatingLocationType}>
                                           <SelectTrigger className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white">
                                             <SelectValue />
                                           </SelectTrigger>
                                           <SelectContent>
                                             <SelectItem value="线下">线下面试</SelectItem>
                                             <SelectItem value="线上">线上面试</SelectItem>
                                           </SelectContent>
                                         </Select>
                                       </div>
                                     </div>
                                     
                                     {/* 地点/链接输入 */}
                                     <div className="mt-4">
                                       <Label className="text-gray-700 font-medium text-sm mb-2 block">
                                         {updatingLocationType === "线上" ? "会议链接" : "面试地点"}
                                       </Label>
                                       <Input
                                         value={updatingLocation}
                                         onChange={(e) => setUpdatingLocation(e.target.value)}
                                         placeholder={updatingLocationType === "线上" ? "请输入会议链接（如：https://meet.google.com/xxx-yyyy-zzz）" : "请输入具体地点（如：北京市朝阳区xxx大厦15楼）"}
                                         className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white"
                                       />
                                     </div>
                                   </div>

                                   {/* 薪资信息 */}
                                   <div className="bg-[#F5F8FA] rounded-lg p-4 border border-[#E0E9F0]/30">
                                     <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                       <DollarSign className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                                       薪资信息
                                     </h4>
                                     
                                     <div>
                                       <Label className="text-gray-700 font-medium text-sm mb-2 block">薪资范围</Label>
                                       <Input
                                         value={updatingSalary}
                                         onChange={(e) => setUpdatingSalary(e.target.value)}
                                         placeholder="请输入薪资范围（如：15-25K、面议等）"
                                         className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white"
                                       />
                                     </div>
                                   </div>
                                 </div>
                                 
                                 <div className="flex justify-end space-x-3 pt-4 pb-4 border-t border-[#E0E9F0] bg-white px-6 flex-shrink-0">
                                   <Button 
                                     variant="outline" 
                                     onClick={() => {
                                       setUpdatingJobId(null)
                                       setUpdatingStatus("")
                                       setUpdatingDateTime("")
                                       setUpdatingLocationType("线下")
                                       setUpdatingLocation("")
                                       setUpdatingSalary("")
                                     }}
                                     className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30 px-6 py-2"
                                   >
                                     取消
                                   </Button>
                                   <Button 
                                     onClick={() => handleUpdateJobStatus(job.id, updatingStatus)}
                                     disabled={!updatingStatus}
                                     className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 disabled:opacity-50 px-6 py-2"
                                   >
                                     确认更新
                                   </Button>
                                 </div>
                               </DialogContent>
                             </Dialog>

                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="flex-1 border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                               onClick={() => handleDeleteJob(job.id)}
                             >
                               <Trash2 className="h-4 w-4 mr-1" />
                               删除
                             </Button>
                           </div>
                         </CardContent>
                       </Card>
                     ))
                 )}
               </div>
           )}

                                           {/* 添加职位对话框 */}
                <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
              <DialogContent className="max-w-3xl w-[95vw] h-[90vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl flex flex-col">
                   <DialogHeader className="flex-shrink-0">
                 <DialogTitle className="text-xl font-bold text-gray-800">添加新的职位申请</DialogTitle>
                 <DialogDescription className="text-gray-600">
                       记录您的求职申请，跟踪进度
                     </DialogDescription>
                   </DialogHeader>
                                      <div className="flex-1 overflow-y-auto">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
                    <div>
                  <Label htmlFor="company" className="text-gray-700 font-medium text-sm mb-2 block">公司名称</Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        placeholder="请输入公司名称"
                      className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-11 text-gray-700 placeholder-gray-500"
                      autoComplete="off"
                      />
                    </div>
                    <div>
                  <Label htmlFor="position" className="text-gray-700 font-medium text-sm mb-2 block">职位名称</Label>
                      <Input
                        id="position"
                        value={newJob.position}
                        onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                        placeholder="请输入职位名称"
                      className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-11 text-gray-700 placeholder-gray-500"
                      autoComplete="off"
                      />
                    </div>
                    <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium text-sm mb-2 block">工作地点</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="请输入工作地点"
                      className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-11 text-gray-700 placeholder-gray-500"
                      autoComplete="off"
                      />
                    </div>
                    <div>
                  <Label htmlFor="status" className="text-gray-700 font-medium text-sm mb-2 block">投递状态</Label>
                      <Select value={newJob.status} onValueChange={(value) => setNewJob({ ...newJob, status: value })}>
                    <SelectTrigger className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-11 text-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="已投递">已投递</SelectItem>
                      <SelectItem value="笔试">笔试</SelectItem>
                      <SelectItem value="一面">一面</SelectItem>
                      <SelectItem value="二面">二面</SelectItem>
                      <SelectItem value="三面">三面</SelectItem>
                      <SelectItem value="OFFER">OFFER</SelectItem>
                      <SelectItem value="已拒绝">已拒绝</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                                 <div className="col-span-1 sm:col-span-2">
                   <Label htmlFor="url" className="text-gray-700 font-medium text-sm mb-2 block">投递网址</Label>
                       <Input
                       id="url"
                       value={newJob.url}
                       onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                       placeholder="请输入投递网址（可选）"
                       className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-11 text-gray-700 placeholder-gray-500"
                       autoComplete="off"
                       />
                     </div>
                     <div className="col-span-1 sm:col-span-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium text-sm mb-2 block">岗位JD</Label>
                       <Textarea
                         id="description"
                         value={newJob.description}
                         onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder="请输入岗位JD描述"
                      rows={4}
                      className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500"
                       />
                     </div>
                     <div className="col-span-1 sm:col-span-2">
                   <div className="flex items-center space-x-3 bg-[#F5F8FA] rounded-lg p-4 border border-[#E0E9F0]/30">
                     <Checkbox
                       id="generateInsight"
                       checked={generateInsight}
                       onCheckedChange={(checked) => setGenerateInsight(checked as boolean)}
                       className="border-[#B4C2CD] data-[state=checked]:bg-[#E0E9F0] data-[state=checked]:border-[#B4C2CD]"
                     />
                     <div>
                       <Label htmlFor="generateInsight" className="text-gray-700 font-medium text-sm">
                         需要生成岗位洞察
                       </Label>
                       <p className="text-sm text-gray-500 mt-1">
                         勾选后将自动生成该公司的企业文化、产品介绍和面试经验等洞察信息
                       </p>
                     </div>
                   </div>
                                         </div>
                                       </div>
                                      </div>
                                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-[#E0E9F0] flex-shrink-0">
                 <Button 
                   variant="outline" 
                   onClick={() => setIsAddJobOpen(false)}
                   className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30 px-6 py-2"
                 >
                       取消
                     </Button>
                 <Button 
                   onClick={addNewJob}
                   className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 font-medium px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                 >
                       添加申请
                     </Button>
                   </div>
                 </DialogContent>
               </Dialog>

          {/* 退出确认对话框 */}
          <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DialogContent className="max-w-md">
                            <DialogHeader>
                <DialogTitle className="flex items-center">
                  <LogOut className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                  确认退出
                              </DialogTitle>
                              <DialogDescription>
                  您确认要退出当前账号吗？退出后需要重新登录。
                              </DialogDescription>
                            </DialogHeader>
                  <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                >
                      取消
                    </Button>
                <Button 
                  onClick={handleLogoutConfirm}
                  className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700"
                >
                  确认退出
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

      {/* 加号选项对话框 */}
      <Dialog open={isAddOptionsOpen} onOpenChange={setIsAddOptionsOpen}>
        <DialogContent className="max-w-md bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-[#B4C2CD]" />
              选择操作
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              请选择您要进行的操作
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <Button 
              onClick={() => {
                setIsAddOptionsOpen(false)
                setIsAddJobOpen(true)
              }}
              className="w-full bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Briefcase className="h-5 w-5 mr-3" />
              添加新职位
            </Button>
            <Button 
              onClick={() => {
                setIsAddOptionsOpen(false)
                setIsSearchJobOpen(true)
              }}
              className="w-full bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Bell className="h-5 w-5 mr-3" />
              添加新提醒
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 职位搜索对话框 */}
      <Dialog open={isSearchJobOpen} onOpenChange={setIsSearchJobOpen}>
        <DialogContent className="max-w-2xl bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Search className="h-5 w-5 mr-2 text-[#B4C2CD]" />
              搜索职位添加提醒
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              搜索现有职位，为其添加面试/笔试提醒
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div>
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchJobs(e.target.value)
                }}
                placeholder="输入公司名称或职位名称进行搜索..."
                className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-12 text-gray-700 placeholder-gray-500"
                autoComplete="off"
              />
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all duration-200 border-[#E0E9F0] bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{job.company}</h3>
                          <p className="text-gray-600 text-base">{job.position}</p>
                          <p className="text-sm text-gray-500 mt-1">当前状态: {job.status}</p>
                        </div>
                        <Button
                          onClick={() => handleSelectJobForUpdate(job)}
                          className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          选择
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : searchQuery ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium">未找到相关职位</p>
                  <p className="text-sm text-gray-400 mt-1">请尝试其他关键词</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium">请输入关键词开始搜索</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F8FAFC]/95 backdrop-blur-sm border-t border-[#E0E9F0] px-4 py-3 shadow-lg z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#B4C2CD] transition-colors"
            onClick={() => router.push("/insights")}
          >
            <span className="text-sm">洞察</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] text-gray-700 hover:from-[#B4C2CD] hover:to-[#E0E9F0] shadow-lg transition-all duration-200"
            onClick={() => setIsAddOptionsOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#B4C2CD] transition-colors"
            onClick={() => router.push("/tasks")}
          >
            <span className="text-sm">OFFER</span>
          </Button>
                                </div>
      </div>
    </div>
  )
}
