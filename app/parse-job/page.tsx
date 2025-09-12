"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
// 假设组件路径拼写错误或路径配置有误，此处根据常见情况调整导入路径
// 若仍有问题，请检查项目配置和组件实际位置
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Sparkles, ArrowLeft } from 'lucide-react'
import { useJobs } from "@/lib/hooks"

const ParseJobPage = () => {
  const router = useRouter()
  const { addJob } = useJobs()
  const [aiJobText, setAiJobText] = useState("")
  const [parsedJobs, setParsedJobs] = useState<any[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [generateInsight, setGenerateInsight] = useState(false)
  const [maxLength] = useState(5000)

  // 职位状态选项
  const jobStatusOptions = [
    { value: "已投递", label: "已投递" },
    { value: "笔试", label: "笔试" },
    { value: "一面", label: "一面" },
    { value: "二面", label: "二面" },
    { value: "三面", label: "三面" },
    { value: "OFFER", label: "OFFER" },
    { value: "已拒绝", label: "已拒绝" }
  ]

  // 根据状态计算进度值
  const getProgressByStatus = (status: string): number => {
    switch (status) {
      case "已投递": return 25
      case "笔试": return 30
      case "一面": return 50
      case "二面": return 70
      case "三面": return 90
      case "OFFER": return 100
      case "已拒绝": return 0
      default: return 25
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

  // 解析岗位信息
  const parseJobText = async () => {
    if (!aiJobText.trim()) {
      alert("请先输入岗位信息")
      return
    }
    
    // 检查用户是否已登录
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      alert("请先登录后再添加职位")
      router.push('/login')
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
        applicationDate: new Date().toISOString().split('T')[0], // 当前日期
        progress: 25, // 初始进度25%
        type: "全职",
        url: job.url || '' // 保留原始URL或设为空
      }))
      
      setParsedJobs(jobsWithDefaults)
    } catch (error) {
      console.error('解析失败:', error)
      alert("解析失败，请检查输入格式")
    } finally {
      setIsParsing(false)
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
      router.push('/login')
      return
    }
    
    let successCount = 0
    let failCount = 0
    
    for (const job of parsedJobs) {
      try {
        const jobData = {
          ...job,
          user_id: parseInt(userId),
          applied_date: job.applicationDate || new Date().toISOString().split("T")[0],
          progress: job.progress || 25,
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
      alert(`成功添加 ${successCount} 个岗位${failCount > 0 ? `，失败 ${failCount} 个` : ''}`)
      // 重置表单
      setAiJobText("")
      setParsedJobs([])
      setGenerateInsight(false)
      // 返回首页
      router.push('/')
    } else {
      alert("添加失败，请重试")
    }
  }

  // 处理状态变更，同步更新进度
  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedJobs = [...parsedJobs]
    updatedJobs[index].status = newStatus
    updatedJobs[index].progress = getProgressByStatus(newStatus)
    setParsedJobs(updatedJobs)
  }

  // 处理输入变更
  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedJobs = [...parsedJobs]
    updatedJobs[index][field] = value
    setParsedJobs(updatedJobs)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E0E9F0] px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-[#B4C2CD]" />
          AI解析职位
        </h1>
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto p-6">
        {/* 输入区域 */}
        <div className="mb-8">
          <Label htmlFor="aiJobText" className="text-gray-700 font-medium text-sm mb-3 block">
            岗位信息文本（最大{maxLength}字符）
          </Label>
          <Textarea
            id="aiJobText"
            value={aiJobText}
            onChange={(e) => setAiJobText(e.target.value.slice(0, maxLength))}
            placeholder="请粘贴完整的岗位信息，包括公司名称、职位名称、岗位职责、任职要求等..."
            className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] min-h-[200px] text-gray-700"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {aiJobText.length}/{maxLength} 字符
            </p>
            <Button 
              onClick={parseJobText} 
              disabled={isParsing || !aiJobText.trim()}
              className="bg-black hover:bg-gray-800 text-white px-6"
            >
              {isParsing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>解析中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>开始解析</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* 洞察生成选项 */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-[#E0E9F0]">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="generateInsightForAI"
              checked={generateInsight}
              onCheckedChange={(checked) => setGenerateInsight(checked as boolean)}
              className="border-[#B4C2CD] data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white mt-1"
            />
            <div>
              <Label htmlFor="generateInsightForAI" className="text-gray-700 font-medium text-sm">
                自动生成公司和岗位洞察
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                选择后，AI将自动分析公司和岗位信息，生成详细的洞察报告，帮助您更好地了解目标公司和岗位。
              </p>
            </div>
          </div>
        </div>

        {/* 职位信息表单 - 默认显示 */}
        <div>
          {parsedJobs.length === 0 ? (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              职位信息表单
            </h3>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              解析结果预览 ({parsedJobs.length} 个岗位)
            </h3>
          )}
          
          <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
            {parsedJobs.length > 0 ? (
              parsedJobs.map((job, index) => (
                <Card key={index} className="border-[#E0E9F0] bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">公司名称 <span className="text-red-500">*</span></Label>
                        <Input
                          value={job.company || ''}
                          onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                          placeholder="请输入公司名称"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">职位名称 <span className="text-red-500">*</span></Label>
                        <Input
                          value={job.position || ''}
                          onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                          placeholder="请输入职位名称"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">投递状态</Label>
                        <Select value={job.status || "已投递"} onValueChange={(value) => handleStatusChange(index, value)}>
                          <SelectTrigger className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 text-gray-700">
                            <SelectValue placeholder="选择状态" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobStatusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">工作地点</Label>
                        <Input
                          value={job.location || ''}
                          onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                          placeholder="请输入工作地点"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">薪资待遇</Label>
                        <Input
                          value={job.salary || ''}
                          onChange={(e) => handleInputChange(index, 'salary', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                          placeholder="请输入薪资待遇"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm">投递日期</Label>
                        <Input
                          type="date"
                          value={job.applicationDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleInputChange(index, 'applicationDate', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <Label className="text-gray-700 font-medium text-sm">投递网址</Label>
                        <Input
                          value={job.url || ''}
                          onChange={(e) => handleInputChange(index, 'url', e.target.value)}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700"
                          placeholder="请输入投递网址（非必填）"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <Label className="text-gray-700 font-medium text-sm">岗位描述</Label>
                        <Textarea
                          value={job.description || ''}
                          onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                          rows={3}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <Label className="text-gray-700 font-medium text-sm">岗位要求</Label>
                        <Textarea
                          value={job.requirements || ''}
                          onChange={(e) => handleInputChange(index, 'requirements', e.target.value)}
                          rows={3}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">请在上方输入岗位信息并点击"开始解析"</p>
                <p className="text-sm text-gray-400 mt-1">解析后将自动填充职位信息</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex justify-center mt-8 pt-6 border-t border-[#E0E9F0]">
          <Button 
            onClick={() => router.back()}
            className="mr-4 bg-white text-black border-black hover:bg-gray-50 px-8 py-2.5"
          >
            返回
          </Button>
          {parsedJobs.length > 0 && (
            <Button 
              onClick={addParsedJobs}
              className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              确认添加 ({parsedJobs.length} 个岗位)
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ParseJobPage