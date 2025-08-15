"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Users, Briefcase, Eye } from 'lucide-react'
import { useJobs, useCompanyData, usePositionInsights } from "@/lib/hooks"

export default function InsightsPage() {
  const router = useRouter()
  const { jobs } = useJobs()
  const { companyData, fetchCompanyData } = useCompanyData()
  const { positionInsights, fetchPositionInsights } = usePositionInsights()
  const [isLoading, setIsLoading] = useState(false)

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
      }
    }
  }, [router])

  // 获取有洞察数据的公司列表
  const userCompanies = useMemo(() => {
    // 只显示有洞察数据的公司
    const companiesWithInsights = companyData.map(data => data.company_name)
    return companiesWithInsights
  }, [companyData])

  // 加载公司数据和岗位洞察
  useEffect(() => {
    setIsLoading(true)
    const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
    const userIdNum = userId ? parseInt(userId) : undefined
    
    // 获取所有用户申请的公司
    const allUserCompanies = Array.from(new Set(jobs.map(job => job.company)))
    
    // 获取公司数据
    fetchCompanyData(allUserCompanies)
    
    // 获取岗位洞察
    fetchPositionInsights(userIdNum)
    
    // 设置加载完成
    setTimeout(() => setIsLoading(false), 1000)
  }, [jobs, fetchCompanyData, fetchPositionInsights])

  // 获取公司数据
  const getCompanyData = useMemo(() => {
    return (companyName: string) => {
      return companyData.find(data => data.company_name === companyName)
    }
  }, [companyData])

  // 获取公司的岗位列表
  const getCompanyPositions = useMemo(() => {
    return (companyName: string) => {
      return jobs.filter(job => job.company === companyName)
    }
  }, [jobs])

  // 获取岗位洞察
  const getPositionInsight = useMemo(() => {
    return (companyName: string, position: string) => {
      return positionInsights.find(insight => 
        insight.company_name === companyName && insight.position === position
      )
    }
  }, [positionInsights])

  if (userCompanies.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F8FA] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>
        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4 text-gray-600 hover:text-[#B4C2CD] hover:bg-[#E0E9F0] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">职业洞察</h1>
          </div>
          
          <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg relative z-10">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-[#B4C2CD] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">暂无洞察数据</h3>
                <p className="text-gray-600 mb-4">
                  您还没有生成任何洞察数据，添加职位时勾选"需要生成岗位洞察"即可生成！
                </p>
                <div className="space-y-2">
                  <Button onClick={() => router.push("/")} className="w-full bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 rounded-xl">
                    去添加职位申请
                  </Button>
                  <p className="text-xs text-gray-500">
                    添加职位时请勾选"需要生成岗位洞察"选项
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4 text-gray-600 hover:text-[#B4C2CD] hover:bg-[#E0E9F0] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">职业洞察</h1>
              <p className="text-gray-600">AI为您分析的公司和岗位信息</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 relative z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4C2CD] mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载洞察数据，请稍后...</p>
            </div>
          </div>
        )}

        {/* Company Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {userCompanies.map(company => {
              const companyData = getCompanyData(company)
              const positions = getCompanyPositions(company)
              
              return (
                <Card key={company} className="hover:shadow-xl transition-all duration-300 bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-sm hover:shadow-lg relative z-10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-[#B4C2CD]" />
                        <CardTitle className="text-lg text-gray-800">{company}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-[#E0E9F0] text-[#4A5568] border-[#B4C2CD]">
                        {positions.length} 个职位
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {companyData ? 'AI已生成公司洞察' : '点击添加职位后AI将自动生成洞察'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* 公司级信息按钮 */}
                      {companyData && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=culture`)}
                            className="justify-start border-[#B4C2CD] text-[#4A5568] hover:bg-[#E0E9F0]/30 transition-colors"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            企业文化
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=products`)}
                            className="justify-start border-[#B4C2CD] text-[#4A5568] hover:bg-[#E0E9F0]/30 transition-colors"
                          >
                            <Briefcase className="h-4 w-4 mr-2" />
                            产品介绍
                          </Button>
                        </div>
                      )}
                      
                      {/* 岗位级信息 */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600">申请职位</h4>
                        {positions.map(position => {
                          const insight = getPositionInsight(company, position.position)
                          return (
                            <div key={position.id} className="flex items-center justify-between p-2 bg-[#E0E9F0]/30 rounded border border-[#B4C2CD]">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{position.position}</p>
                                <p className="text-xs text-gray-500">{position.status}</p>
                              </div>
                              {insight && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/insights/${encodeURIComponent(company)}?position=${encodeURIComponent(position.position)}`)}
                                  className="text-gray-600 hover:text-[#B4C2CD] hover:bg-[#E0E9F0]/30 transition-colors"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}