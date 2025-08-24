"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Users, Briefcase, Eye, Calendar, Target, FileText, RefreshCw } from 'lucide-react'
import { useJobs, useCompanyData, usePositionInsights } from "@/lib/hooks"
import { companyDataApi, positionInsightsApi } from "@/lib/database"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CompanyDetailPage({ params }: { params: Promise<{ company: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resolvedParams = use(params)
  const company = decodeURIComponent(resolvedParams.company)
  const type = searchParams.get('type')
  const position = searchParams.get('position')
  
  const { jobs } = useJobs()
  const { companyData, fetchCompanyData } = useCompanyData()
  const { positionInsights, fetchPositionInsights } = usePositionInsights()
  
  const [currentCompanyData, setCurrentCompanyData] = useState<any>(null)
  const [currentPositionInsight, setCurrentPositionInsight] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
      }
    }
  }, [router])

  // 加载公司数据
  const loadCompanyData = async () => {
    console.log('🔄 Loading company data for:', company)
    setLoading(true)
    try {
      const data = await companyDataApi.getByCompany(company)
      console.log('✅ Company data loaded:', data ? 'found' : 'not found')
      setCurrentCompanyData(data)
    } catch (error) {
      console.error('❌ Error loading company data:', error)
      setCurrentCompanyData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (company) {
      loadCompanyData()
    }
  }, [company])

  // 加载岗位洞察
  const loadPositionInsight = async () => {
    if (position && company) {
      console.log('🔄 Loading position insight for:', company, position)
      try {
        const data = await positionInsightsApi.getByCompanyAndPosition(company, position)
        console.log('✅ Position insight loaded:', data ? 'found' : 'not found')
        setCurrentPositionInsight(data)
      } catch (error) {
        console.error('❌ Error loading position insight:', error)
        setCurrentPositionInsight(null)
      }
    } else {
      setCurrentPositionInsight(null)
    }
  }

  useEffect(() => {
    if (company && position) {
      loadPositionInsight()
    }
  }, [company, position])

  // 获取公司的岗位列表
  const companyPositions = jobs.filter(job => job.company === company)

  // 格式化内容显示
  const formatContent = (content: string) => {
    if (!content) return '暂无信息'
    
    // 清理内容，去除多余的换行和空格
    let cleanedContent = content
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 去除多余的空行
      .replace(/\*\*/g, '') // 去除粗体标记
      .replace(/\*/g, '') // 去除斜体标记
      .replace(/`/g, '') // 去除代码标记
      .trim()
    
    // 统一数字格式 - 移除所有数字编号
    cleanedContent = cleanedContent
      // 移除数字编号（如 "1. " "2. " 等）
      .replace(/\d+\.\s*/g, '')
      // 处理破折号列表，确保每个破折号项单独一行
      .replace(/(-\s*)/g, '\n$1')
      // 处理冒号后的内容，确保换行
      .replace(/(：)([^：\n]+)/g, '$1\n$2')
      // 清理多余的空行
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
    
    return cleanedContent
  }

  // 刷新AI生成的内容
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // 删除现有的数据
      if (currentCompanyData) {
        await companyDataApi.delete(currentCompanyData.id)
      }
      if (currentPositionInsight) {
        await positionInsightsApi.delete(currentPositionInsight.id)
      }
      
      // 重新生成内容
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: company,
          position: position || companyPositions[0]?.position || ''
        })
      })
      
      if (response.ok) {
        // 重新加载数据，但不设置loading状态
        try {
          const companyData = await companyDataApi.getByCompany(company)
          setCurrentCompanyData(companyData)
          
          if (position) {
            const positionData = await positionInsightsApi.getByCompanyAndPosition(company, position)
            setCurrentPositionInsight(positionData)
          }
        } catch (error) {
          console.error('Error reloading data after refresh:', error)
        }
      }
    } catch (error) {
      console.error('Error refreshing insights:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E0E9F0] border-t-[#B4C2CD] mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">正在加载AI生成的内容...</p>
            <p className="text-sm text-gray-500 mt-2">请稍候，这可能需要几秒钟</p>
          </div>
        </div>
      )
    }

                   if (type === 'company' && currentCompanyData) {
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Building2 className="h-6 w-6 mr-3 text-[#B4C2CD]" />
              公司简介
            </h2>
            
            <div className="space-y-6">
              {/* 公司简介内容 */}
              {currentCompanyData.culture && currentCompanyData.culture.trim() && (
                <div>
                  <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-sm">
                    <CardContent className="pt-6">
                      <div className="text-sm leading-relaxed space-y-4">
                        {formatContent(currentCompanyData.culture).split('\n\n').map((paragraph, index) => (
                          <div key={index} className="mb-4 p-3 bg-[#E0E9F0]/30 rounded-lg border-l-4 border-[#B4C2CD]">
                            <div className="text-gray-800 whitespace-pre-line leading-6">
                              {paragraph}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 如果没有公司简介内容，显示暂无信息 */}
              {(!currentCompanyData.culture || !currentCompanyData.culture.trim()) && (
                <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">暂无信息</div>
              )}
            </div>
          </div>
        )
      }



    if (position) {
      if (!currentPositionInsight) {
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3 text-purple-600" />
              {position}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  面试经验
                </h3>
                <Card><CardContent className="pt-6"><div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">暂无信息</div></CardContent></Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  能力要求
                </h3>
                <Card><CardContent className="pt-6"><div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">暂无信息</div></CardContent></Card>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-purple-600" />
            {position}
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                面试经验
              </h3>
              <Card>
                <CardContent className="pt-6">
                  {currentPositionInsight.interview_json?.process?.length || currentPositionInsight.interview_json?.question_types?.length || currentPositionInsight.interview_json?.tips?.length ? (
                    <div className="space-y-6">
                      {currentPositionInsight.interview_json?.process?.length && (
                        <div>
                          <h4 className="font-medium mb-2">面试流程</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.interview_json.process.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                      {currentPositionInsight.interview_json?.question_types?.length && (
                        <div>
                          <h4 className="font-medium mb-2">常见题型</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.interview_json.question_types.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                      {currentPositionInsight.interview_json?.tips?.length && (
                        <div>
                          <h4 className="font-medium mb-2">面试技巧</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.interview_json.tips.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed space-y-4">
                      {formatContent(currentPositionInsight.interview_experience).split('\n\n').map((paragraph, index) => (
                        <div key={index} className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                          <div className="text-gray-800 whitespace-pre-line leading-6">{paragraph}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                能力要求
              </h3>
              <Card>
                <CardContent className="pt-6">
                  {currentPositionInsight.skills_json?.core_skills?.length || currentPositionInsight.skills_json?.resources?.length || currentPositionInsight.skills_json?.focus?.length ? (
                    <div className="space-y-6">
                      {currentPositionInsight.skills_json?.core_skills?.length && (
                        <div>
                          <h4 className="font-medium mb-2">核心技能</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.skills_json.core_skills.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                      {currentPositionInsight.skills_json?.resources?.length && (
                        <div>
                          <h4 className="font-medium mb-2">学习资源</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.skills_json.resources.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                      {currentPositionInsight.skills_json?.focus?.length && (
                        <div>
                          <h4 className="font-medium mb-2">准备方向与重点</h4>
                          <ul className="text-sm leading-7 list-disc pl-6 space-y-1">
                            {currentPositionInsight.skills_json.focus.map((item: string, idx: number) => (<li key={idx}>{item}</li>))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed space-y-4">
                      {formatContent(currentPositionInsight.skill_requirements).split('\n\n').map((paragraph, index) => (
                        <div key={index} className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                          <div className="text-gray-800 whitespace-pre-line leading-6">{paragraph}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-4 text-gray-800">选择要查看的内容</h3>
          <p className="text-muted-foreground mb-6">
            请从左侧导航选择要查看的公司信息或岗位洞察
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 提示：点击左侧的"企业文化"、"产品介绍"或具体职位名称来查看详细内容
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/insights")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回洞察
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{company}</h1>
              <p className="text-muted-foreground">AI生成的公司和岗位洞察</p>
            </div>
          </div>
          
          {/* 刷新按钮 */}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '重新生成中...' : '重新生成'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  导航菜单
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* 公司级信息 */}
                {currentCompanyData && (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">公司信息</h4>
                      <Button
                        variant={type === 'company' ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=company`)}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        公司简介
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* 岗位级信息 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">申请职位</h4>
                  {companyPositions.map(job => {
                    const isActive = position === job.position
                    return (
                      <Button
                        key={job.id}
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => router.push(`/insights/${encodeURIComponent(company)}?position=${encodeURIComponent(job.position)}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {job.position}
                        <Badge variant="secondary" className="ml-auto">
                          {job.status}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg relative z-10">
              <CardContent className="pt-6">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 