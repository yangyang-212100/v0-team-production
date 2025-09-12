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
import { Bell, Briefcase, Clock, MessageSquare, Mic, Plus, Users, Building2, Send, BarChart3, CheckCircle2, Circle, AlertCircle, Eye, Edit, ExternalLink, AlarmClock, Moon, Sun, TrendingUp, Calendar, Target, FileText, Settings, Search, LogOut, User, ChevronDown, Trash2, MapPin, DollarSign, X, Sparkles } from 'lucide-react'
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { useJobs, useReminders, useInsights, useEmails } from "@/lib/hooks"
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
  const [isAIJobParseOpen, setIsAIJobParseOpen] = useState(false)
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false)
  const [emailAuthCode, setEmailAuthCode] = useState("")
  const [isEmailAuthLoading, setIsEmailAuthLoading] = useState(false)
  const [hasEmailAuthCode, setHasEmailAuthCode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isJobListSearching, setIsJobListSearching] = useState(false)
  const [jobListSearchQuery, setJobListSearchQuery] = useState("")
  const [jobListSearchResults, setJobListSearchResults] = useState<any[]>([])
  const [aiJobText, setAiJobText] = useState(`腾讯 产品经理（技术背景）
https://join.qq.com/post_detail.html?postid=1149822276057976832
岗位描述
- 1、负责toB（或toG）平台产品的产品策划和运营工作，提供具有竞争力的产品方案，实现产品增长、商业化目标；
2、关注行业生态、同类产品动向，结合产品优势制定行业合作和市场运营方案，提升行业影响力；
3、持续关注云计算发展趋势，基于业界标杆和技术原理的分析，落地技术产品；
4、构建业务数据监控体系、IT支持及客服体系、渠道和营销体系，持续改善系统架构、运营效率和成本，提升销售转化效率；
5、进行业务调研和客户反馈收集，提炼通用需求并判断优先级，推进销售或客户的痛点问题持续解决。
岗位要求
- 1、计算机、软件、人工智能、大数据相关专业；
2、热爱互联网、热爱技术；对产品策划有激情，热爱思考，具有优秀的逻辑思维和创新能力；
3、有亲和力，擅于沟通，并有优秀的执行力来保障需求的落地；
4、有服务意识 ，用心满足客户诉求，愿意深入了解客户的应用场景；
5、善于面对挑战和质疑。
加分项或注意事项
- 有一定的编程能力者。
参加面试的城市
- 远程面试


腾讯 产品经理
https://join.qq.com/post_detail.html?postid=1149822272375377920
- 岗位描述
- 腾讯产品经理培训生项目，集中腾讯优势产品资源、培训资源和导师资源，打造未来产品经理领军人。项目聚焦AI领域，面向全球寻找最具潜力的AI产品人才。
你将：
1、参与核心AI战场的产品设计与功能优化，为亿万用户创造更前沿智能、科技驱动的便捷生活；
2、推动大模型技术落地为产品解决方案，洞察用户对AI的真实诉求，持续提供高价值服务；
3、开拓AI技术在多元业务场景下的融合与应用，探索产品创新路径，助力用户体验升级；
4、跨产品开展前沿AI领域的专项实战，让创意构想在丰富的真实场景中照进现实。
你可能在产品策划、产品运营、产品经理(技术背景)、行业应用等多元化产品岗位上，开启你的AI产品之路。下一次改变亿万用户生活的机遇，下一个记录在互联网历史中的AI时刻，等你创造！
- 岗位要求
- 1、本科及以上学历；
2、怀揣着做出优秀互联网产品的梦想，拥有对AI行业和产品的极大热情；
3、具备敏捷的洞察和思维能力，并且能把思考变为现实以不断满足用户和客户需求；
4、拥有优秀的逻辑思维与系统分析能力、技术敏感度及商业敏感度。
- 加分项或注意事项
- 1、计算机或算法类专业背景、了解大模型技术可加分；
2、拥有AI产品相关经历可加分。
【特别提醒】
欢迎在简历投递页面的"作品或个人主页"模块中上传你的个人作品或项目（包括不限于产品demo、用户体验报告、产品课题作业等形式，或是你在任意领域的代表作品），你所上传的个人作品或项目将会作为简历评估的重要参考！
- 工作地点
- 深圳总部 北京 上海 成都
- 参加面试的城市
- 远程面试

算法工程师-视觉智能与视频编解码创新
https://talent.dingtalk.com/campus/position-detail?lang=zh&positionId=199900420003
更新于 2025-08-18
技术类
分享职位
基础信息
毕业起止时间要求：
2025-06-01 ~ 2026-10-31
招聘类型：
技术类
招聘批次：
钉钉2026届秋季应届生招聘
职位描述
1. 当8K视频开始承载元宇宙的入口，当每帧画面都蕴含AI的智慧，阿里巴巴正引领全球视觉计算技术革命。我们为实时音视频频打造核心引擎，在视频会议、直播场景落地AI应用，用大模型重新定义视频语义理解——这不仅是技术突破，更是人机交互范式的颠覆。加入我们，你的算法将决定数十亿用户看见的世界
职位描述：
AI视觉大模型突破：构建多模态视频理解体系，攻关AIGC技术在企业协作场景的落地，包括但不限于音频驱动的视频数字人，AI Agent等
图像与视频质量增强：研发基于AI的实时视频通信系统，在RTC场景实现压缩失真消除、动态超分、光流插帧等技术的工业级部署
智能编码标准定义：优化AV1标准的落地开发，研发基于内容感知的编码算法、屏幕内容自适应算法
感知计算架构创新：设计轻量化模型蒸馏方案，实现视频及图像等AI模型在移动端的部署；探索时空注意力机制在视频语义分割中的应用，构建低至30ms延时的在线处理流水线
职位要求
2. 计算机视觉/模式识别/多媒体系统等方向硕士及以上学历，具有一作顶会（CVPR/ICCV/ECCV/ICML）或专利发明经验者优先
精通PyTorch/TensorRT/MNN，具备CUDA/OpenCL异构计算优化经验
深入理解视频编码基本原理，熟悉AV1/VVC等最新编码标准
AI能力特写：
具备以下任一领域突破性成果：视频生成、神经网络压缩、多目标跟踪检测
熟悉知识蒸馏、模型量化、模型剪枝、动态网络等边缘侧部署技术
加分项✓ 在Kaggle/CVPR Video Competition等竞赛中进入Top5%✓ 发表过VBM/TVT/TMM等多媒体领域顶刊论文✓ 有WebRTC实时通信系统开发经验
这里没有PPT考核，只有技术攻坚的生死时速。一段全新、有意思的旅程正待开启！为了更全面的展现你自己，你还可以在简历中附上你认为自己最有意思的爱好、特长、经历，或是对未来有意思的畅想，没有限制，此项非必填。加入我们，一起打开有意思的未来！
工作地点
杭州`)
  const [parsedJobs, setParsedJobs] = useState<any[]>([])
  const [isParsing, setIsParsing] = useState(false)
  
  // 邮件相关状态
  const [isEmailParseOpen, setIsEmailParseOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [parsedEmailResult, setParsedEmailResult] = useState<any>(null)
  const [isEmailParsing, setIsEmailParsing] = useState(false)
  const [isEmailUpdating, setIsEmailUpdating] = useState(false)
  const [updateResult, setUpdateResult] = useState<any>(null)
  const [isUpdateSuccessDialogOpen, setIsUpdateSuccessDialogOpen] = useState(false)
  const [updateSuccessInfo, setUpdateSuccessInfo] = useState<any>(null)
  
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
  const { emails, loading: emailsLoading, error: emailsError, fetchEmails } = useEmails()

  // 页面加载时检查授权码状态
  useEffect(() => {
    checkEmailAuthCode()
  }, [])

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

  // AI解析岗位信息
  const parseJobText = async () => {
    if (!aiJobText.trim()) {
      alert("请先输入岗位信息")
      return
    }
    
    // 检查用户是否已登录
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      alert("请先登录后再添加职位")
      setIsAIJobParseOpen(false)
      return
    }
    
    setIsParsing(true)
    try {
      // 使用AI解析文本，提取岗位信息
      const jobs = await parseJobTextWithAI(aiJobText)
      
      // 为每个解析的职位自动填充默认信息
      const jobsWithDefaults = jobs.map(job => ({
        ...job,
        status: "已投递",
        applied_date: new Date().toISOString().split('T')[0], // 当前日期
        progress: 25, // 初始进度25%
        type: "全职"
      }))
      
      setParsedJobs(jobsWithDefaults)
    } catch (error) {
      console.error('解析失败:', error)
      alert("解析失败，请检查输入格式")
    } finally {
      setIsParsing(false)
    }
  }

  // AI解析岗位信息的核心逻辑
  const parseJobTextWithAI = async (text: string): Promise<any[]> => {
    try {
      const response = await fetch('/api/insights/parse-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobText: text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '解析失败')
      }

      const data = await response.json()
      
      if (data.success && data.jobs) {
        return data.jobs
      } else {
        throw new Error('AI解析返回的数据格式不正确')
      }
    } catch (error) {
      console.error('AI解析岗位信息失败:', error)
      throw error
    }
  }

  // 批量添加解析后的岗位
  const addParsedJobs = async () => {
    if (parsedJobs.length === 0) {
      alert("没有可添加的岗位")
      return
    }
    
    // 验证必填字段
    const invalidJobs = parsedJobs.filter(job => !job.company?.trim() || !job.position?.trim())
    if (invalidJobs.length > 0) {
      alert("请确保所有岗位的公司名称和职位名称都已填写")
      return
    }
    
    // 检查用户是否已登录
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      alert("请先登录后再添加职位")
      setIsAIJobParseOpen(false)
      return
    }
    
    // 点击确认后立即关闭对话框
    setIsAIJobParseOpen(false)
    
    let successCount = 0
    let failCount = 0
    
    for (const job of parsedJobs) {
      try {
        const jobData = {
          ...job,
          user_id: parseInt(userId),
          applied_date: job.applied_date || new Date().toISOString().split("T")[0],
          status: job.status || "已投递",
          next_action: "跟进",
          next_action_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          requirements: job.requirements || job.description, // 优先使用requirements字段
          url: job.url || "",
        }
        
        const result = await addJob(jobData, generateInsight) // 根据用户选择决定是否生成洞察
        if (result) {
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        console.error('添加岗位失败:', error)
        failCount++
      }
    }
    
    if (successCount > 0) {
      // 添加完成后显示成功消息并重置表单状态
      alert(`成功添加 ${successCount} 个岗位${failCount > 0 ? `，失败 ${failCount} 个` : ''}`)
    } else {
      alert("添加失败，请重试")
    }
    
    // 无论成功失败都重置表单状态
    setAiJobText("")
    setParsedJobs([])
    setGenerateInsight(false)
  }

  const [updatingJobId, setUpdatingJobId] = useState<number | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string>("")
  const [updatingDateTime, setUpdatingDateTime] = useState<string>("")
  const [updatingLocationType, setUpdatingLocationType] = useState<string>("线下")
  const [updatingLocation, setUpdatingLocation] = useState<string>("")
  const [updatingSalary, setUpdatingSalary] = useState<string>("")
  


  // 检查用户是否有邮箱授权码 - 添加错误处理和超时
  const checkEmailAuthCode = async () => {
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      return false
    }

    try {
      // 添加超时处理
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
      
      const response = await fetch(`/api/user/auth-code-status?userId=${userId}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setHasEmailAuthCode(data.hasAuthCode)
        return data.hasAuthCode
      } else {
        console.warn('授权码状态检查失败，状态码:', response.status)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('授权码状态检查超时')
      } else {
        console.error('检查授权码状态失败:', error)
      }
      // 忽略错误，不影响应用功能
    }
    return false
  }

  // 邮箱授权码相关函数
  const handleEmailAuth = async () => {
    if (!emailAuthCode.trim()) {
      alert("请输入邮箱授权码")
      return
    }

    setIsEmailAuthLoading(true)
    try {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        alert("用户未登录")
        return
      }

      const response = await fetch('/api/user/update-auth-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: parseInt(userId),
          authCode: emailAuthCode 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '保存授权码失败')
      }

      alert("邮箱授权码保存成功！现在可以使用邮件解析功能了。")
      setIsEmailAuthOpen(false)
      setEmailAuthCode("")
      
      // 更新授权码状态
      await checkEmailAuthCode()
      
      // 关闭添加选项对话框，打开邮件解析功能
      setIsAddOptionsOpen(false)
      setIsEmailParseOpen(true)
      
    } catch (error) {
      console.error('保存授权码失败:', error)
      alert('保存授权码失败，请重试')
    } finally {
      setIsEmailAuthLoading(false)
    }
  }



  // 邮件解析功能入口
  const handleEmailParseClick = async () => {
    const hasAuth = await checkEmailAuthCode()
    if (!hasAuth) {
      // 如果没有授权码，打开授权码输入对话框
      setIsEmailAuthOpen(true)
    } else {
      // 如果有授权码，直接打开邮件解析功能
      setIsEmailParseOpen(true)
    }
  }

  // 邮件解析相关函数
  const parseEmailWithAI = async (emailContent: string, emailSubject: string) => {
    try {
      const response = await fetch('/api/insights/parse-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailContent, emailSubject }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '邮件解析失败')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI邮件解析失败:', error)
      throw error
    }
  }

  const handleParseEmail = async (email: any) => {
    // 检查邮件是否已经解析过
    if (email.parsed_date) {
      alert('该邮件已经解析过了')
      return
    }
    
    setSelectedEmail(email)
    setIsEmailParsing(true)
    
    try {
      const result = await parseEmailWithAI(email.body, email.subject)
      setParsedEmailResult(result)
      
      // 标记邮件为已解析
      await fetch('/api/emails/mark-parsed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          emailId: email.id, 
          parsedDate: new Date().toISOString() 
        }),
      })
      
      // 刷新邮件列表
      await fetchEmails()
      
    } catch (error) {
      console.error('解析邮件失败:', error)
      alert('解析邮件失败，请重试')
    } finally {
      setIsEmailParsing(false)
    }
  }

  const showUpdateSuccessDialog = (info: any) => {
    setUpdateSuccessInfo(info)
    setIsUpdateSuccessDialogOpen(true)
  }



  const handleRefreshJobStatus = async () => {
    if (!emails || emails.length === 0) {
      alert('没有邮件需要解析')
      return
    }

    // 过滤出未解析的邮件
    const unparsedEmails = emails.filter(email => !email.parsed_date)
    
    if (unparsedEmails.length === 0) {
      alert('所有邮件都已经解析过了')
      return
    }

    setIsEmailUpdating(true)
    let updatedCount = 0
    let errorCount = 0

    // 只解析未解析的邮件
    for (const email of unparsedEmails) {
      try {
        const result = await parseEmailWithAI(email.body, email.subject)
        
        if (result && result.company && result.position && result.action) {
          // 查找匹配的职位
          const matchingJob = jobs.find(job => 
            job.company === result.company && job.position === result.position
          )

          if (matchingJob) {
            // 更新职位状态
            let newStatus = result.action
            let newProgress = 25
            
            switch (result.action) {
              case '已投递':
                newProgress = 25
                break
              case '笔试':
                newProgress = 50
                break
              case '面试':
                newProgress = 75
                break
              case '已OFFER':
                newProgress = 100
                break
              case '已拒绝':
                newProgress = 0
                break
            }

            await updateJobStatus(
              matchingJob.id, 
              newStatus, 
              newProgress,
              result.datetime, // interview_datetime
              undefined, // interview_location_type
              result.url || result.location // interview_location
            )

            // 标记邮件为已解析
            await fetch('/api/emails/mark-parsed', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                emailId: email.id, 
                parsedDate: new Date().toISOString() 
              }),
            })

            updatedCount++
            
            // 显示更新成功信息
            showUpdateSuccessDialog({
              company: result.company,
              position: result.position,
              oldStatus: matchingJob.status,
              newStatus: newStatus,
              emailAction: result.action,
              datetime: result.datetime
            })
          }
        }
      } catch (error) {
        console.error(`解析邮件 ${email.id} 失败:`, error)
        errorCount++
      }
    }

    setIsEmailUpdating(false)
    
    if (updatedCount > 0) {
      alert(`成功更新 ${updatedCount} 个职位状态${errorCount > 0 ? `，${errorCount} 个失败` : ''}`)
      // 刷新数据
      await fetchEmails()
    } else if (errorCount > 0) {
      alert(`更新失败，请重试`)
    }
  }

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

  // 职位卡片状态框样式方案：所有字体改为黑色，框内按状态区分颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      // 已投递：白色背景，黑色文字，浅灰色边框
      case "已投递":
        return "bg-white text-black border-[#E0E9F0]"
      // 待处理：浅黄色背景，黑色文字，中黄色边框
      case "待处理":
      case "笔试":
        return "bg-[#FEF5E7] text-black border-[#F6AD55]"
      // 面试中：浅蓝色背景，黑色文字，天蓝色边框
      case "面试中":
      case "一面":
      case "二面":
      case "三面":
        return "bg-[#E0F2FE] text-black border-[#93C5FD]"
      // 已通过：绿色背景，黑色文字，嫩绿色边框
      case "已通过":
      case "OFFER":
        return "bg-[#DCFCE7] text-black border-[#86EFAC]"
      // 已拒绝：灰色背景，黑色文字，中灰色边框
      case "已拒绝":
        return "bg-[#F1F5F9] text-black border-[#CBD5E1]"
      // 默认状态：白色背景，黑色文字，浅灰色边框
      default:
        return "bg-white text-black border-[#E0E9F0]"
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
  if (jobsLoading || remindersLoading || insightsLoading || emailsLoading) {
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
              <div className="border-2 border-[#E0E9F0] rounded-xl px-4 py-2 bg-gradient-to-r from-[#4285f4] to-[#2a97f3] hover:from-[#2a97f3] hover:to-[#4285f4] shadow-sm hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">职得</span>
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
                          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-[#4285f4] to-[#2a97f3] rounded-full border-2 border-white shadow-sm"></div>
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
                           <div className="flex items-center justify-between mb-3">
                             <h3 className="text-lg font-semibold text-gray-800">
                               {selectedDate.getDate() === currentDate ? '今日待办:' : `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日待办:`}
                             </h3>
                             <Button
                               onClick={handleRefreshJobStatus}
                               className="bg-gradient-to-r from-[#4285f4] to-[#2a97f3] hover:from-[#2a97f3] hover:to-[#4285f4] text-white font-medium px-3 py-1 text-sm shadow-sm hover:shadow-md transition-all duration-200 !opacity-100 !important"
                               style={{ opacity: '1 !important' }}
                             >
                               {isEmailUpdating ? (
                                 <div className="flex items-center space-x-2">
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                                   <span>解析中...</span>
                  </div>
                               ) : (
                                 <div className="flex items-center space-x-2">
                                   <MessageSquare className="h-4 w-4" />
                                   <span>刷新职位状态</span>
                  </div>
                               )}
                             </Button>
                </div>
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

                 {/* 邮件解析功能区域 */}
                 <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#E0E9F0] relative z-10">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold text-gray-800 flex items-center">
                       <MessageSquare className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                       邮件解析功能
                     </h2>
                     <div className="flex items-center space-x-2">
                       <Button
                         onClick={handleEmailParseClick}
                         className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                       >
                         <MessageSquare className="h-4 w-4 mr-2" />
                         邮件解析
                       </Button>
                       <Button
                         onClick={handleRefreshJobStatus}
                         disabled={isEmailUpdating}
                         className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                       >
                         {isEmailUpdating ? (
                           <div className="flex items-center space-x-2">
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                             <span>更新中...</span>
                           </div>
                         ) : (
                           <div className="flex items-center space-x-2">
                             <TrendingUp className="h-4 w-4" />
                             <span>批量更新</span>
                           </div>
                         )}
                       </Button>

                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                       <CardContent className="p-4">
                         <div className="flex items-center space-x-2 mb-2">
                           <MessageSquare className="h-5 w-5 text-blue-600" />
                           <h3 className="font-semibold text-blue-800">邮件状态</h3>
                         </div>
                         <p className="text-blue-700 text-sm">
                           {emailsLoading ? "加载中..." : 
                             emails && emails.length > 0 
                               ? `共 ${emails.length} 封邮件` 
                               : "暂无邮件"}
                         </p>
                       </CardContent>
                     </Card>
                     
                     <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                       <CardContent className="p-4">
                         <div className="flex items-center space-x-2 mb-2">
                           <CheckCircle2 className="h-5 w-5 text-green-600" />
                           <h3 className="font-semibold text-green-800">已解析</h3>
                         </div>
                         <p className="text-green-700 text-sm">
                           {emails && emails.length > 0 
                             ? `${emails.filter(e => e.parsed_date).length} 封已解析` 
                             : "0 封已解析"}
                         </p>
                       </CardContent>
                     </Card>
                     
                     <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                       <CardContent className="p-4">
                         <div className="flex items-center space-x-2 mb-2">
                           <AlertCircle className="h-5 w-5 text-orange-600" />
                           <h3 className="font-semibold text-orange-800">待解析</h3>
                         </div>
                         <p className="text-orange-700 text-sm">
                           {emails && emails.length > 0 
                             ? `${emails.filter(e => !e.parsed_date).length} 封待解析` 
                             : "0 封待解析"}
                         </p>
                       </CardContent>
                     </Card>
                   </div>
                   
                   {!hasEmailAuthCode && (
                     <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                       <div className="flex items-center space-x-2">
                         <AlertCircle className="h-5 w-5 text-yellow-600" />
                         <p className="text-yellow-800 text-sm">
                           请先设置QQ邮箱授权码以启用邮件解析功能
                         </p>
                       </div>
                     </div>
                   )}
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
                                 <Button variant="outline" size="sm" className="flex-1 bg-white text-black border-black hover:bg-gray-800 hover:text-white">
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
                               className="flex-1 bg-white text-black border-black hover:bg-gray-50"
                               onClick={() => {
                                 router.push(`/insights/${encodeURIComponent(job.company)}/${encodeURIComponent(job.position)}`)
                               }}
                             >
                               <Eye className="h-4 w-4 mr-1" />
                               洞察
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
                                     className="bg-black hover:bg-gray-800 text-white disabled:opacity-50 px-6 py-2"
                                   >
                                     确认更新
                                   </Button>
                  </div>
                </DialogContent>
              </Dialog>

                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="flex-1 bg-white text-black border-black hover:bg-gray-800 hover:text-white"
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
                                 <Button variant="outline" size="sm" className="flex-1 bg-white text-black border-black hover:bg-gray-800 hover:text-white">
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
                               className="flex-1 bg-black hover:bg-gray-50 hover:text-black text-white border border-black"
                               onClick={() => {
                                 router.push(`/insights/${encodeURIComponent(job.company)}/${encodeURIComponent(job.position)}`)
                               }}
                             >
                               <Eye className="h-4 w-4 mr-1" />
                               洞察
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
                                     className="bg-black hover:bg-gray-800 text-white disabled:opacity-50 px-6 py-2"
                                   >
                                     确认更新
                                   </Button>
                        </div>
                               </DialogContent>
                             </Dialog>

                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="flex-1 bg-white text-black border-black hover:bg-gray-800 hover:text-white"
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
                   className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
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
                  className="bg-black hover:bg-gray-800 text-white"
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
                router.push('/add-job')
              }}
              className="w-full bg-black hover:bg-gray-800 text-white h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Briefcase className="h-5 w-5 mr-3" />
              添加新职位
                            </Button>
            <Button 
              onClick={() => {
                setIsAddOptionsOpen(false)
                router.push('/add-job')
              }}
              className="w-full bg-black hover:bg-gray-800 text-white h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="h-5 w-5 mr-3" />
              AI解析职位
            </Button>
            <Button 
              onClick={() => {
                setIsAddOptionsOpen(false)
                setIsSearchJobOpen(true)
              }}
              className="w-full bg-black hover:bg-gray-800 text-white h-14 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Bell className="h-5 w-5 mr-3" />
              添加新提醒
            </Button>

          </div>
        </DialogContent>
      </Dialog>

      {/* 邮箱授权码输入对话框 */}
      <Dialog open={isEmailAuthOpen} onOpenChange={setIsEmailAuthOpen}>
        <DialogContent className="max-w-md bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl">
                            <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-[#B4C2CD]" />
              邮箱授权码设置
                              </DialogTitle>
            <DialogDescription className="text-gray-600">
              请输入您的QQ邮箱授权码以启用邮件解析功能
            </DialogDescription>
                            </DialogHeader>
          <div className="py-6 space-y-6">
                                <div>
              <Label htmlFor="emailAuthCode" className="text-gray-700 font-medium text-sm mb-3 block">
                QQ邮箱授权码
              </Label>
              <Input
                id="emailAuthCode"
                type="password"
                value={emailAuthCode}
                onChange={(e) => setEmailAuthCode(e.target.value)}
                placeholder="请输入QQ邮箱授权码"
                className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm h-12 text-gray-700 placeholder-gray-500"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-2">
                授权码获取方法：登录QQ邮箱 → 设置 → 账户 → 开启SMTP服务 → 生成授权码
              </p>
                                </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsEmailAuthOpen(false)
                  setEmailAuthCode("")
                }}
                className="flex-1 bg-white text-black border-black hover:bg-gray-50"
              >
                取消
              </Button>
              <Button 
                onClick={handleEmailAuth}
                disabled={isEmailAuthLoading || !emailAuthCode.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isEmailAuthLoading ? "保存中..." : "保存授权码"}
              </Button>
                                </div>
                                </div>
        </DialogContent>
      </Dialog>

      {/* 邮件解析对话框 */}
      <Dialog open={isEmailParseOpen} onOpenChange={setIsEmailParseOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-[#B4C2CD]" />
              邮件解析功能
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              解析邮件内容，自动更新职位状态
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 py-4">
              {/* 邮件列表 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">邮件列表</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={fetchEmails}
                      disabled={emailsLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {emailsLoading ? "加载中..." : "刷新邮件"}
                    </Button>
                    <Button
                      onClick={handleRefreshJobStatus}
                      disabled={isEmailUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isEmailUpdating ? "更新中..." : "批量更新状态"}
                    </Button>
                  </div>
                </div>
                
                {emailsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">加载邮件中...</p>
                  </div>
                ) : emails && emails.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {emails.map((email) => (
                      <Card key={email.id} className="hover:shadow-lg transition-all duration-200 border-[#E0E9F0] bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                                                         <div className="flex-1">
                               <h4 className="font-semibold text-gray-800 text-sm mb-1">{email.subject}</h4>
                               <p className="text-gray-600 text-xs mb-2">发件人: {email.sender}</p>
                               <p className="text-gray-500 text-xs">时间: {new Date(email.date).toLocaleString('zh-CN')}</p>
                                                                <div className="flex items-center space-x-2 mt-1">
                                   {email.parsed_date ? (
                                     <Badge className="bg-green-100 text-green-800 text-xs">
                                       已解析
                                     </Badge>
                                   ) : (
                                     <Badge className="bg-orange-100 text-orange-800 text-xs">
                                       未解析
                                     </Badge>
                                   )}
                                   {email.parsed_date && (
                                     <span className="text-xs text-gray-500">
                                       解析时间: {new Date(email.parsed_date).toLocaleString('zh-CN')}
                                     </span>
                                   )}
                                 </div>
                               </div>
                               <Button
                                 onClick={() => handleParseEmail(email)}
                                 disabled={isEmailParsing || !!email.parsed_date}
                                 size="sm"
                                 className={`${
                                   email.parsed_date 
                                     ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                                     : "bg-blue-600 hover:bg-blue-700 text-white"
                                 }`}
                               >
                                 {isEmailParsing ? "解析中..." : email.parsed_date ? "已解析" : "解析"}
                             </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">暂无邮件</p>
                    <p className="text-sm text-gray-400 mt-1">请确保已正确配置邮箱授权码</p>
                  </div>
                )}
              </div>

              {/* 解析结果 */}
              {parsedEmailResult && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">解析结果</h3>
                  <Card className="border-[#E0E9F0] bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">公司：</span>
                          <span className="text-gray-900">{parsedEmailResult.company}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">职位：</span>
                          <span className="text-gray-900">{parsedEmailResult.position}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">操作：</span>
                          <span className="text-gray-900">{parsedEmailResult.action}</span>
                        </div>
                        {parsedEmailResult.datetime && (
                          <div>
                            <span className="font-medium text-gray-700">时间：</span>
                            <span className="text-gray-900">{new Date(parsedEmailResult.datetime).toLocaleString('zh-CN')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-[#E0E9F0] flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEmailParseOpen(false)
                setParsedEmailResult(null)
              }}
              className="bg-white text-black border-black hover:bg-gray-50"
            >
              关闭
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
                          className="bg-black hover:bg-gray-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
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

      {/* AI解析岗位信息对话框 */}
      <Dialog open={isAIJobParseOpen} onOpenChange={setIsAIJobParseOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-[#B4C2CD]" />
              添加新职位
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              粘贴岗位信息，AI将自动解析并提取关键信息
                              </DialogDescription>
                            </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 py-4">
              {/* 输入区域 */}
                              <div>
                <Label htmlFor="aiJobText" className="text-gray-700 font-medium text-sm mb-3 block">
                  岗位信息文本（最大5000字符）
                </Label>
                <Textarea
                  id="aiJobText"
                  value={aiJobText}
                  onChange={(e) => setAiJobText(e.target.value)}
                  placeholder="请粘贴岗位信息文本，支持多个岗位信息..."
                  rows={8}
                  maxLength={5000}
                  className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    已输入 {aiJobText.length} / 5000 字符
                  </span>
                  <Button
                    onClick={parseJobText}
                    disabled={!aiJobText.trim() || isParsing}
                    className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isParsing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                        解析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        开始解析
                      </>
                    )}
                  </Button>
                              </div>
                            </div>

              {/* 生成洞察选择 */}
              <div className="bg-[#E0E9F0]/20 rounded-lg p-4 border border-[#E0E9F0]/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="generateInsightForAI"
                    checked={generateInsight}
                    onCheckedChange={(checked) => setGenerateInsight(checked as boolean)}
                    className="border-[#B4C2CD] data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
                  />
                  <Label htmlFor="generateInsightForAI" className="text-gray-700 font-medium text-sm">
                    自动生成公司和岗位洞察
                  </Label>
                      </div>
                <p className="text-sm text-gray-600">
                  选择后，AI将自动分析公司和岗位信息，生成详细的洞察报告，帮助您更好地了解目标公司和岗位。
                </p>
                    </div>

              {/* 职位信息表单 - 始终显示，支持手动填写和AI解析填充 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {parsedJobs.length > 0 ? `解析结果预览 (${parsedJobs.length} 个岗位)` : '职位信息表单'}
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* 确保至少有一个空表单供用户填写 */}
                  {(parsedJobs.length > 0 ? parsedJobs : [{}]).map((job, index) => (
                    <Card key={index} className="border-[#E0E9F0] bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">公司名称 <span className="text-red-500">*</span></Label>
                            <Input
                              value={job.company || ''}
                              onChange={(e) => {
                                // 如果是新添加的空表单，先初始化parsedJobs
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], company: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                              placeholder="请输入公司名称"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">职位名称 <span className="text-red-500">*</span></Label>
                            <Input
                              value={job.position || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], position: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                              placeholder="请输入职位名称"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">工作地点</Label>
                            <Input
                              value={job.location || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], location: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                              placeholder="请输入工作地点"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">薪资待遇</Label>
                            <Input
                              value={job.salary || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], salary: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                              placeholder="请输入薪资待遇"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">投递日期</Label>
                            <Input
                              type="date"
                              value={job.applied_date || new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], applied_date: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">投递状态</Label>
                            <select
                              value={job.status || '已投递'}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], status: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 rounded-md px-3 py-2 w-full"
                            >
                              <option value="已投递">已投递</option>
                              <option value="待处理">待处理</option>
                              <option value="面试中">面试中</option>
                              <option value="已通过">已通过</option>
                              <option value="已拒绝">已拒绝</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium text-sm">投递网址</Label>
                            <Input
                              type="url"
                              value={job.url || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], url: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                              placeholder="请输入投递网址"
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-2">
                            <Label className="text-gray-700 font-medium text-sm">岗位描述</Label>
                            <Textarea
                              value={job.description || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], description: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              rows={3}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-2">
                            <Label className="text-gray-700 font-medium text-sm">岗位要求</Label>
                            <Textarea
                              value={job.requirements || ''}
                              onChange={(e) => {
                                const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                                updatedJobs[index] = { ...updatedJobs[index], requirements: e.target.value }
                                setParsedJobs(updatedJobs)
                              }}
                              rows={3}
                              className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* 无解析结果时的提示信息 */}
                  {parsedJobs.length === 0 && (
                    <div className="mt-4 p-4 bg-[#E0E9F0]/20 rounded-lg text-center text-gray-500">
                      <p className="text-sm">您可以手动填写职位信息，或者在上方输入岗位描述文本并点击"开始解析"由AI自动填充</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-[#E0E9F0] flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAIJobParseOpen(false)
                setAiJobText("")
                setParsedJobs([])
              }}
              className="bg-white text-black border-black hover:bg-gray-50 px-6 py-2"
            >
                      取消
                    </Button>
            {parsedJobs.length > 0 && (
              <Button 
                onClick={addParsedJobs}
                className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                确认添加 ({parsedJobs.length} 个岗位)
                    </Button>
            )}
                  </div>
                </DialogContent>
              </Dialog>



      {/* 更新成功对话框 */}
      <Dialog open={isUpdateSuccessDialogOpen} onOpenChange={setIsUpdateSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              职位状态更新成功
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {updateSuccessInfo && (
                  <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                      <span className="font-medium text-gray-700">公司：</span>
                      <span className="text-gray-900">{updateSuccessInfo.company}</span>
                                </div>
                    <div>
                      <span className="font-medium text-gray-700">职位：</span>
                      <span className="text-gray-900">{updateSuccessInfo.position}</span>
                              </div>
                    <div>
                      <span className="font-medium text-gray-700">原状态：</span>
                      <span className="text-gray-900">{updateSuccessInfo.oldStatus}</span>
                            </div>
                              <div>
                      <span className="font-medium text-gray-700">新状态：</span>
                      <span className="text-gray-900 text-green-600 font-semibold">{updateSuccessInfo.newStatus}</span>
                                </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">邮件操作：</span>
                      <span className="text-gray-900">{updateSuccessInfo.emailAction}</span>
                              </div>
                    {updateSuccessInfo.datetime && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">时间：</span>
                        <span className="text-gray-900">{new Date(updateSuccessInfo.datetime).toLocaleString('zh-CN')}</span>
                            </div>
                    )}
                          </div>
                        </div>
                  </div>
            )}
            </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsUpdateSuccessDialogOpen(false)}
              className="bg-black hover:bg-gray-800 text-white font-medium"
            >
              确定
            </Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F8FAFC]/95 backdrop-blur-sm border-t border-[#E0E9F0] px-4 py-3 shadow-lg z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#B4C2CD] transition-colors"
            onClick={() => router.push("/")}
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-sm">职位管理</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4285f4] to-[#2a97f3] text-white hover:from-[#2a97f3] hover:to-[#4285f4] shadow-lg transition-all duration-200"
            onClick={() => router.push('/add-job')}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#B4C2CD] transition-colors"
            onClick={() => router.push("/tasks")}
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm">OFFER</span>
          </Button>
                  </div>
      </div>
    </div>
  )
}
