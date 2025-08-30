"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, X, ArrowLeft } from 'lucide-react'
import { useJobs } from "@/lib/hooks"

const AddJobPage = () => {
  const router = useRouter()
  const { addJob } = useJobs()
  
  // 状态管理
  const [aiJobText, setAiJobText] = useState("")
  const [parsedJobs, setParsedJobs] = useState<any[]>([])
  const [generateInsight, setGenerateInsight] = useState(true)
  const [isParsing, setIsParsing] = useState(false)
  
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
  
  // 添加解析后的岗位
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
      router.push("/")
      return
    }
    
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
          requirements: job.requirements || job.description,
          url: job.url || "",
        }
        
        const result = await addJob(jobData, generateInsight)
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
      // 成功添加后立即返回上一页，避免刷新
      router.back()
    } else {
      alert("添加失败，请重试")
    }
  }
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between py-4 border-b border-[#E0E9F0]">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">添加新职位</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/")}
        >
          <X className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 页面指引 */}
          <div className="p-5 bg-[#E0E9F0]/20 rounded-lg text-center text-gray-500">
            <p>您可以手动填写职位信息，或者在下方输入岗位描述文本并点击"开始解析"由AI自动填充</p>
          </div>
          {/* 输入区域 */}
          <div className="space-y-4">
            <Label htmlFor="aiJobText" className="text-gray-700 font-medium">
              岗位信息文本（最大5000字符）
            </Label>
            <Textarea
              id="aiJobText"
              value={aiJobText}
              onChange={(e) => setAiJobText(e.target.value)}
              placeholder="请粘贴岗位信息文本，支持多个岗位信息..."
              rows={10}
              maxLength={5000}
              className="border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500 resize-none h-64"
            />
            <div className="flex justify-between items-center">
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
          <div className="bg-[#E0E9F0]/20 rounded-lg p-5 border border-[#E0E9F0]/30">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="generateInsightForAI"
                checked={generateInsight}
                onCheckedChange={(checked) => setGenerateInsight(checked as boolean)}
                className="border-[#B4C2CD] data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"
              />
              <Label htmlFor="generateInsightForAI" className="text-gray-700 font-medium">
                自动生成公司和岗位洞察
              </Label>
            </div>
            <p className="text-sm text-gray-600">
              选择后，AI将自动分析公司和岗位信息，生成详细的洞察报告，帮助您更好地了解目标公司和岗位。
            </p>
          </div>
          
          {/* 职位信息表单 */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-gray-800">
              {parsedJobs.length > 0 ? `解析结果预览 (${parsedJobs.length} 个岗位)` : '职位信息表单'}
            </h2>
            
            <div className="space-y-5">
              {/* 确保至少有一个空表单供用户填写 */}
              {(parsedJobs.length > 0 ? parsedJobs : [{}]).map((job, index) => (
                <Card key={index} className="border-[#E0E9F0] bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">公司名称 <span className="text-red-500">*</span></Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">职位名称 <span className="text-red-500">*</span></Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">工作地点</Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">薪资待遇</Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">投递日期</Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">投递状态</Label>
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
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">工作类型</Label>
                        <select
                          value={job.type || '全职'}
                          onChange={(e) => {
                            const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                            updatedJobs[index] = { ...updatedJobs[index], type: e.target.value }
                            setParsedJobs(updatedJobs)
                          }}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 rounded-md px-3 py-2 w-full"
                        >
                          <option value="全职">全职</option>
                          <option value="兼职">兼职</option>
                          <option value="实习">实习</option>
                          <option value="合同工">合同工</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">投递网址</Label>
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
                      <div className="col-span-1 md:col-span-2">
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">岗位描述</Label>
                        <Textarea
                          value={job.description || ''}
                          onChange={(e) => {
                            const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                            updatedJobs[index] = { ...updatedJobs[index], description: e.target.value }
                            setParsedJobs(updatedJobs)
                          }}
                          rows={4}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <Label className="text-gray-700 font-medium text-sm mb-1 block">岗位要求</Label>
                        <Textarea
                          value={job.requirements || ''}
                          onChange={(e) => {
                            const updatedJobs = parsedJobs.length > 0 ? [...parsedJobs] : [{}]
                            updatedJobs[index] = { ...updatedJobs[index], requirements: e.target.value }
                            setParsedJobs(updatedJobs)
                          }}
                          rows={4}
                          className="mt-1 border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white/80 backdrop-blur-sm text-gray-700 resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              

            </div>
          </div>
        </div>
      </div>
      
      {/* 底部操作按钮 */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E0E9F0] p-4 shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
            className="bg-white text-black border-black hover:bg-gray-50 px-6 py-3"
          >
            取消
          </Button>
          {parsedJobs.length > 0 && (
            <Button 
              onClick={addParsedJobs}
              className="bg-black hover:bg-gray-50 hover:text-black font-medium px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              确认添加 ({parsedJobs.length} 个岗位)
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddJobPage