"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Briefcase, Eye, RefreshCw, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface InsightsData {
  companyData: any
  positionData: any
}

export default function PositionInsightPage({ 
  params 
}: { 
  params: Promise<{ company: string; position: string }> 
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const company = decodeURIComponent(resolvedParams.company)
  const position = decodeURIComponent(resolvedParams.position)
  
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
      }
    }
  }, [router])

  // 获取职位洞察信息
  const fetchJobInsights = async (company: string, position: string) => {
    try {
      setIsLoading(true)
      
      // 直接从数据库获取洞察数据
      const companyDataResponse = await fetch(`/api/insights/company?company=${encodeURIComponent(company)}`)
      const positionDataResponse = await fetch(`/api/insights/position?company=${encodeURIComponent(company)}&position=${encodeURIComponent(position)}`)
      
      let companyData = null
      let positionData = null
      
      if (companyDataResponse.ok) {
        companyData = await companyDataResponse.json()
      }
      
      if (positionDataResponse.ok) {
        positionData = await positionDataResponse.json()
      }
      
      const data = { companyData, positionData }
      setInsightsData(data)
      return data
    } catch (error) {
      console.error('获取洞察信息失败:', error)
      alert('获取洞察信息失败，请重试')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // 刷新AI生成的内容
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // 重新生成内容
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: company,
          position: position
        })
      })
      
      if (response.ok) {
        // 重新获取数据
        await fetchJobInsights(company, position)
      }
    } catch (error) {
      console.error('Error refreshing insights:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

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

  useEffect(() => {
    if (company && position) {
      fetchJobInsights(company, position)
    }
  }, [company, position])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#4285f4]/10 to-[#2a97f3]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#4285f4]/10 to-[#2a97f3]/10 rounded-full blur-3xl"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-[#B4C2CD]" />
                公司洞察信息
              </h1>
              <p className="text-gray-600 mt-1">
                {company} - {position}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? '刷新中...' : '刷新'}</span>
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B4C2CD]"></div>
              <span className="ml-3 text-gray-600">正在获取洞察信息...</span>
            </div>
          ) : insightsData ? (
            <>
              {/* 公司简介 */}
              {insightsData.companyData && (
                <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-sm w-full">
                  <CardHeader className="pb-6 border-b border-[#E0E9F0] px-8 py-6">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                      公司简介
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 px-8 pb-8">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {formatContent(insightsData.companyData.culture || '暂无公司简介信息')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 岗位洞察 */}
              {insightsData.positionData && (
                <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-sm w-full">
                  <CardHeader className="pb-6 border-b border-[#E0E9F0] px-8 py-6">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                      岗位洞察
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 px-8 pb-8">
                    <div className="space-y-8">
                      {insightsData.positionData.interview_experience && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                            面试经验
                          </h4>
                          <div className="bg-[#E0E9F0]/30 rounded-lg p-6 border border-[#E0E9F0]/30">
                        <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {formatContent(insightsData.positionData.interview_experience)}
                        </div>
                      </div>
                        </div>
                      )}
                      
                      {insightsData.positionData.skill_requirements && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-[#B4C2CD]" />
                            技能要求
                          </h4>
                          <div className="bg-[#E0E9F0]/30 rounded-lg p-6 border border-[#E0E9F0]/30">
                        <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {formatContent(insightsData.positionData.skill_requirements)}
                        </div>
                      </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!insightsData.companyData && !insightsData.positionData && (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>暂无洞察信息</p>
                  <p className="text-sm mt-2">AI正在为您生成公司和岗位的洞察信息...</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>获取洞察信息失败</p>
              <p className="text-sm mt-2">请稍后重试</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
